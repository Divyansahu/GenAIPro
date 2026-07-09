const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()


app.use(express.json())
app.use(cookieParser())
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}))

// require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all the routes
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)

// Serve frontend statically in production
const path = require("path")
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../Frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"))
    })
}

module.exports = app;