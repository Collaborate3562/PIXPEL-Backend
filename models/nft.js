const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nftModel = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId, // suppose to be a valid mongodb object id. mongodb has specific ids for each doc and they have to be in a valid format
        ref: "User", // reference User collection 
    },
    tokenid: { type: Number, required: true, unique: true },
    developmentid: { type: Number,required: true },
    price: { type: Number, required: true },
    addressminted: { type: String, required: true },
    chain: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updatedAt: {
        type: Number
    }
});

nftModel.set('toJSON', { getters: true });
nftModel.pre(/^find/, function () {
    this.populate('user');
});

module.exports = mongoose.model('nft', nftModel);