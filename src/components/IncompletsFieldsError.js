import React from "react";

const IncompletsFieldsError = () => {
  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <strong>Error!</strong> Please fill all fields
    </div>
  );
};

export default IncompletsFieldsError;
