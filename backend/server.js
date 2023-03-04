const dotenv = require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const port = process.env.PORT || 8000;
const cors = require("cors");
const bodyParser = require('body-parser');

connectDB();

const app = express();
app.use(cors({
  origin: ["http://localhost:3000"]
}));

// Middleware for parsing JSON
app.use(express.json({ limit: '10mb' }));

// Middleware for parsing JSON
// app.use(express.json({ limit: '10mb' }));


// Routes
app.use("/api/register", require("./routes/register.js"));
app.use("/api/login", require("./routes/login.js"));
app.use("/api/createMySubGreddiit", require("./routes/mySubGreddiit.js"));
app.use("/api/getMySubGreddiit", require("./routes/mySubGreddiit.js"));
app.use("/api/deleteMySubGreddiit", require("./routes/mySubGreddiit.js"));
app.use("/api/page", require('./routes/page.js'));
app.use("/api/posts", require("./routes/post.js"));
app.use('/api/getAllSubgreddiits', require("./routes/allSubGreddiit.js"));
app.use('/api/user', require("./routes/user.js"));
app.use('/api/subgreddiit/join', require("./routes/request.js"));
app.use('/api/subgreddiit/requests', require("./routes/request.js"));
app.use('/api/subgreddiit/req', require("./routes/follower.js"));
app.use('/api/posts/comments', require('./routes/comment.js'));
app.use('/api/reports', require("./routes/reports.js"));
app.use('/api/stats', require("./routes/stats"));

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
