import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";
import VideoService from "../service/VideoService";

function VideoPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("10");

  // const callVideo = () => {
  //   VideoService.playVideo(videoId)
  //     .then((response) => {
  //       setVideoUrl(
  //         "localhost:8081/videoplatform/api/video/play/19"
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // };

  // useEffect(() => {
  //   callVideo();
  // }, []);

  return (
    <>
      <Header />
      <Container fluid className="videoPage">
        <Row>
          <Col>
            <div className="embed-responsive embed-responsive-16by9">
              <video className="video embed-responsive-item" controls>
                <source
                  src="http://localhost:8081/videoplatform/api/video/play/19"
                  type="video/mp4"
                />
              </video>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="p-3">
              <h3 className="mb-3">Titlul videoclipului</h3>
              <p className="mb-0">
                De la<a href="#">Numele utilizatorului</a>
              </p>
              <p className="mb-0">
                Descrierea videoclipului Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Nullam ac fermentum nibh, nec commodo magna. Ut
                rutrum diam et ligula ultricies, vel consequat magna tristique.
                Vivamus congue lacinia ultricies. Praesent a dui lobortis,
                molestie mi vel, dignissim tellus. Curabitur vitae velit nulla.
                Ut pharetra nisi eget mauris semper posuere.{" "}
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="commentText">
                <Form.Label>Adaugă un comentariu</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Adaugă
              </Button>
            </Form>
            <div className="mt-3">
              <h3>Comentarii</h3>
              <p>Aici vor apărea comentariile utilizatorilor</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default VideoPage;
