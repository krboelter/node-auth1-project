const bcrypt = require("bcryptjs")
const db = require("../data/db-config")

function find() {
    return db("users")
        .select("id", "username")
}

async function add(newUser) {
    newUser.password = await bcrypt.hash(newUser.password, 14)

    const [id] = await db("users").insert(newUser)
    return findById(id)
}

function findBy(cred) {
    return db("users")
        .where(cred)
        .select("id", "username", "password")
}

function findById(id) {
    return db("users")
        .where({ id })
        .first("id", "username")
}

module.exports = {
    find,
    add,
    findBy
}