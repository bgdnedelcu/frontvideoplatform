import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ClientUser from "../service/clientUser";
import CustomAlert from "./CustomAlert";

const Register = () => {
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPassword] = useState("");
  const [channelNameInput, setChannelName] = useState("");
  const [error, setError] = useState(false);
  const [successMessage, setSuccesMessage] = useState(false);
  const [errorChannelName, setErrorChannelName] = useState(false);

  const createAccount = (e) => {
    e.preventDefault();

    const accountData = {
      email: emailInput,
      password: passwordInput,
      channelName: channelNameInput,
    };
    ClientUser.createAccount(accountData)
      .then(() => {
        setEmail("");
        setPassword("");
        setChannelName("");
        setError(false);
        setSuccesMessage(true);
        setTimeout(() => {
          setSuccesMessage(false);
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        if (error.response.data === "Account already exists!") {
          setError(true);
          setSuccesMessage(false);
          setTimeout(() => {
            setError(false);
          }, 3000);
        }
        if (error.response.data === "Channel name already exists") {
          setErrorChannelName(true);
          setError(false);
          setSuccesMessage(false);
          setTimeout(() => {
            setErrorChannelName(false);
          }, 3000);
        }
      });
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
    >
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
            <div className="d-flex align-items-center justify-content-center">
              <Button
                variant="primary"
                type="submit"
                disabled={!emailInput || !passwordInput || !channelNameInput}
                className="w-50 mb-3"
              >
                Create Account
              </Button>
            </div>
          </Form>
          {error && (
            <CustomAlert
              variant={"danger"}
              message={"Account already exists!"}
            />
          )}
          {errorChannelName && (
            <CustomAlert
              variant={"danger"}
              message={"Channel name already exists"}
            />
          )}
          {successMessage && (
            <CustomAlert
              className={"mt-3"}
              variant={"success"}
              message={
                "Account created successfully! You will receive a validation email."
              }
            />
          )}
          <p className="text-center">
            <Link to="/login">Already have an account?</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
