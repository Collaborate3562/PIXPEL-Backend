const router = require('express').Router();
const path = require('path');

// const requireAuth = require('./middlewares/requireAuth');
const authMiddleware = require("../middlewares/authMiddleware");
const {
    signup,
    signin,
    validateUser
} = require("../controllers/userController");

router.get("/api/", (req, res) => {
    res.send("Hello!");
});
// Aunthentication API
route.post("/signup/", validateUser, signup);
route.post("/signin/", validateUser, signin);
// 
route.post("/mint/", authMiddleware);

module.exports = router;