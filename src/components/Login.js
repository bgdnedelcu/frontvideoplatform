import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import IncompletsFieldsError from "./IncompletsFieldsError";
import UserService from "../service/UserService";

const Login = () => {
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [fieldsIncomplete, setFieldsIncomplete] = useState(false);
  const [error, setError] = useState(false);
  const [shownPassword, setShownPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let fieldsIncompleteTimer, errorTimer;

    if (error) {
      errorTimer = setTimeout(() => {
        setError(false);
      }, 5000);
    }

    if (fieldsIncomplete) {
      fieldsIncompleteTimer = setTimeout(() => {
        setFieldsIncomplete(false);
      }, 5000);
    }

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(fieldsIncompleteTimer);
    };
  }, [error, fieldsIncomplete]);

  const loginAccount = (event) => {
    event.preventDefault();

    if (emailInput === "" || passwordInput === "") {
      setFieldsIncomplete(true);
      return;
    }

    const formData = new FormData();
    formData.append("username", emailInput);
    formData.append("password", passwordInput);

    UserService.login(formData)
      .then((response) => {
        setError(false);
        setFieldsIncomplete(false);

        const token = response.headers.get("Access-Token");
        localStorage.setItem("token", JSON.stringify(token));
        navigate("/search");
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response.status !== 200) {
          console.log(error.response.status);
          setError(true);
        }
      });
  };

  const toggleShownPassword = () => {
    setShownPassword(!shownPassword);
  };

  return (
    <Container fluid className="d-flex align-items-center min-vh-100">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5} xl={4}>
          <h1 className="test mb-4">Log in to your account</h1>
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
            <Button
              variant="link"
              onClick={toggleShownPassword}
              className="p-2 ml-2"
            >
              {shownPassword ? "Hide Password" : "Show Password"}
            </Button>
            <Button variant="primary" type="submit" className="w-100 mb-3">
              Log in
            </Button>
          </Form>
          {error && <Alert variant="danger">Invalid email or password</Alert>}
          {fieldsIncomplete && <IncompletsFieldsError />}
          <p className="text-center">
            Don't have an account?{" "}
            <a href="/register" className="link-primary">
              Sign up here
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
