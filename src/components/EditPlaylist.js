import { Button, Form, Modal } from "react-bootstrap";
import ClientUser from "../service/clientUser";

const EditPlaylist = ({
  handleModal,
  show,
  playlistId,
  triggerRerender,
  setSuccesMessage,
  handleMessages,
}) => {
  let titleInput;

  const setTitle = (text) => {
    titleInput = text;
  };

  const editPlaylistTitle = () => {
    const formData = new FormData();
    formData.append("title", titleInput);

    ClientUser.editPlaylist(formData, playlistId)
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

export default EditPlaylist;
