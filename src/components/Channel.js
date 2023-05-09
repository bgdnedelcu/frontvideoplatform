import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import Header from "./Header";
import ClientUser from "../service/clientUser";
import ClientVideo from "../service/clientVideo";

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
    getPlayListSet();
    getSongsFromChannel();
  }, [channel]);

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

  const getSongsFromChannel = () => {
    if (channel) {
      ClientVideo.getVideosByChannelName(channel)
        .then((response) => {
          setVideos(response.data);
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
