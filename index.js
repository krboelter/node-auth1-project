require('dotenv').config()
const express = require("express")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)

const dbConfig = require("./data/db-config")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(express.json())
server.use(session({
    name: "monkey", // for security - kinda
    resave: false,
    saveUninitialized: false,
    secret: "keep it secret, keep it safe!",
    cookie: {
        httpOnly: true, // cannot access the cookie from JS (more secure)
        maxAge: 1000 * 60 * 60 * 24, // expire the session after 24 hours
        secure: false, // in production this should be set to true so the cookie header is incripted
    },
    store: new KnexSessionStore({ // for persistant storage - stores in the database
        knex: dbConfig, // configured instance of knex
        createtable: true, // if the table does not exist in the db, create it automatically
    }),
}))
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