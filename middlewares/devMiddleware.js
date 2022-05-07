const User=require('../models/user');
module.exports = (req, res, next) => {
    User.findById(req.user.id)
    .then((user)=>{
      if(user.role == 1)
        next();
      else
        return res.status(401).json("Not admin");
    }).catch(err=>{
      return res.status(401).json("Not admin");
    })
};
