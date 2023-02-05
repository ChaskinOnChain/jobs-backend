const express = require("express")
const router = express.Router()
const {
    createJob,
    viewJob,
    viewJobs,
    editJob,
    deleteJob,
} = require("../controllers/jobs-controller")

router.route("/jobs/").post(createJob).get(viewJobs)
router.route("/jobs/:id").get(viewJob).put(editJob).delete(deleteJob)

module.exports = router
