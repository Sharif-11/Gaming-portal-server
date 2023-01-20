const handleError = (error, res) => {
    const { code, keyPattern: { email, name } = { email: undefined, name: undefined }, } = error;
    const { errors } = error
    let message;
    // console.log(errors?.name?.name, code, email, name);
    if (code === 11000) {
        if (name === 1)
            message = "*User already exists"
        else if (email === 1)
            message = "*Email already exists"


    }
    else if (errors?.name?.name === "ValidatorError") {
        message = errors?.name?.message;
    }
    else if (errors?.email?.name === "ValidatorError") {
        message = errors?.email?.message
    }

    res.send({
        status: "failed",
        message,
    })


}
module.exports = handleError