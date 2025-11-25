// import React from "react";

// function Login() {
//   return (
//     <div className="main-content">
//       <h1>Login</h1>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// 💡 Import React Bootstrap Components
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

// The API endpoint for authentication
const API_URL = "/api/login";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        username,
        password,
      });

      if (response.data.success && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("userToken", token);

        // 💡 CRITICAL FIX: Navigate to /dashboard, passing a state object.
        // This causes the location dependency in the Navbar's useEffect to trigger,
        // hiding the Login button and showing the Logout button.
        navigate("/dashboard", { state: { loggedIn: true } });
      } else {
        // Handle unexpected successful response without a token
        setError("Login failed: Invalid server response.");
      }
    } catch (err) {
      // Handle 401 Unauthorized, network errors, etc.
      const errorMessage =
        err.response?.data?.err || "Login failed. Check username and password.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">User Login</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (e.g., val)"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (e.g., val)"
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100" // Button full width
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;
