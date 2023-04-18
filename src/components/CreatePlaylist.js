import React from "react";
import axios from "axios";
import JwtService from "../service/jwtservice";
import { Button, Form, Modal } from "react-bootstrap";

const CreatePlaylist = ({ handleClose, show, newPlaylistAdded }) => {
  let titleInput;

  const setTitle = (text) => {
    titleInput = text;
  };

  const createPlaylist = () => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
      "Content-Type": "application/json",
    };

    const body = {
      title: titleInput,
    };

    axios
      .post(
        "http://localhost:8080/videoplatform/api/account/createNewPlayList",
        body,
        config
      )
      .then(() => {
        newPlaylistAdded();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Playlist title</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              autoFocus
            />
          </Form.Group>
          <div className="createPlayButtons">
            <Button type="submit" variant="primary" onClick={createPlaylist}>
              Add
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePlaylist;
