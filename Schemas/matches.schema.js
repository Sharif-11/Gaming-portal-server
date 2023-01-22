const mongoose = require("mongoose");
const validator = require("validator");
const { Schema, model } = mongoose;
const matchesSchema = Schema({
    gameType: {
        type: String,
        required: [true, "*Game type must be provided"],
        enum: {
            values: ["Chess", "Gomoku"],
            message: "*Game type is either chess or gomoku"
        },

    },
    creator: {
        type: String,
        required: [true, "*Creator must be provided"],
        validate: {
            validator: (val) => validator.isEmail(val),
            message: "*Email is invalid"
        }
    },
    status: {
        type: String,
        default: "waiting",
        enum: {
            values: ["running", "waiting", "ended"],
            message: "*{VALUE} is not supported"
        }
    },
    result: {
        type: String,
        enum: {
            values: ["Draw", "white", "black"],
            message: "*Result is either draw or white or black"
        }
    },
    player: [
        {
            email: {
                type: String,
                required: [true, "*Email must be provided"],
                validate: {
                    validator: (val) => validator.isEmail(val),
                    message: "*Email is invalid"
                }

            },
            turn: {
                type: Number,
                required: [true, "*Turn must be provided"],
                default: 0,
                enum: {
                    values: [0, 1],
                    message: "*Turn is either 0 or 1"
                }
            }
        }
    ]
}, {
    timestamps: true
})
const Match = model('Match', matchesSchema)
module.exports = Match;