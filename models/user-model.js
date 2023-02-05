const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "You need to include a name"],
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "You need to include an email"],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
            ],
            unique: true,
            minLength: 2,
            maxLenth: 50,
        },
        password: {
            type: String,
            required: [true, "You need to include a first name"],
            minLength: 5,
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
})

userSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}

userSchema.methods.checkPassword = async function (enteredPass) {
    const check = await bcrypt.compare(enteredPass, this.password)
    return check
}

module.exports = mongoose.model("Users", userSchema)
