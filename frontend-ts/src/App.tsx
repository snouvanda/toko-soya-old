import Layout from "./components/Layout"
import Login from "./components/Login"
import Register from "./components/Register"
import LinkPage from "./components/LinkPage"
import Unauthorized from "./components/Unauthorized"
import Home from "./components/Home"
import Customer from "./components/Customer"
import Admin from "./components/Admin"
import Lounge from "./components/Lounge"
import Missing from "./components/Missing"
import RequireAuth from "./components/RequireAuth"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Layout />}
      >
        {/* public routes */}
        <Route
          path="login"
          element={<Login />}
        />
        <Route
          path="register"
          element={<Register />}
        />
        <Route
          path="linkpage"
          element={<LinkPage />}
        />
        <Route
          path="unauthorized"
          element={<Unauthorized />}
        />

        {/* we want protect these routes */}
        <Route element={<RequireAuth />}>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="customer"
            element={<Customer />}
          />
          <Route
            path="admin"
            element={<Admin />}
          />
          <Route
            path="lounge"
            element={<Lounge />}
          />
        </Route>

        {/* catch all */}
        <Route
          path="*"
          element={<Missing />}
        ></Route>
      </Route>
    </Routes>
  )
}

export default App
