import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import JwtService from "../service/jwtservice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreatePlaylist from "./CreatePlaylist";

const Playlist = () => {
  const [playlists, setPlayListSet] = useState([]);
  const [numPlaylists, setNumPlaylists] = useState(0);

  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getPlayListSet = () => {
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
          setNumPlaylists(response.data.length);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getPlayListSet();
  }, [numPlaylists]);

  const deletePlaylist = (e) => {
    const idPlayList = e.target.value;
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
      "Content-Type": "application/json",
    };

    const config2 = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    const body = {
      idPlayList: idPlayList,
    };

    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/deleteAllVideosFromPlaylist`,
        body,
        config
      )
      .then(() => {
        console.log("All videos from playlist have been deleted");
        axios
          .delete(
            `http://localhost:8080/videoplatform/api/account/deletePlaylistById/${idPlayList}`,
            config2
          )
          .then(() => {
            console.log("The playlist has been deleted");
            setNumPlaylists((prevNumPlaylists) => prevNumPlaylists - 1);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const goToVideos = (playlistId, playlistTitle) => {
    const videoPath = "/playlist/".concat(playlistId);
    navigate(videoPath, { state: { playlistId, playlistTitle } });
  };

  return (
    <>
      <Header />
      <CreatePlaylist show={show} handleClose={handleClose} />

      <Container className="playlistTable">
        <Row className="justify-content-md-center">
          <Col sm={4}>
            <h1>Playlists</h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Add Playlist</td>
                  <td>
                    Press the right button to create a new playlist{" "}
                    <Button style={{ marginLeft: "30px" }} onClick={handleShow}>
                      Create new Playlist
                    </Button>
                  </td>
                </tr>

                {playlists.map((playlist, key) => (
                  <tr key={playlist.id}>
                    <td>{playlist.title}</td>
                    <td>
                      <Button
                        className="buttonFromPlaylist"
                        onClick={() => goToVideos(playlist.id, playlist.title)}
                      >
                        Explore Videos from playlist
                      </Button>
                      <Button
                        className="buttonFromPlaylist"
                        value={playlist.id}
                      >
                        Edit Playlist
                      </Button>
                      <Button
                        className="buttonFromPlaylist"
                        value={playlist.id}
                        variant="danger"
                        onClick={deletePlaylist}
                      >
                        Delete Playlist
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Playlist;
