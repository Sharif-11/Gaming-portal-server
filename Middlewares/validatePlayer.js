const validatePlayer = (req, res, next) => {
    const { firstPlayer, secondPlayer } = req?.body;

    if (firstPlayer || secondPlayer) {
        if (firstPlayer === secondPlayer) {
            res.send({
                status: "failed",
                message: "*The both player must be different"
            })
        }
        next()
    }
    else {
        res.send({
            status: "failed",
            message: "*At least one player must be provided"
        })
    }

}
module.exports = validatePlayer;