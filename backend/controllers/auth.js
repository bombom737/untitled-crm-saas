import { Router } from "express";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router()

router.post("/register", async (req, res) => {
    try {
        console.log("Received request at /register with body:", req.body);

        const user = req.body;

        const existingUser = await userModel.findOne({ email: user.email });

        if (existingUser) {
            console.log("User already exists:", user.email);
            return res.status(409).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        await userModel.create(user);
        assignToken(user, res);

        console.log("User registered successfully:", user.email);
        res.status(201).send("User registered successfully!");
    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).send(error.message);
    }
});


router.post("/login", async (req, res) => {

    const credentials = req.body

    const user = await userModel.findOne({ email: credentials.email })

    if (!user) return res.sendStatus(403)

    const similar = bcrypt.compare(credentials.password, user.password)

    if (!similar) return res.sendStatus(403)

    assignToken(user.toJSON(), res)

    res.send("User logged in successfully!")

})

router.get("/is-logged-in", (req, res) => {
    const token = req.cookies?.token

    if (!token) return res.send(false)

    jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (err) => {
        if (err) res.send(false)
        else res.send(true)
    })
})

function assignToken(user, res) {
    delete user.password

    const token = jwt.sign(user, process.env.PRIVATE_ACCESS_KEY)

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    })
}

export default router