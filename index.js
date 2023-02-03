console.clear()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const User = require('./Schemas/user.schema');
const handleError = require('./Errors/user.error');
const Match = require('./Schemas/matches.schema');
const validatePlayer = require('./Middlewares/validatePlayer');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*",

    }
})
require('dotenv').config()
//middleware
app.use(cors());
app.use(express.json())
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.grag58u.mongodb.net/GamingPortal`;
mongoose.set('strictQuery', true)
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(url, options, () => console.log('connected'))
app.post('/user', async (req, res) => {
    try {
        console.log(req?.body);
        const result = new User(req?.body);
        await result.save();
        res.send({
            status: "success",
            result
        });
    } catch (error) {
        handleError(error, res)

    }

})
app.get("/user/:handle", async (req, res) => {
    const { handle } = req?.params
    const result = await User.findOne({ name: handle })
    res.send(result)
})
app.post("/match", validatePlayer, async (req, res) => {
    try {
        const result = await Match(req?.body)
        await result.save();
        res.send({
            status: "success",
            result
        })
    } catch (error) {
        res.send(error)
    }
})
app.get("/matches", async (req, res) => {
    try {
        const result = await Match.find({ status: "waiting" })
        res.send(result);
    } catch (error) {
        res.send({
            status: "failed",
            message: error?.message
        })
    }
})
app.get("/matches/:gameType", async (req, res) => {
    try {
        const { gameType } = req?.params;
        const result = await Match.find({ gameType, status: "waiting" });
        res.send(result);
    } catch (error) {
        res.send({
            status: "failed",
            message: error?.message
        })
    }
})
app.get("/match/:_id", async (req, res) => {
    const { _id } = req?.params
    console.log(_id);
    try {
        const result = await Match.findById(_id)
        res.send(result);
    } catch (error) {
        res.send({
            status: "failed",
            message: error?.message
        })
    }
})

const chessNamespace = io.of("/Chess");
chessNamespace.on('connection', async (socket) => {
    console.clear();
    const { client, roomno } = socket?.handshake?.headers;
    try {
        const result = await Match.findOne({ _id: roomno });

        const { firstPlayer, secondPlayer, _id, creator, gameType } = result;
        if (gameType !== "Chess") return;
        if (_id) {
            if (firstPlayer && secondPlayer && client !== firstPlayer && client !== secondPlayer)
                return;
            socket.join(roomno);
            //joining information

            if (client !== creator && !(firstPlayer && secondPlayer)) {
                try {
                    const updated = await Match.findByIdAndUpdate(roomno, {
                        $set: {
                            [firstPlayer ? "secondPlayer" : "firstPlayer"]: client,
                            status: "running"
                        }
                    })

                    if (updated) {
                        setTimeout(() => {
                            socket.in(roomno).emit("join", { joined: true })
                        }, [3000])
                    }

                } catch (error) {

                }

            }
            socket.on("move", (data) => {
                const updateDb = async () => {
                    try {
                        const { boardState } = data;
                        const result = await Match.findByIdAndUpdate(roomno, { $set: { boardState } })

                        if (result)
                            socket.to(roomno).emit("move", data)
                    } catch (error) {

                    }
                }
                updateDb();
            })

        }

    } catch (error) {

    }

    // console.log(client, roomno);
})
const gomokuNamespace = io.of("/Gomoku");
gomokuNamespace.on('connection', async (socket) => {
    console.clear();
    const { client, roomno } = socket?.handshake?.headers;
    try {
        const result = await Match.findOne({ _id: roomno });

        const { firstPlayer, secondPlayer, _id, creator, gameType } = result;
        if (gameType !== "Gomoku") return;
        if (_id) {
            if (firstPlayer && secondPlayer && client !== firstPlayer && client !== secondPlayer)
                return;
            socket.join(roomno);
            //joining information

            if (client !== creator && !(firstPlayer && secondPlayer)) {
                try {
                    const updated = await Match.findByIdAndUpdate(roomno, {
                        $set: {
                            [firstPlayer ? "secondPlayer" : "firstPlayer"]: client,
                            status: "running"
                        }
                    })

                    if (updated) {
                        setTimeout(() => {
                            socket.in(roomno).emit("join", { joined: true })
                        }, [3000])
                    }

                } catch (error) {

                }

            }
            socket.on("move", (data) => {
                const updateDb = async () => {
                    try {
                        const { boardState } = data;
                        const result = await Match.findByIdAndUpdate(roomno, { $set: { boardState } })

                        if (result)
                            socket.to(roomno).emit("move", data)
                    } catch (error) {

                    }
                }
                updateDb();
            })

        }

    } catch (error) {

    }

    // console.log(client, roomno);
})
























app.get("/", (req, res) => res.send("Welcome to game portal"))
server.listen(port, () => {
    console.log("listening to port ", port);

})