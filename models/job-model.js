const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "Must include a company name"],
            maxLength: 30,
        },
        position: {
            type: String,
            required: [true, "Must include a position"],
            maxLength: 50,
        },
        status: {
            type: String,
            enum: ["interview", "declined", "pending"],
            default: "pending",
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
            required: [true, "Must provide a user"],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Jobs", jobSchema)
