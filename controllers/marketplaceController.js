const Market = require("../models/marketplace");

exports.createAuction = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'There was a problem creating auction.'
        });
    }
}

exports.bidNFT = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'There was a problem bidding NFT.'
        });
    }
}

exports.endAuction = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'There was a problem ending auction.'
        });
    }
}