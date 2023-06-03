import express from "express"
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import { corsOptions } from "./config/corsOptions"
import dotenv from "dotenv"
import router from "./router"

dotenv.config()

const app = express()
const PORT = process.env.APP_PORT || 5002

app.use(cors(corsOptions))

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} `)
})

app.get("/", (req, res) => {
  res.send("Welcome to Soya Prima Solusi API Services")
})

app.use("/toko-soya", router())
