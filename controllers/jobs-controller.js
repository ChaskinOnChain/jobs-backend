const asyncHandler = require("express-async-handler")
const Jobs = require("../models/job-model")

// GET
// Private -> jwt gated
// jobs/api/jobs/:id
const viewJob = asyncHandler(async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req
    const job = await Jobs.findOne({ createdBy: userId, _id: jobId })
    if (!job) {
        res.status(400)
        throw new Error(`Unable to find a job with this id ${jobId}`)
    }
    res.json({ message: "success", data: job })
})

// GET
// Private -> jwt gated
// jobs/api/jobs/
const viewJobs = asyncHandler(async (req, res) => {
    const jobs = await Jobs.find({ createdBy: req.user.userId })
    if (!jobs) {
        res.status(400)
        throw new Error(`Unable to find jobs for you account`)
    }
    res.json({ message: "success", data: jobs, nbOfJobs: jobs.length }).sort("createdAt")
})

// POST
// Private -> jwt gated
// jobs/api/jobs/
const createJob = asyncHandler(async (req, res) => {
    const { company, position, status } = req.body
    if (!company || !position || !status) {
        res.status(400)
        throw new Error("You need to enter company, position, and status")
    }

    const createdJob = await Jobs.create({
        company,
        position,
        status,
        createdBy: req.user.userId,
    })
    if (!createdJob) {
        res.status(400)
        throw new Error(`Unable to create job`)
    }

    res.json({ message: "success", data: createdJob })
})

// PUT
// Private -> jwt gated
// jobs/api/jobs/:id
const editJob = asyncHandler(async (req, res) => {
    const {
        params: { id: jobId },
        body: { company, position, status },
    } = req
    if (!company || !position || !status) {
        res.status(400)
        throw new Error("You need to enter company, position, and status")
    }
    const updatedJob = await Jobs.findByIdAndUpdate({ _id: jobId }, req.body, {
        new: true,
        runValidators: true,
    })
    if (!updatedJob) {
        res.status(400)
        throw new Error(`Unable to update job`)
    }

    res.json({ message: "success", data: updatedJob })
})

// DELETE
// Private -> jwt gated
// jobs/api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
        body: { company, position },
    } = req
    if (!company || !position) {
        res.status(400)
        throw new Error("You need to enter company, position, and status")
    }
    const deletedSuccess = await Jobs.deleteOne({ createdBy: userId, _id: jobId })
    if (deletedSuccess.acknowledged !== true || deletedSuccess.deletedCount !== 1) {
        res.status(400)
        throw new Error(`Unable to delete job`)
    }

    res.json({ message: "success", data: `Deleted job id ${jobId} from ${company}` })
})

module.exports = {
    viewJob,
    viewJobs,
    createJob,
    editJob,
    deleteJob,
}
