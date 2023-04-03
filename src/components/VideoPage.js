import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Header from "./Header";
import JwtService from "../service/jwtservice";
import AddComment from "./AddComment";
import Comments from "./Comments";
import axios from "axios";

function VideoPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(10);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoChannel, setVideoChannel] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commenter, setCommenter] = useState("");

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
        `http://localhost:8081/videoplatform/api/video/getVideoDetails/${videoId}`,
        config
      )

      .then((response) => {
        setVideoTitle(response.data.videoTitle);
        setVideoDescription(response.data.description);
        setVideoChannel(response.data.videoChannelName);
        setLikes(response.data.likes);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadCommenter = () => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    axios
      .get(
        "http://localhost:8080/videoplatform/api/account/channelName",
        config
      )
      .then((response) => {
        console.log(response.data);
        setCommenter(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addLike = () => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };
    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/like/${videoId}`,
        {},
        config
      )
      .then(() => {
        setLikes(likes + 1);
        setLiked(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    createVideoUrl();
    loadVideoDetails();
    loadCommenter();
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
            <div className="mt-3">
              <h5>Comment as {commenter}</h5>
              <AddComment idVideo={videoId} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mt-3">
              <Comments videoId={videoId} commenter={commenter} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mt-3">
              <Button variant="primary" disabled={liked} onClick={addLike}>
                {liked ? `Liked (${likes})` : `Like (${likes})`}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default VideoPage;
