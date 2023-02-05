require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const port = process.env.PORT || 8000
const app = express()
const userRouter = require("./routes/users-routes")
const jobsRouter = require("./routes/jobs-routes")
const authorizeUser = require("./middleware/authenticate")

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
