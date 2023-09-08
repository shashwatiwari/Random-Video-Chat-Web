const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    email: {
        type: String, required: true, unique: true, validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Entered email is Invalid")
            }
        }
    },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    country: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


