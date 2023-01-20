const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "*Name must be provided"],
        unique: [true, "*Name already exists"],
        trim: true,
        minLength: [6, "*Name must be at least 6 Characters"],
        maxLength: [15, "*Name must be at most 15 Characters"]

    },

    email: {
        type: String,
        required: [true, "*Email must be provided"],
        unique: [true, "*Email is already exists"],
        validate: {
            validator: (val) => validator.isEmail(val),
            message: "*Email is invalid"
        }

    }


}, {
    timestamps: true
})
const User = mongoose.model('User', userSchema);
module.exports = User
