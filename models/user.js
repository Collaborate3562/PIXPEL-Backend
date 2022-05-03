const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String},
    password: { type: String, required: true },
    role: { type: Number, required: true, default: 0 },
    address: { type: String },
    profilePhoto: { type: String },
    created: { type: Date, default: Date.now },
    updatedAt: {
        type: Number
    }
});

userModel.set('toJSON', { getters: true });
userModel.options.toJSON.transform = (doc, ret) => {
    const obj = { ...ret };
    delete obj.__v;
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('user', userModel);