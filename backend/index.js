import "./connection.js"
import app from "./app.js"
import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./controllers/auth.js"
import jwt from "jsonwebtoken"
import userModel from "./models/userModel.js"

app.use(express.json())
app.use(cookieParser())

const posts = [
    { content: "spdjflkj", username: "Ben" },
    { content: "spdjflkj", username: "Moshe" },
    { content: "spdjflkj", username: "Boris" }
]

app.use("/auth", authRouter)

app.get("/post", async (req, res) => {
    const token = req.cookies.token
    let userPosts;

    jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (err, payload) => {
        if (err) return res.sendStatus(403)
        payload = posts.filter(el => el.username === payload.username)
    })

    res.send(userPosts)
})

app.get("/get-user", (req, res) => {
    const token = req.cookies?.token

    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.PRIVATE_ACCESS_KEY, (err, payload) => {
        if (err) return res.sendStatus(401)
        else return res.send(payload)
    })

})


app.listen(3002, () => {
    console.log("listening on port 3002...")
})