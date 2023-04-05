import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import UserService from "../service/UserService";
import IncompletsFieldsError from "./IncompletsFieldsError";

const Register = () => {
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [channelNameInput, setChannelName] = useState("");
  const [error, setError] = useState(false);
  const [successMessage, setSuccesMessage] = useState(false);
  const [fieldsIncomplete, setFieldsIncomplete] = useState(false);

  useEffect(() => {
    let successMessageTimer, errorTimer, fieldsIncompleteTimer;

    if (successMessage) {
      successMessageTimer = setTimeout(() => {
        setSuccesMessage(false);
      }, 5000);
    }

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
      clearTimeout(successMessageTimer);
      clearTimeout(errorTimer);
      clearTimeout(fieldsIncompleteTimer);
    };
  }, [successMessage, error, fieldsIncomplete]);

  const createAccount = (e) => {
    e.preventDefault();

    if (emailInput === "" || passwordInput === "" || channelNameInput === "") {
      setFieldsIncomplete(true);
      return;
    }

    const accountData = {
      email: emailInput,
      password: passwordInput,
      channelName: channelNameInput,
    };
    UserService.createAccount(accountData)
      .then(() => {
        setEmail("");
        setPassword("");
        setChannelName("");
        setError(false);
        setFieldsIncomplete(false);
        setSuccesMessage(true);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response.data === "Account already exists!") {
          console.log(error.response.data);
          setError(true);
        } else {
          setFieldsIncomplete(true);
        }
        setSuccesMessage(false);
      });
  };

  return (
    <Container fluid className="d-flex align-items-center min-vh-100">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5} xl={4}>
          <h1 className="mb-4">Create an Account</h1>
          <Form onSubmit={createAccount}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicChannel" className="mb-4">
              <Form.Label>Channel Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Channel Name"
                value={channelNameInput}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Create Account
            </Button>
          </Form>
          {fieldsIncomplete && <IncompletsFieldsError />}
          {error && <Alert variant="danger">Account already exists!</Alert>}
          {successMessage && (
            <Alert variant="success" className="mt-3">
              Account created successfully! You will receive a validation email.
            </Alert>
          )}
          <p className="text-center">
            Already have an account?{" "}
            <a href="/login" className="link-primary">
              Log in here
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
