import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Logout from "../user/Logout";
import JwtService from "../../service/jwtservice";
import ClientUser from "../../service/clientUser";

const MobileMenu = () => {
  const [show, setShow] = useState(false);
  const [userRole, setUserRole] = useState(undefined);
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

  const goToEditAccount = () => {
    navigate("/editAccount");
    window.location.reload();
  };

  const goToPersonalChannel = () => {
    ClientUser.getChannelName()
      .then((response) => {
        navigate(`/channel/${response.data}`);
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleModal = () => setShow(!show);

  useEffect(() => {
    const userRole = JwtService.getRole();
    setUserRole(userRole);
  }, []);

  return (
    <>
      <Button variant="outline-primary" className="me-3" onClick={handleModal}>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Modal show={show} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>
            {user}
            {userRole === "admin" && (
              <span style={{ color: "green" }}> ADMIN</span>
            )}
          </h6>
          <div className="menuButtons">
            <Button
              variant="info"
              className="btn btn-block"
              onClick={goToEditAccount}
            >
              Edit Account
            </Button>
            <Button variant="success" className="btn" onClick={goToUpload}>
              Upload new video
            </Button>
            <Button
              variant="primary"
              className="btn"
              onClick={goToPersonalChannel}
            >
              Your channel
            </Button>
            <Button variant="secondary" className="btn" onClick={goToPlaylists}>
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
