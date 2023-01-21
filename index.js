console.clear()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const Test = require('./Schemas/user.schema');
const User = require('./Schemas/user.schema');
const handleError = require('./Errors/user.error');
const app = express();
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























app.get("/", (req, res) => res.send("Welcome to game portal"))
app.listen(port, () => {
    console.log("listening to port ", port);
    console.log(process.env.DB_PASS);
})