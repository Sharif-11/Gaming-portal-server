const valiatePlayer = (req, res, next) => {
    const { player } = req?.body;
    if (player.length === 0 || player.length > 2) {
        res.send({
            status: "failed",
            "message": "Player information is invalid"
        })
    }
    else if (player.length === 1) { next() }
    else {
        const email1 = player[0]?.email;
        const email2 = player[1]?.email;
        const turn1 = player[0]?.turn;
        const turn2 = player[1]?.turn;
        let message = null;
        if (email1 === email2)
            message = "*Players email must be different"
        else if (turn1 === turn2)
            message = "*Player turn must be different"
        if (message) {
            res.send({
                status: "failed",
                message
            })
        }


    }
    next();
}
module.exports = valiatePlayer;