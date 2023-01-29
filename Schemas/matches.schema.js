const mongoose = require("mongoose");
const validator = require("validator");
const { Schema, model } = mongoose;
const matchSchema = Schema({
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
        trim: true,
        minLength: [6, "*Creator length is at least 6"],
        maxLength: [15, "*Creator length is at most 15"],

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
    duration: {
        type: Number,
        required: [true, "*Duration must be provided"],
        default: 10,
        enum: {
            values: [10, 15, 30, NaN],
            message: "duration is either 10 ,15,30 or NaN"
        }


    },
    roomNo: {
        type: String,
        unique: [true, "*Room no must be unique"],
    },
    firstPlayer: {
        type: String,
        trim: true
    },
    secondPlayer: {
        type: String,
        trim: true
    },
    creatorEmail: {
        type: String,
        trim: true,
        required: [true, "*creatorEmail must be provided"],
        validate: {
            validator: (val) => validator.isEmail(val),
            message: "*Email is invalid"
        }

    },
    boardState: {
        type: String,
        default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }



}, {
    timestamps: true
})
const Match = model('Match', matchSchema)
module.exports = Match;