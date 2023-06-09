import React from "react";
import { Alert } from "react-bootstrap";

const CustomAlert = ({ className, variant, message }) => {
  return (
    <Alert className={`${className} test`} variant={variant}>
      {message}
    </Alert>
  );
};

export default CustomAlert;
