import Header from "./Header";
import { Form, Button, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import JwtService from "../service/jwtservice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditAccount = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [channel, setChannel] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    const getChannelName = () => {
      axios
        .get(
          "http://localhost:8080/videoplatform/api/account/channelName",
          config
        )
        .then((response) => {
          setChannel(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getChannelName();
  }, []);

  const submitChanges = () => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    const body = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      newChannelName: channel,
    };

    axios
      .post(
        "http://localhost:8080/videoplatform/api/account/updateAccount",
        body,
        config
      )
      .then(() => {
        actionLogout();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const actionLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <Header />
      <Container className="editAccount-container">
        <Form
          //   onSubmit={handleSubmit}
          className="mx-auto mt-5"
          style={{ maxWidth: "500px" }}
        >
          <Form.Group className="mb-3" controlId="channel">
            <Form.Label>Channel Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter channel"
              onChange={(e) => setChannel(e.target.value)}
              value={channel}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>Current password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter current password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="button" onClick={submitChanges}>
            Save
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default EditAccount;
