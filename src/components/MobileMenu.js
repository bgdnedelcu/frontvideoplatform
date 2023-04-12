import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Logout from "./Logout";
import JwtService from "../service/jwtservice";

const MobileMenu = () => {
  const [show, setShow] = React.useState(false);
  const user = JwtService.getUser();
  const navigate = useNavigate();

  const goToUpload = () => {
    navigate("/upload");
    window.location.reload();
  };

  const goToPlaylists = () => {
    navigate("/playlists");
    window.location.reload();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-primary" className="me-3" onClick={handleShow}>
        <FontAwesomeIcon icon={faBars} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>{user}</h6>
          <div className="modal-content">
            <Button variant="success" onClick={goToUpload}>
              Upload new video
            </Button>
            <Button variant="secondary" onClick={goToPlaylists}>
              PlayLists
            </Button>
            <Logout />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MobileMenu;
