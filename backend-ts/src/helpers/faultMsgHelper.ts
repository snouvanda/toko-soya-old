import { merge } from "lodash"

const key1 = "message"
const key2 = "msg2Dev"

export const setFault = (faultMessage: string, draMessage: string) => {
  const fault = { [key1]: faultMessage }
  const dram = { [key2]: draMessage }

  if (process.env.NODE_ENV === "development") merge(fault, dram)

  return fault
}

// dra : developer recommended action messages after fault/error occured.
const concealed = "Concealed"
const b2_login_p = "Back to Login page."
const b2_signup_p = "Back to Sign Up page"
const b2_name_entry = "Back to name entry fields"
const b2_email_entry = "Back to email entry field"
const b2_pwd_entry = "Back to password entry field"

export default {
  key1,
  key2,
  concealed,
  b2_login_p,
  b2_signup_p,
  b2_name_entry,
  b2_email_entry,
  b2_pwd_entry,
}
