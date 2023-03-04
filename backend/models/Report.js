const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    subgreddiit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubGreddiit',
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    concern: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    postContent: {
        type: String,
        required: true
    },
    ignored: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Report', reportSchema);

