import { Link } from "react-router-dom";
import { Button, Navbar, Nav, Container } from "react-bootstrap";

function NavBar() {
  return (
    <>
      <Navbar
        fixed="top"
        expand="sm"
        className="bg-body-tertiary"
        bg="primary"
        data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">V89</Navbar.Brand>
          <Nav className="me-auto">
            {/* <Nav.Link href="/">Home</Nav.Link> */}
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/reports">Reports</Nav.Link>
            <Nav.Link href="/summary">Summary</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}
export default NavBar;
