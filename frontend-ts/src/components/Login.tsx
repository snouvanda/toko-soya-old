import { useRef, useState, useEffect, FormEvent } from "react"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios, { axiosError } from "../api/axios"

const LOGIN_URL = "/auth/login"

const Login = () => {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const emailRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLParagraphElement>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [email, password])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      )
      console.log(JSON.stringify(response?.data))
      const accessToken = response?.data?.accessToken
      const role = response?.data?.role
      setAuth({ email, password, role, accessToken })
      setEmail("")
      setPassword("")
      navigate(from, { replace: true })
    } catch (error) {
      if (axiosError(error)) {
        if (!error?.response) {
          setErrMsg("No Server Response")
        } else if (error.response?.status === 400) {
          setErrMsg("Missing email or password.")
        } else if (error.response?.status === 401) {
          setErrMsg("Unauthorized.")
        } else {
          setErrMsg("Login failed.")
        }
      }
      errRef.current?.focus()
    }
  }

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          ref={emailRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        {/* Password */}
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Need an Account?
        <br />
        <span className="line">
          {/* put router link here */}
          <a href="#">Sign Up</a>
        </span>
      </p>
    </section>
  )
}

export default Login
