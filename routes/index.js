const router = require('express').Router();
const path = require('path');

router.get("/api/", (req, res) => {
    res.send("Hello!");
});

module.exports = router;