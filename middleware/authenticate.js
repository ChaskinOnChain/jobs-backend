const Users = require("../models/user-model")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const authorizeUser = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401)
        throw new Error("Invalid token format")
    }
    const token = header.split(" ")[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { userId, name } = decoded
        req.user = { userId, name }
    } catch (error) {
        res.status(401)
        throw new Error("Authorization invalid")
    }
    next()
})

module.exports = authorizeUser
