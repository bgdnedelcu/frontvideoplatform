import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Header from "./Header";
import AddComment from "./AddComment";
import Comments from "./Comments";
import NotFound from "./NotFound";
import JwtService from "../service/jwtservice";
import ClientVideo from "../service/clientVideo";
import ClientUser from "../service/clientUser";
import CustomAlert from "./CustomAlert";

const VideoPage = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoChannel, setVideoChannel] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commenter, setCommenter] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [commentsUpdated, setCommentsUpdated] = useState(0);
  const [playListSet, setPlayListSet] = useState([]);
  const [videoNotFound, setVideoNotFound] = useState(false);
  const [succesAddToPlaylist, setSuccesAddedToPlaylist] = useState(false);
  const [succesDeleteComment, setSuccesDeleteComment] = useState(false);
  const [succesAddComment, setSuccesCommentAdded] = useState(false);
  const [errorVideoAlreadyInPlaylist, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { videoId } = useParams();
  const navigate = useNavigate();

  const createVideoUrl = () => {
    ClientVideo.checkIfVideoExists(videoId)
      .then((response) => {
        if (response.status === 200) {
          setVideoUrl(`${ClientVideo.VIDEO_MS_URL}/play/${videoId}`);
        }
      })
      .catch((error) => {
        setVideoNotFound(true);
        console.error(error);
      });
  };

  const handleCommentAdded = () => {
    setCommentsUpdated(commentsUpdated + 1);
  };

  const loadVideoDetails = () => {
    if (JwtService.checkJwt()) {
      ClientVideo.getVideoDetails(videoId)
        .then((response) => {
          setVideoTitle(response.data.videoTitle);
          setVideoDescription(response.data.description);
          setVideoChannel(response.data.videoChannelName);
          setLikes(response.data.likes);
          setLiked(response.data.liked);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      ClientVideo.getVideoDetailsForNonUsers(videoId)
        .then((response) => {
          setVideoTitle(response.data.videoTitle);
          setVideoDescription(response.data.description);
          setVideoChannel(response.data.videoChannelName);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const addLike = () => {
    ClientVideo.likeVideo(videoId)
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
    ClientVideo.deleteLike(videoId)
      .then(() => {
        if (liked) {
          setLikes(likes - 1);
          setLiked(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPlayListSet = () => {
    if (JwtService.checkJwt()) {
      ClientUser.getPlaylistsByEmailFromToken()
        .then((response) => {
          setPlayListSet(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const loadCommenter = () => {
    if (JwtService.checkJwt()) {
      ClientUser.getCommenter()
        .then((response) => {
          setCommenter(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const addToPlaylist = (e) => {
    const load = e.target.dataset.id;
    const params = load.split(" ");
    const idPlaylistList = params[0];
    const idVideo = params[1];

    const body = {
      idPlayList: idPlaylistList,
      idVideo: idVideo,
    };

    ClientVideo.insertToPlaylist(body)
      .then(() => {
        setSuccesAddedToPlaylist(true);
        setError(false);
        setSuccesDeleteComment(false);
        setSuccesCommentAdded(false);
        setTimeout(() => {
          setSuccesAddedToPlaylist(false);
        }, 2500);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError(true);
          setSuccesAddedToPlaylist(false);
          setSuccesDeleteComment(false);
          setSuccesCommentAdded(false);
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
        console.error(err);
      });
  };

  const handleMessagesForAddComment = () => {
    setSuccesAddedToPlaylist(false);
    setError(false);
    setSuccesDeleteComment(false);
  };

  const handleMessagesForDeleteComment = () => {
    setSuccesAddedToPlaylist(false);
    setError(false);
    setSuccesCommentAdded(false);
  };

  const alertClassName = "alertUser fixed-bottom alert-success";
  const alertVariant = "success";

  const goToLogin = () => {
    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    if (!JwtService.checkJwt()) setIsOpen(true);
    createVideoUrl();
    loadCommenter();
    loadVideoDetails();
    getPlayListSet();
  }, []);

  return (
    <>
      {!videoNotFound && (
        <>
          {JwtService.checkJwt() && <Header />}
          <Container fluid className="videoPage">
            <Popup
              className="pop"
              open={isOpen}
              position="center"
              contentStyle={{ width: "600px" }}
              closeOnDocumentClick={false}
            >
              <div className="popupContent">
                <h1>Get the full app experience</h1>
                <p>Enjoy more videos and great features on the app</p>
                <Button onClick={goToLogin}>Login</Button>
              </div>
              <Link
                className="d-flex justify-content-end"
                style={{ color: "grey" }}
                onClick={() => setIsOpen(false)}
              >
                Close
              </Link>
            </Popup>
            <Row>
              <Col>
                <div className="d-flex embed-responsive embed-responsive-16by9">
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
                  <div className="videoChannel linkToChannel mb-3">
                    <p>
                      <Link
                        to={`/channel/${videoChannel}`}
                        state={{ channelVideo: videoChannel }}
                        className="channelOwner"
                      >
                        {videoChannel}
                      </Link>
                    </p>
                    {JwtService.checkJwt() && (
                      <div className="like-button">
                        {liked ? (
                          <Button
                            variant="outline-primary"
                            className="liked"
                            onClick={undoLike}
                          >
                            Liked ({likes})
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="notLiked"
                            onClick={addLike}
                          >
                            Like ({likes})
                          </Button>
                        )}
                      </div>
                    )}
                    {JwtService.checkJwt() && (
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                          variant="primary"
                          id="dropdown-basic"
                          className="playlistVideoPage"
                        >
                          Add in playlist
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {playListSet.map((playList, key) => {
                            return (
                              <Dropdown.Item
                                key={playList.id}
                                data-id={playList.id + " " + videoId}
                                onClick={addToPlaylist.bind(this)}
                              >
                                {playList.title}
                              </Dropdown.Item>
                            );
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
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
                            variant="outline-secondary"
                            size="sm"
                            style={{ border: "0", borderColor: "transparent" }}
                            onClick={() => setShowDescription(true)}
                          >
                            Show more..
                          </Button>
                        )}
                        {showDescription && (
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            style={{ border: "0", borderColor: "transparent" }}
                            onClick={() => setShowDescription(false)}
                          >
                            Show less
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
            {JwtService.checkJwt() && (
              <Row className="ro2">
                <Col>
                  <div className="mt-3">
                    <h5>Comment as {commenter}</h5>
                    <AddComment
                      idVideo={videoId}
                      onCommentAdded={handleCommentAdded}
                      setSuccesCommentAdded={setSuccesCommentAdded}
                      handleMessages={handleMessagesForAddComment}
                    />
                  </div>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <div className="mt-3">
                  <Comments
                    videoId={videoId}
                    commenter={commenter}
                    commentsUpdated={commentsUpdated}
                    setSuccesDeleteMessage={setSuccesDeleteComment}
                    handleMessages={handleMessagesForDeleteComment}
                  />
                </div>
              </Col>
            </Row>
            {succesAddToPlaylist && (
              <CustomAlert
                className={alertClassName}
                variant={alertVariant}
                message={
                  "The video has been successfully added to the playlist!"
                }
              />
            )}
            {succesDeleteComment && (
              <CustomAlert
                className={alertClassName}
                variant={alertVariant}
                message={"The comment has been deleted!"}
              />
            )}
            {succesAddComment && (
              <CustomAlert
                className={alertClassName}
                variant={alertVariant}
                message={"Comment added!"}
              />
            )}
            {errorVideoAlreadyInPlaylist && (
              <CustomAlert
                className={"alertUser fixed-bottom alert-danger"}
                variant={"danger"}
                message={"The video is already in this playlist!"}
              />
            )}
          </Container>
        </>
      )}
      {videoNotFound && <NotFound />}
    </>
  );
};

export default VideoPage;
