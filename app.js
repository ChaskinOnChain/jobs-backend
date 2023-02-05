require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const port = process.env.PORT || 8000
const app = express()
const userRouter = require("./routes/users-routes")
const jobsRouter = require("./routes/jobs-routes")
const authorizeUser = require("./middleware/authenticate")
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const rateLimiter = require("express-rate-limit")

app.set("trust proxy", 1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
)

app.use(helmet())
app.use(xss())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.set("strictQuery", false)
app.listen(port, () => {
    console.log(`Server listening for requests on port ${port}`)
    mongoose.connect(process.env.MONGO_URI, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log("MongDB is connected")
        }
    })
})

app.use("/jobs/api/", userRouter)
app.use("/jobs/api/", authorizeUser, jobsRouter)
