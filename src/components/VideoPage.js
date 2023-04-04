import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "./Header";
import JwtService from "../service/jwtservice";
import AddComment from "./AddComment";
import Comments from "./Comments";
import axios from "axios";

function VideoPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(21);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoChannel, setVideoChannel] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commenter, setCommenter] = useState("");
  const [showDescription, setShowDescription] = useState(false); // new state variable
  const [content, setContent] = useState("");

  // rest of the code

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
        setLiked(response.data.liked);
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
        if (!liked) {
          setLikes(likes + 1);
          setLiked(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const undoLike = () => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };
    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/deleteLike/${videoId}`,
        {},
        config
      )
      .then(() => {
        if (liked) {
          setLikes(likes - 1);
          setLiked(false);
          console.log("CALL");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const saveComment = (event) => {
    event.preventDefault();
    const config = {
      headers: {
        Authorization: JwtService.addAuthorization(),
        "Content-Type": "text/plain",
      },
    };

    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/addComment?idVideo=${videoId}`,
        content,
        config
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setContent("");
  };

  const changeContent = (event) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    createVideoUrl();
    loadVideoDetails();
    loadCommenter();
  }, []);

  useEffect(() => {}, []);

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
        <Row className="videoInfo">
          <Col>
            <div className="p-3">
              <div className="mb-3 videoTitle">
                <h3>{videoTitle}</h3>
              </div>
              <div className="mb-3 videoChannel">
                <p>
                  From <a href="#">{videoChannel}</a>
                </p>
                <div className="like-button">
                  {liked ? (
                    <Button
                      variant="primary"
                      className="liked"
                      onClick={undoLike}
                    >
                      Liked ({likes})
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={addLike}>
                      Like ({likes})
                    </Button>
                  )}
                </div>
              </div>
              <div
                className="mb-3 videoDescription"
                onClick={() => setShowDescription(!showDescription)}
              >
                {" "}
                <p>
                  {showDescription
                    ? videoDescription
                    : `${videoDescription.substring(0, 200)}...`}
                </p>{" "}
                {!showDescription && <p>Show more</p>}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mt-3">
              <h5>Comment as {commenter}</h5>
              <form onSubmit={saveComment} className="mb-3">
                {" "}
                //from here
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Adaugă un comentariu"
                        id="commentContent"
                        value={content}
                        onChange={changeContent}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex align-items-end justify-content-start">
                    <button className="btn btn-primary" type="submit">
                      Add Comment
                    </button>
                  </div>
                </div>
              </form>
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
      </Container>
    </>
  );
}

export default VideoPage;
