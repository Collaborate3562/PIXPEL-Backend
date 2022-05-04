const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketModel = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId, // suppose to be a valid mongodb object id. mongodb has specific ids for each doc and they have to be in a valid format
        ref: "User", // reference User collection 
    },
    tokenid: { type: Number, required: true },
    lastbidder: { 
        type: mongoose.Schema.Types.ObjectId, // suppose to be a valid mongodb object id. mongodb has specific ids for each doc and they have to be in a valid format
        ref: "User", // reference User collection 
    },
    address: { type: String, required: true },
    price: { type: String, required: true },
    expiretime: { type: Number, required: true },
    saletype: { type: String, required: true},
    isauction: { type: Boolean },
    created: { type: Date, default: Date.now },
    updatedAt: {
        type: Number
    }
});

marketModel.set('toJSON', { getters: true });

module.exports = mongoose.model('market', marketModel);