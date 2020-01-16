require('dotenv').config()
const express = require("express")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(express.json())
server.use("/api", usersRouter)

server.get((err, req, res, next) => {
    console.log("Error: ", err)

    res.status(500).json({
        message: "Something went wrong..."
    })
})

server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})