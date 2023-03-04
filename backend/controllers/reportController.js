const User = require('../models/User');
const SubGreddiit = require('../models/subGreddiit');
const Post = require("../models/Post");
const Report = require("../models/Report");
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

const createReport = async (req, res) => {
    try {
        const subgreddiitId = req.params.subgreddiitId;
        const subgreddiit = subgreddiitId;
        const { reportedBy, reportedUser, concern, post, postContent } = req.body;

        if(!reportedBy || !reportedUser || !concern || !postContent){
            return res.status(400).json({ success: false, message: 'Data is missing' });
        }

        const subgreddiitFind = await SubGreddiit.findById(subgreddiitId);

        if (!subgreddiitFind) {
            return res.status(404).send('Subgreddiit not found');
        }

        const reporter = await User.findById(reportedBy);

        if (!reporter) {
            return res.status(404).send('User not found');
        }

        if (reportedUser.username === subgreddiitFind.createdBy) {
            return res.status(400).send({ success: false, message: 'You cannot report the owner.' });
        }

        if (reporter.username === post.user.username) {
            return res.status(400).send({ success: false, message: 'You cannot report your own post.' });
        }

        const existingReport = await Report.findOne({ post, reporter });
        if (existingReport) {
            return res.status(400).send({ success: false, message: 'You have already reported this post.' });
        }

        const report = new Report({ subgreddiit, reportedBy, reportedUser, concern, post, postContent });
        await report.save();

        res.status(201).send({ success: true, message: 'Post reported successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: error });
    }
};

const getReports = async (req, res) => {
    const { subgreddiitId } = req.params;
    try {
        const reports = await Report.find({ subgreddiit: subgreddiitId })
            .populate("reportedBy")
            .populate("reportedUser")
            .populate("post");
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: error });
    }
}

const ignoreReport = async (req, res) => {
    try {
        const report = await Report.findOneAndUpdate(
            { _id: req.params.reportId },
            { ignored: true },
            { new: true }
        );

        if (!report) {
            return res.status(404).send('Report not found');
        }

        res.send({ success: true, message: 'Report ignored', report });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const blockUser = async (req, res) => {
    try {
        const subGreddiitId = req.params.subGreddiitId;
        const subgreddiit = await SubGreddiit.findById(subGreddiitId);

        if (!subgreddiit) {
            return res.status(404).send('Subgreddiit not found');
        }

        const report = req.body.report;

        const reportedUser = report.reportedUser;

        if (!subgreddiit.blockedUsers.includes(reportedUser._id)) {
            subgreddiit.blockedUsers.push(reportedUser._id);
            subgreddiit.followers.pull(reportedUser._id);

            // Update the follower history
            const followerCount = subgreddiit.followers.length;
            const timestamp = new Date();
            subgreddiit.followerHistory.push({ count: followerCount, timestamp: timestamp });
            
            await subgreddiit.save();

            await Post.updateMany({ user: reportedUser }, { userName: 'Blocked User' });

            res.status(200).send({ success: true, message: 'User blocked' });
        } else {
            return res.send({ success: false, message: 'User already blocked' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const userBlocked = async (req, res) => {
    try {
        const report = await Report.findOneAndUpdate(
            { _id: req.params.reportId },
            { blocked: true },
            { new: true }
        );

        if (!report) {
            return res.status(404).send('Report not found');
        }

        res.send({ success: true, message: 'User was blocked', report });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const deleteOldReports = async (req, res) => {
    try {
        const time = new Date(Date.now() - 10 * 24 * 60 * 1000);
        const reportsToDelete = await Report.find({ createdAt: { $lt: time }, ignored: false, blocked: false }).select('_id');
        if (!reportsToDelete.length) {
            return res.status(200).json({ message: 'No reports to delete' });
        }
        const reportIdsToDelete = reportsToDelete.map(report => report._id);
        const result = await Report.deleteMany({ _id: { $in: reportIdsToDelete } });
        console.log(`Deleted ${reportIdsToDelete.length} reports.`);
        return res.status(200).json({ message: 'Reports deleted' });
    } catch (error) {
        console.log("Error deleting old reports:", error);
    }
};

module.exports = {
    createReport, getReports, ignoreReport, blockUser, userBlocked, deleteOldReports
};
