import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import Header from "./Header";
import ClientUser from "../service/clientUser";
import ClientVideo from "../service/clientVideo";
import JwtService from "../service/jwtservice";
import CustomAlert from "./CustomAlert";
import CustomModal from "./CustomModal";

const Channel = () => {
  const [videos, setVideos] = useState([]);
  const [playListSet, setPlayListSet] = useState([]);
  const [succesAdded, setSuccesAdded] = useState(false);
  const [error, setError] = useState(false);
  const [succesDeleted, setSuccesDeleted] = useState(false);
  const [channel, setChannel] = useState(null);
  const [userRole, setUserRole] = useState(undefined);
  const [userId, setUserId] = useState(null);
  const [videoIdToDelete, setVideoIdToDelete] = useState(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noVideosYet, setNoVideos] = useState(false);

  const navigate = useNavigate();
  const { channelName } = useParams();

  const handleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const deleteVideo = (videoIdToDelete) => {
    const videoId = videoIdToDelete;
    ClientVideo.deleteVideoById(videoId)
      .then(() => {
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video.videoId !== videoId)
        );
        setSuccesDeleted(true);
        setSuccesAdded(false);
        setError(false);
        setTimeout(() => {
          setSuccesDeleted(false);
        }, 2500);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setChannel(channelName);
  }, []);

  useEffect(() => {
    const userRole = JwtService.getRole();
    setUserRole(userRole);
    getPlayListSet();
    getVideosFromChannel();
    getUserId();
  }, [channel, videoIdToDelete]);

  const getUserId = () => {
    if (JwtService.checkJwt()) {
      ClientVideo.getLogUserId()
        .then((response) => {
          setUserId(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const getPlayListSet = () => {
    if (channel) {
      ClientUser.getPlaylistByEmailFromToken()
        .then((response) => {
          setPlayListSet(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const getVideosFromChannel = () => {
    if (channel) {
      ClientVideo.getVideosForChannel(channel)
        .then((response) => {
          setVideos(response.data);
          if (response.data.length === 0) {
            setNoVideos(true);
          }
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
        setSuccesAdded(true);
        setError(false);
        setSuccesDeleted(false);
        setTimeout(() => {
          setSuccesAdded(false);
        }, 2500);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError(true);
          setSuccesAdded(false);
          setShowDeleteModal(false);
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
        console.error(err);
      });
  };

  const play = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
  };

  const handleLinkClick = () => {
    window.location.reload();
  };

  return (
    <>
      <Header />
      <Container className="videosTable">
        <Row className="justify-content-md-center">
          <Col>
            <a
              href={`/channel/${channelName}`}
              className="channelTitle"
              style={{
                display: "inline-block",
                textAlign: "center",
                width: "100%",
              }}
              onClick={handleLinkClick}
            >
              {channelName}
            </a>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="table-responsive">
              <Table
                striped
                bordered
                hover
                variant="dark"
                style={{ tableLayout: "fixed" }}
              >
                {noVideosYet ? (
                  <p
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                      width: "100%",
                      color: "red",
                    }}
                  >
                    {" "}
                    This channel is empty
                  </p>
                ) : (
                  <>
                    <thead>
                      <tr>
                        <th className="titleFromChannel">Title</th>
                        <th className="actionsFromChannel">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((video, index) => {
                        return (
                          <tr key={index}>
                            <td className="responsive">{video.videoTitle}</td>
                            <td className="actions">
                              <Button
                                className="button1 button-width"
                                value={video.videoId}
                                onClick={play}
                              >
                                Go to video
                              </Button>
                              <Dropdown as={ButtonGroup} className="button3">
                                <Dropdown.Toggle
                                  variant="primary"
                                  className="button-width"
                                >
                                  Add in playlist
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {playListSet.map((playList, key) => {
                                    return (
                                      <Dropdown.Item
                                        key={playList.id}
                                        data-id={
                                          playList.id + " " + video.videoId
                                        }
                                        onClick={addToPlaylist.bind(this)}
                                      >
                                        {playList.title}
                                      </Dropdown.Item>
                                    );
                                  })}
                                </Dropdown.Menu>
                              </Dropdown>
                              {(video.userId === userId ||
                                userRole === "admin") && (
                                <Button
                                  className="button2 button-width"
                                  variant="danger"
                                  onClick={() => {
                                    handleDeleteModal();
                                    setVideoIdToDelete(video.videoId);
                                  }}
                                >
                                  Delete video{" "}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}
              </Table>
            </div>
          </Col>
        </Row>
        <CustomModal
          show={showDeleteModal}
          onHide={handleDeleteModal}
          title={"Confirm delete"}
          body={"Are you sure you want to delete this video?"}
          onClick={handleDeleteModal}
          variant={"danger"}
          onClickConfirm={() => {
            deleteVideo(videoIdToDelete);
            handleDeleteModal();
          }}
          buttonMessage={"Delete"}
        />
        {succesAdded && (
          <CustomAlert
            className={"alertUser fixed-bottom alert-success"}
            message={"The video has been successfully added to the playlist!"}
          />
        )}
        {error && (
          <CustomAlert
            className={"alertUser fixed-bottom alert-danger"}
            message={"The video is already in this playlist!"}
          />
        )}
        {succesDeleted && (
          <CustomAlert
            className={"alertUser fixed-bottom alert-success"}
            message={"The video has been deleted!"}
          />
        )}
      </Container>
    </>
  );
};

export default Channel;
