const User = require('../models/user');

const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, verifyPassword } = require('../utils/authentication');


exports.signup = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array({ onlyFirstError: true });
      return res.status(422).json({ errors });
    }
  
    try {
        const { username, referrer } = req.body;
    
        const hashedPassword = await hashPassword(req.body.password);
    
        const userData = {
            username: username.toLowerCase().trim(),
            password: hashedPassword
    };
  
    const existingUsername = await User.findOne({
        username: userData.username
    });

    if (existingUsername) {
        return res.status(400).json({
            message: 'Username already exists.'
        });
    }
  
      //get new address
      // const respond = await getNewAddress();
      // console.log(respond.body);
      // if (respond.body && respond.body.error == null) {
      //   userData.address = respond.body.result;
  
    if (referrer && referrer != username) {
        const user = await User.findOne({ username: referrer });
        if (user) {
            userData.referrer = referrer;
            user.downlines.push(username);
            await user.save();
        }
    }
    const newUser = new User(userData);
    const savedUser = await newUser.save();
  
    if (savedUser) {
        const token = createToken(savedUser);
        const decodedToken = jwtDecode(token);
        const expiresAt = decodedToken.exp;
  
        const { username, role, id, created, doge, address, my_address } = savedUser;
        const userInfo = {
            username,
            role,
            id,
            doge,
            address,
            my_address,
            created,
            level: 1
        };
  
        return res.json({
            message: 'User created!',
            token,
            userInfo,
            expiresAt
        });
        } else {
            return res.status(400).json({
                message: 'There was a problem creating your account.'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'There was a problem creating your account.'
        });
    }
};
  
exports.authenticate = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        return res.status(422).json({ errors });
    }
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            username: username.toLowerCase()
        });
  
        if (!user) {
            // return res.status(403).json({
            //   message: 'Wrong username or password.'
            // });
            const { username } = req.body;
            const hashedPassword = await hashPassword(req.body.password);
            const userData = {
                username: username.toLowerCase().trim(),
                password: hashedPassword
            };
            const newUser = new User(userData);
            user = await newUser.save();
        }
  
        const passwordValid = await verifyPassword(password, user.password);
  
        if (passwordValid) {
            if (!user.address) {
                const respond = await getNewAddress();
                if (respond.body && respond.body.error == null) {
                    const data = respond.body.result;
                    user.address = data;
                    await user.save();
                }
            }
            const token = createToken(user);
            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;
            const { username, role, id, level, created, doge, address, my_address, profilePhoto, admin } = user;
            const userInfo = {
                username,
                role,
                id,
                level,
                created,
                doge,
                address,
                my_address,
                profilePhoto, admin
            };
            const visited = new Visited();
            visited.user = user._id;
            await visited.save();
    
            res.json({
                message: 'Authentication successful!',
                token,
                userInfo,
                expiresAt
            });
        } else {
            res.status(403).json({
                message: 'Wrong username or password.'
            });
        }
    } catch (error) {
        console.log(error);s
        return res.status(400).json({
            message: 'Something went wrong.'
        });
    }
};
  
exports.profile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (req.body.avatar) {
        if (user.profilePhoto) {
            require('fs').unlinkSync('./uploads/avatars/' + user.profilePhoto);
        }
        user.profilePhoto = user.username + '.jpg';
        await user.save();
        var base64Data = req.body.avatar.replace(/^data:image\/jpeg;base64,/, '');
        require('fs').writeFile(
            './uploads/avatars/' + user.profilePhoto,
            base64Data,
            'base64',
            function (err) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ error: err });
                } else {
                    return res.status(200).json({ profilePhoto: user.profilePhoto });
                }
            }
        );
    } else {
      return res.status(400).json({});
    }
};
  
exports.changePassword = async (req, res, next) => {
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    let user = await User.findById(req.user.id);
    const passwordValid = await verifyPassword(password, user.password);
  
    if (passwordValid) {
        user.password = await hashPassword(newPassword);
        await user.save();
        return res.status(200).json({
            message: 'Password changed!'
        });
    } else return res.status(401).json({ error: 'Password incorrect!' });
};

exports.validateUser = [
    body('username')
        .exists()
        .trim()
        .withMessage('is required')

        .notEmpty()
        .withMessage('cannot be blank'),
  
    // .isLength({ max: 16 })
    // .withMessage('must be at most 16 characters long')
  
    // .matches(/^[a-zA-Z0-9_-]+$/)
    // .withMessage('contains invalid characters'),
  
    body('password')
        .exists()
        .trim()
        .withMessage('is required')

        .notEmpty()
        .withMessage('cannot be blank')

        .isLength({ min: 6 })
        .withMessage('must be at least 6 characters long')

        .isLength({ max: 50 })
        .withMessage('must be at most 50 characters long')
];