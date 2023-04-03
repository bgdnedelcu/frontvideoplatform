import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";
import JwtService from "../service/jwtservice";
import CommentSection from "./CommentSection";
import axios from "axios";

function VideoPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(1);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoChannel, setVideoChannel] = useState("");
  const [comments, setComments] = useState([]);

  const createVideoUrl = () => {
    setVideoUrl(
      `${"http://localhost:8081/videoplatform/api/video/play"}/${videoId}`
    );
  };
  
  const loadVideoDetails = () => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    axios
      .get(
        `http://localhost:8081/videoplatform/api/video/videoById/${videoId}`,
        config
      )
      .then((response) => {
        setVideoTitle(response.data.title);
        setVideoDescription(response.data.description);
        axios
          .get(
            `http://localhost:8080/videoplatform/api/account/userById/${response.data.idUser}`,
            config
          )
          .then((response) => {
            setVideoChannel(response.data.channelName);
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const loadVideoOwner = (e) => {
  //   const config = {
  //     headers: { Authorization: JwtService.addAuthorization() },
  //   };

  //   axios
  //     .get(
  //       `http://localhost:8080/videoplatform/api/account/userById/${videoOwnerId}`,
  //       config
  //     )
  //     .then((response) => {
  //       setVideoChannel(response.data.channelName);
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  useEffect(() => {
    createVideoUrl();
    loadVideoDetails();
  }, []);

  return (
    <>
      <Header />
      <Container fluid className="videoPage">
        <Row>
          <Col>
            <div className="embed-responsive embed-responsive-16by9">
              <video className="video embed-responsive-item" controls>
                {videoUrl ? (
                  <source src={videoUrl} type="video/mp4" />
                ) : (
                  <p>Cannot load video right now</p>
                )}
              </video>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="p-3">
              <h3 className="mb-3">{videoTitle}</h3>
              <p className="mb-0">
                De la <a href="#">{videoChannel}</a>
              </p>
              <p className="mb-0">{videoDescription} </p>
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
              <CommentSection comments={comments} />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default VideoPage;
