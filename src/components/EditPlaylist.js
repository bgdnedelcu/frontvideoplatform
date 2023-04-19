import React, { useState } from "react";
import axios from "axios";
import JwtService from "../service/jwtservice";
import { Button, Form, Modal } from "react-bootstrap";

const EditPlaylist = ({ handleClose, show, playlistId, triggerRerender }) => {
  let titleInput;

  const setTitle = (text) => {
    titleInput = text;
  };

  const editPlaylistTitle = () => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };
    const formData = new FormData();
    formData.append("title", titleInput);

    axios
      .put(
        `http://localhost:8080/videoplatform/api/account/editPlaylistTitle/${playlistId}`,
        formData,
        config
      )
      .then(() => {
        triggerRerender();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit playlist title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Enter new playlist title</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New title"
              type="text"
              autoFocus
            />
          </Form.Group>
          <div className="createPlayButtons">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                editPlaylistTitle();
                handleClose();
              }}
            >
              Save
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

export default EditPlaylist;
