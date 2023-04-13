import Header from "./Header";
import { useState, useEffect } from "react";
import JwtService from "../service/jwtservice";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Dropdown,
  ButtonGroup,
  Alert,
} from "react-bootstrap";

const Channel = () => {
  const [videos, setVideos] = useState([]);
  const [playListSet, setPlayListSet] = useState([]);
  const [succesMessage, setSuccesMessage] = useState(false);
  const [channel, setChannel] = useState(null);

  const navigate = useNavigate();
  const loc = useLocation();
  const channelVideo = loc.state.channelVideo;

  useEffect(() => {
    setChannel(channelVideo);
  }, []);
  
  useEffect(() => {
    const getPlayListSet = () => {
      if (channel) {
        const config = {
          headers: { Authorization: JwtService.addAuthorization() },
        };
        axios
          .get(
            `http://localhost:8080/videoplatform/api/account/playlistsByEmailFromToken`,
            config
          )
          .then((response) => {
            setPlayListSet(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };

    const getSongsFromChannel = () => {
      if (channel) {
        const config = {
          headers: { Authorization: JwtService.addAuthorization() },
        };
        axios
          .get(
            `http://localhost:8081/videoplatform/api/video/getVideosByChannelName/${channel}`,
            config
          )
          .then((response) => {
            setVideos(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    getPlayListSet();
    getSongsFromChannel();
  }, [channel]);

  const addToPlaylist = (e) => {
    const load = e.target.dataset.id;
    const params = load.split(" ");
    const idPlaylistList = params[0];
    const idVideo = params[1];

    const config = {
      headers: {
        Authorization: JwtService.addAuthorization(),
        "Content-Type": "application/json",
      },
    };

    const body = {
      idPlayList: idPlaylistList,
      idVideo: idVideo,
    };

    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/insertToPlaylist`,
        body,
        config
      )
      .then(() => {
        setSuccesMessage(true);
      })
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      setSuccesMessage(false);
    }, 1000);
  };

  const play = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
  };

  return (
    <>
      <Header />
      <Container className="videosTable">
        <Row className="justify-content-md-center">
          <Col>
            <h2
              style={{
                display: "inline-block",
                textAlign: "center",
                width: "100%",
              }}
            >
              {channel}`s channel
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col sm={4}>
            {succesMessage && (
              <>
                <Alert variant={"success"} className="customPlayer">
                  Successfully added to the playlist!
                </Alert>
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Channel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, key) => {
                  return (
                    <tr key={video.videoId}>
                      <td>{video.videoTitle}</td>
                      <td>{video.videoChannel}</td>
                      <td>
                        <Button
                          style={{ marginRight: "10px" }}
                          value={video.videoId}
                          onClick={play}
                        >
                          Go to video
                        </Button>
                        <Dropdown as={ButtonGroup}>
                          <Dropdown.Toggle
                            variant="primary"
                            id="dropdown-basic"
                          >
                            Add in playlist
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {playListSet.map((playList, key) => {
                              return (
                                <Dropdown.Item
                                  key={playList.id}
                                  data-id={playList.id + " " + video.videoId}
                                  onClick={addToPlaylist.bind(this)}
                                >
                                  {playList.title}
                                </Dropdown.Item>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Channel;
