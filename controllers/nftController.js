const NFT = require("../models/nft");

exports.mintNFT = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'There was a problem minting NFT.'
        });
    }
};