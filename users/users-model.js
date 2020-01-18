const bcrypt = require("bcryptjs")
const db = require("../data/db-config")

function find() {
    return db("users")
        .select("id", "username")
}

function findBy(user) {
    return db("users")
        .where(user)
        .select("id", "username", "password")
}

async function add(newUser) {
    newUser.password = await bcrypt.hash(newUser.password, 14)

    const [id] = await db("users").insert(newUser)
    return findById(id)
}

function findById(id) {
    return db("users")
        .where({ id })
        .first("id", "username")
}

module.exports = {
    find,
    findBy,
    add,
    findById
}