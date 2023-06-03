import { Request, Response } from "express"
import { getUsers } from "../repositories/usersRepo"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers()
    if (!users) {
      return res.status(204).json({ message: "No users found" })
    }
    return res.json(users)
    //
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
