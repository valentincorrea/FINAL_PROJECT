import React, { useState, useEffect } from "react";
// 💡 Import necessary hooks and components from React Router
import { Link, useNavigate, useLocation } from "react-router-dom";
// 💡 Import required React Bootstrap components
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // We use useLocation() as a dependency in useEffect to force a state re-check
  // whenever the route changes (e.g., after a login redirect).
  const location = useLocation();

  // --- Effect to Check Login Status ---
  useEffect(() => {
    // Check localStorage for the token
    const token = localStorage.getItem("userToken");
    // Set state based on token existence (double exclamation mark converts value to a boolean)
    setIsLoggedIn(!!token);
  }, [location]); // 💡 Reruns whenever the URL/route state changes

  // --- Logout Function ---
  const handleLogout = () => {
    // 1. Remove the token
    localStorage.removeItem("userToken");

    // 2. Update state and redirect to login
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar
      fixed="top"
      expand="sm"
      className="bg-body-tertiary"
      bg="primary"
      data-bs-theme="dark">
      <Container>
        {/* Navbar Brand: Use 'as={Link}' to make it a React Router Link */}
        <Navbar.Brand as={Link} to="/dashboard">
          V89
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Main Navigation Links */}
          <Nav className="me-auto">
            {/* Nav.Link: Use 'as={Link}' for all internal routing links */}
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/reports">
              Reports
            </Nav.Link>
            <Nav.Link as={Link} to="/summary">
              Summary
            </Nav.Link>
          </Nav>

          {/* Conditional Authentication Links */}
          <Nav>
            {!isLoggedIn ? (
              // 💡 If NOT logged in, show the Login link
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            ) : (
              // 💡 If logged in, show the Logout Button
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="ms-2" // Margin for separation
              >
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
