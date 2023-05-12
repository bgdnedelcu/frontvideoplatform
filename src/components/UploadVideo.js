import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import Header from "./Header";
import IncompletsFieldsError from "./IncompletsFieldsError";
import ClientVideo from "../service/clientVideo";

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
    ClientVideo.uploadVideo(formData)
      .then(() => {
        setVideoTitle("");
        setVideoDescription("");
        setSelectedFile("");
        setSucces(true);
      })
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      setSucces(false);
    }, 5000);
  };

  useEffect(() => {
    let fieldsIncompleteTimer;

    if (fieldsIncomplete) {
      fieldsIncompleteTimer = setTimeout(() => {
        setFieldsIncomplete(false);
      }, 5000);
    }

    return () => {
      clearTimeout(fieldsIncompleteTimer);
    };
  }, [fieldsIncomplete]);

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
        {succes && (
          <div>
            <Alert
              className="alertUser fixed-bottom alert-success"
              variant="success"
            >
              The video has been uploaded!
            </Alert>
          </div>
        )}
      </Container>
    </>
  );
};

export default UploadVideo;
