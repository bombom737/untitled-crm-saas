import { Router } from "express";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router()

router.post("/register", async (req, res) => {
    try {
        const user = req.body

        const existingUser = await userModel.findOne({ email: user.email })

        if (existingUser) return res.sendStatus(409)

        const hashedPassword = await bcrypt.hash(user.password, 10)

        user.password = hashedPassword

        await userModel.create(user)

        assignToken(user, res)

        res.send("user is saved successfully...")

    } catch (error) {
        res.send(error.message)
    }
})

router.post("/login", async (req, res) => {

    const credentials = req.body

    const user = await userModel.findOne({ email: credentials.email })

    if (!user) return res.sendStatus(403)

    const similar = await bcrypt.compare(credentials.password, user.password)

    if (!similar) return res.sendStatus(403)

    assignToken(user.toJSON(), res)

    res.send("user is logged in...")

})

function assignToken(user, res) {
    delete user.password

    const token = jwt.sign(user, process.env.PRIVATE_ACCESS_KEY)

    res.cookie("token", token, {
        httpOnly: true,
        secure: true
    })
}

export default router