import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import CustomModal from "../customs/CustomModal";

const Logout = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleModal = () => setShow(!show);

  const actionLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <Button variant="outline-primary" className="me-0" onClick={handleModal}>
        Logout
      </Button>
      <CustomModal
        show={show}
        onHide={handleModal}
        title={"Confirm Logout"}
        body={"Are you sure you want to logout?"}
        onClick={handleModal}
        variant={"primary"}
        onClickConfirm={actionLogout}
        buttonMessage={"Logout"}
      />
    </>
  );
};

export default Logout;
