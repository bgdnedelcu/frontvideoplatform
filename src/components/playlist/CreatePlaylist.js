import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ClientUser from "../../service/clientUser";

const CreatePlaylist = ({
  handleModal,
  show,
  triggerRerender,
  setSuccesMessage,
  handleMessages,
}) => {
  let titleInput;

  const setTitle = (text) => {
    titleInput = text;
  };

  const createPlaylist = (e) => {
    e.preventDefault();
    const body = {
      title: titleInput,
    };

    ClientUser.createNewPlayList(body)
      .then(() => {
        triggerRerender();
        setSuccesMessage(true);
        handleMessages();
      })
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      setSuccesMessage(false);
    }, 2500);
  };

  return (
    <Modal show={show} onHide={handleModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createPlaylist}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Playlist title</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter playlist title"
              type="text"
              autoFocus
            />
          </Form.Group>
          <div className="createPlayButtons">
            <Button
              type="submit"
              variant="primary"
              onClick={(e) => {
                createPlaylist(e);
                handleModal();
              }}
            >
              Save
            </Button>
            <Button variant="secondary" onClick={handleModal}>
              Close
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePlaylist;
