import React from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  FormControl,
  Table,
  Modal,
} from "react-bootstrap";

const CreatePlaylist = ({ handleClose, show }) => {
  var titleInput;

  const setTitle = (text) => {
    titleInput = text;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add playlist</Modal.Title>
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
          <Button type="submit" variant="primary">
            Add
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePlaylist;
