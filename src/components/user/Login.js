import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import ClientUser from "../../service/clientUser";

const Login = () => {
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shownPassword, setShownPassword] = useState(false);
  const navigate = useNavigate();

  const loginAccount = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", emailInput);
    formData.append("password", passwordInput);

    ClientUser.login(formData)
      .then((response) => {
        setError(false);

        const token = response.headers.get("Access-Token");
        localStorage.setItem("token", JSON.stringify(token));
        navigate("/home");
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response.status !== 200) {
          setError(true);
        }
      });
  };

  const handleShownPassword = () => {
    setShownPassword(!shownPassword);
  };

  useEffect(() => {
    let errorTimer;

    if (error) {
      errorTimer = setTimeout(() => {
        setError(false);
      }, 5000);
    }

    return () => {
      clearTimeout(errorTimer);
    };
  }, [error]);

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
    >
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5} xl={4}>
          <h1 className="mb-4">Log in to your account</h1>
          <Form onSubmit={loginAccount}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={shownPassword ? "text" : "password"}
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <Button
                variant="link"
                onClick={handleShownPassword}
                className="p-2 ml-2 align-self-start"
              >
                {shownPassword ? "Hide Password" : "Show Password"}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!emailInput || !passwordInput}
                className="w-50 mb-3"
              >
                Log in
              </Button>
            </div>
          </Form>
          <p className="text-center">
            <Link to="/register"> Don't have an account? Sign up here</Link>
          </p>
          {error && <Alert variant="danger">The account was not found</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
