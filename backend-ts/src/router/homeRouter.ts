import express, { Request, Response } from "express"

export default (router: express.Router) => {
  router.get("/", (req: Request, res: Response) => {
    res.send("Welcome to toko-soya api service")
  })
}
