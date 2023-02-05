const Users = require("../models/user-model")
const asyncHandler = require("express-async-handler")

// POST
// jobs/api/users/register
const userRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("You need to enter your email and password")
    }

    const userTest = await Users.find({ email })

    if (!userTest) {
        res.status(400)
        throw new Error("You've already registered")
    }

    const userCreated = await Users.create(req.body)
    const token = userCreated.createJWT()

    res.status(200).json({ msg: "User Registered", name, email, token })
})

// POST
// jobs/api/users/login
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("You need to enter your email and password")
    }
    const user = await Users.findOne({ email })

    if (!user) {
        res.status(400)
        throw new Error("User does not exist")
    }

    const check = await user.checkPassword(password)

    if (!check) {
        res.status(401)
        throw new Error("Invalid Password")
    }

    const token = user.createJWT()

    res.status(200).json({ msg: "Logged in", email, token })
})

module.exports = {
    userLogin,
    userRegister,
}
