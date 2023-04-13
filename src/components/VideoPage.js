import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import AddComment from "./AddComment";
import Comments from "./Comments";
import NotFound from "./NotFound";
import JwtService from "../service/jwtservice";

const VideoPage = () => {
  // const loc = useLocation();
  // const videoId = loc.state.videoId;

  const navigate = useNavigate();
  const { videoId } = useParams();

  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoChannel, setVideoChannel] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commenter, setCommenter] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [commentsUpdated, setCommentsUpdated] = useState(0);

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
        console.log("Video details loaded successfully: {}", response.data);
      })
      .catch((error) => {
        console.error(error);
        console.error("Error loading video details: {}", error.message);
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

  const goToChannel = (e) => {
    const channelVideo = e.target.value;
    const channelPath = "/channel/".concat(channelVideo);
    console.log(channelPath);
    navigate(channelPath, { state: { channelVideo } });
  };

  const handleCommentAdded = () => {
    setCommentsUpdated(commentsUpdated + 1);
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
              <video
                className="video embed-responsive-item"
                controls
                autoPlay={true}
              >
                {videoUrl ? (
                  <source src={videoUrl} type="video/mp4" />
                ) : (
                  <NotFound />
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
                  <Link
                    to={`/channel/${videoChannel}`}
                    state={{ channelVideo: videoChannel }}
                  >
                    {videoChannel}
                  </Link>
                  {/* <Button
                    variant="primary"
                    value={videoChannel}
                    onClick={goToChannel}
                  >
                    {videoChannel}
                  </Button> */}
                </p>
                {/* {JwtService.checkJwt() && ( */}
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
                {/* )} */}
              </div>
              <div
                className="mb-3 videoDescription"
                onClick={() => setShowDescription(!showDescription)}
              >
                {" "}
                {videoDescription.length > 250 ? (
                  <>
                    <p>
                      {showDescription
                        ? videoDescription
                        : `${videoDescription.substring(0, 250)}...`}
                    </p>
                    {!showDescription && (
                      <Button
                        className="showMore"
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setShowDescription(true)}
                      >
                        Show more
                      </Button>
                    )}
                  </>
                ) : (
                  <p>{videoDescription}</p>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {/* {JwtService.checkJwt() && ( */}
            <div className="mt-3">
              <h5>Comment as {commenter}</h5>
              <AddComment
                idVideo={videoId}
                onCommentAdded={handleCommentAdded}
              />
            </div>
            {/* )} */}
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mt-3">
              <Comments
                videoId={videoId}
                commenter={commenter}
                commentsUpdated={commentsUpdated}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VideoPage;
