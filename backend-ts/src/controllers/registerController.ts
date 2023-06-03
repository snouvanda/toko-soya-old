import { Request, Response } from "express"
import { hashPassword, random, comparePassword } from "../helpers/authHelper"
import { isRegistrationInputsValid } from "../helpers/inputValidationHelper"
import dra, { setFault } from "../helpers/faultMsgHelper" //developer recommended action after error occured.
import {
  createNewUser,
  getUserExistanceByEmail,
} from "../repositories/usersRepo"
import { toPropercase } from "../helpers/stringHelper"

export const registerUser = async (req: Request, res: Response) => {
  console.log("")
  console.log("User try to register")
  try {
    // Prepare inputs.
    let { email, name, phone, password, requestedRole } = req.body

    // change  case to Propercase
    if (name) name = toPropercase(name)
    if (requestedRole) requestedRole = toPropercase(requestedRole)

    //
    // Check if inputs are available.
    if (!email || !name || !password || !requestedRole) {
      let fault = setFault(
        "All mandatory fields are required.",
        dra.b2_signup_p,
      )
      return res.status(400).json(fault)
    }

    //
    // Validate inputs value
    const inputFault = await isRegistrationInputsValid(
      email,
      name,
      password,
      requestedRole,
      phone,
    )

    if (!("valid" in inputFault)) {
      return res.status(400).json(inputFault)
    }

    //
    // Check if email already registered.
    const emailExists = await getUserExistanceByEmail(email)

    if (emailExists) {
      let fault = setFault("Email already registered.", dra.b2_signup_p)
      return res.status(409).json(fault)
    }

    //
    // Create user
    // create salt and hashed password
    const salt = random()
    const hashedPassword = hashPassword(salt, password)
    // test if hashed password valid
    if (!comparePassword(salt, password, hashedPassword)) {
      let fault = setFault(
        "Generating secured password failed.",
        dra.b2_signup_p,
      )
      return res.status(500).json(fault)
    }

    //
    // save user registration into db
    const newUser = await createNewUser({
      email: email,
      name: name,
      phone: phone,
      requestedRole: requestedRole,
      role: "guest",
      isActive: true,
      regApproval: "pending",
      salt: salt,
      password: hashedPassword,
      createdBy: null,
    })

    // return respond
    // user: {id, email, name, phone, requestedRole,
    // role, isActive, regApproval}
    console.log("Register completed.")
    return res.status(201).json(newUser).end()

    //
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}
