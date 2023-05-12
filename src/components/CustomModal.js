import React from "react";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({
  show,
  onHide,
  title,
  body,
  onClick,
  variant,
  onClickConfirm,
  buttonMessage,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClick}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onClickConfirm}>
          {buttonMessage}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
