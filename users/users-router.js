const bcrypt = require("bcryptjs")
const express = require("express")
const usersModel = require("./users-model")

const router = express.Router()

router.get("/users", async (req, res, next) => {
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
            res.status(200).json({
                message: `Welcome ${user.username}!`,
            })
        } else {
            res.status(401).json({
                message: "You shall not pass!"
            })
        }
    } catch(err) {
        next(err)
    }
})

module.exports = router