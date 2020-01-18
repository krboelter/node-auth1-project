const bcrypt = require("bcryptjs")
const express = require("express")
const usersModel = require("./users-model")
const restricted = require("../middleware/restricted")

const router = express.Router()

router.get("/users", restricted(), async (req, res, next) => {
    try {
        const users = await usersModel.find()

        res.json(users)
    } catch(err) {
        next(err)
    }
})

router.post("/register", async (req, res, next) => {
    try {
        const user = await usersModel.add(req.body)

        res.status(201).json({
            message: "User has been created.",
            user
        })
    } catch(err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await usersModel.findBy({ username }).first()
        const passwordValid = await bcrypt.compare(password, user.password)

        if (user && passwordValid) {
            req.session.user = user
            res.status(200).json({
                message: "Welcome!",
                user: user.id
            })
        } else {
            next(err)
        }
    } catch(err) {
        next(err)
    }
})

router.get("/logout", restricted(), (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.status(200).json({
                message: "You have been logged out."
            })
        }
    })
})

module.exports = router