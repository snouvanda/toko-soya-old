import { Link } from "react-router-dom"

const LinkPage = () => {
  return (
    <section>
      <h1>Links</h1>
      <br />
      <h2>Public</h2>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <br />
      <h2>Private</h2>
      <Link to="/">Home</Link>
      <Link to="/guest">Guest Page</Link>
      <Link to="/customer">Customer Page</Link>
      <Link to="/shipper">Shipper Page</Link>
      <Link to="/supplier">Supplier Page</Link>
      <Link to="/employee">Em ployee Page</Link>
      <Link to="/admin">Admin Page</Link>
    </section>
  )
}

export default LinkPage
