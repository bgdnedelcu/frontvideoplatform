import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import JwtService from "../service/jwtservice";
import axios from "axios";

const Playlist = () => {
  const [playlists, setPlayListSet] = useState([]);

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
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getPlayListSet();
  }, []);

  const deletePlaylist = (idPlayList) => {
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
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Header />

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
                    <Button style={{ marginLeft: "30px" }}>
                      Create new Playlist
                    </Button>
                  </td>
                </tr>

                {playlists.map((playlist, key) => (
                  <tr key={key}>
                    <td>{playlist.title}</td>
                    <td>
                      <Button
                        className="buttonFromPlaylist"
                        value={playlist.id}
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
                        onClick={() => deletePlaylist(playlist.id)}
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
