const router = require('express').Router();
const path = require('path');

const authMiddleware = require("../middlewares/authMiddleware");
const devMiddleware = require("../middlewares/devMiddleware");
const {
    signup,
    signin,
    validateUser
} = require("../controllers/userController");
const {
    mintNFT
} = require("../controllers/nftController");
const {
    createAuction,
    bidNFT,
    endAuction
} = require("../controllers/marketplaceController");

router.get("/api/", (req, res) => {
    res.send("Hello!");
});
// Aunthentication API
route.post("/signup/", validateUser, signup);
route.post("/signin/", validateUser, signin);
// NFT-related API
route.post("/mint/", authMiddleware, devMiddleware, mintNFT);
route.post("/market/auctioncreate/:id", authMiddleware, createAuction);
route.post("/market/bid/:id", authMiddleware, bidNFT);
route.post("/market/auctionend/:id", authMiddleware, endAuction);

module.exports = router;