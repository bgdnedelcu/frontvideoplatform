import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import Header from "./Header";
import IncompletsFieldsError from "./IncompletsFieldsError";
import axios from "axios";
import JwtService from "../service/jwtservice";
import Succes from "./Succes";

const UploadVideo = () => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [fieldsIncomplete, setFieldsIncomplete] = useState(false);
  const [succes, setSucces] = useState(false);

  const handleTitleChange = (e) => {
    setVideoTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setVideoDescription(e.target.value);
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (videoTitle === "" || videoDescription === "" || selectedFile === null) {
      setFieldsIncomplete(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("file", selectedFile);
    const config = {
      headers: {
        Authorization: JwtService.addAuthorization(),
      },
    };

    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/upload`,
        formData,
        config
      )
      .then(() => {
        setVideoTitle("");
        setVideoDescription("");
        setSelectedFile("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    let fieldsIncompleteTimer;
    let succesTimer;

    if (fieldsIncomplete) {
      fieldsIncompleteTimer = setTimeout(() => {
        setFieldsIncomplete(false);
      }, 5000);
    }

    if (succes) {
      succesTimer = setTimeout(() => {
        setSucces(false);
      }, 5000);
    }

    return () => {
      clearTimeout(fieldsIncompleteTimer);
      clearTimeout(succesTimer);
    };
  }, [fieldsIncomplete, succes]);

  return (
    <>
      <Header />
      <Container className="upload-container">
        <Form
          onSubmit={handleSubmit}
          className="mx-auto mt-5"
          style={{ maxWidth: "500px" }}
        >
          <Form.Group className="mb-3" controlId="formVideoTitle">
            <Form.Label>Video Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter video title"
              value={videoTitle}
              onChange={handleTitleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formVideoDescription">
            <Form.Label>Video Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter video description"
              value={videoDescription}
              onChange={handleDescriptionChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formVideoFile">
            <Form.Label>Select Video File</Form.Label>
            <Form.Control type="file" onChange={handleFileSelect} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Upload
          </Button>
        </Form>
        {fieldsIncomplete && <IncompletsFieldsError />}
        {succes && <Succes />}
      </Container>
    </>
  );
};

export default UploadVideo;
