import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import Header from "./Header";
import AddComment from "./AddComment";
import Comments from "./Comments";
import NotFound from "./NotFound";
import JwtService from "../service/jwtservice";
import ClientVideo from "../service/clientVideo";
import ClientUser from "../service/clientUser";

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

  const { videoId } = useParams();

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
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
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
                  <div className="videoChannel linkToChannel mb-3">
                    <p>
                      <Link
                        to={`/channel/${videoChannel}`}
                        state={{ channelVideo: videoChannel }}
                      >
                        {videoChannel}
                      </Link>
                    </p>
                    {JwtService.checkJwt() && (
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
                    )}
                    {JwtService.checkJwt() && (
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
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
            {JwtService.checkJwt() && (
              <Row className="ro2">
                <Col>
                  <div className="mt-3">
                    <h5>Comment as {commenter}</h5>
                    <AddComment
                      idVideo={videoId}
                      onCommentAdded={handleCommentAdded}
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
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </>
      )}
      {videoNotFound && <NotFound />}
    </>
  );
};

export default VideoPage;
