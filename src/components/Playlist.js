import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import JwtService from "../service/jwtservice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreatePlaylist from "./CreatePlaylist";
import EditPlaylist from "./EditPlaylist";

const Playlist = () => {
  const [playlists, setPlayListSet] = useState([]);
  const [numPlaylists, setNumPlaylists] = useState(0);
  const [newPlaylistHasBeenCreated, setNewPlaylistHasBeenCreated] = useState(0);
  const [playlistToDeleteId, setPlaylistToDeleteId] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditPlaylist, setShowEditPlaylist] = useState(false);
  const [playlistIdToEdit, setPlaylistIdToEdit] = useState(null);
  const [actionRerender, setActionRerender] = useState(0);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleCloseCreatePlaylist = () => setShowCreatePlaylist(false);
  const handleShowCreatePlaylist = () => setShowCreatePlaylist(true);

  const handleCloseEditPlaylist = () => setShowEditPlaylist(false);
  const handleShowEditPlaylist = () => setShowEditPlaylist(true);

  const triggerRerenderPlaylists = () => {
    setActionRerender((prevActionRerender) => prevActionRerender + 1);
    console.log(actionRerender);
  };

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
  }, [numPlaylists, newPlaylistHasBeenCreated, actionRerender]);

  const newPlaylistAdded = () => {
    setNewPlaylistHasBeenCreated(
      (prevNewPlaylistHasBeenCreated) => prevNewPlaylistHasBeenCreated + 1
    );
  };

  const deletePlaylist = (playlistToDeleteId) => {
    const idPlayList = playlistToDeleteId;
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
            setPlaylistToDeleteId(null);
            handleCloseDeleteModal();
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
      <CreatePlaylist
        show={showCreatePlaylist}
        handleClose={handleCloseCreatePlaylist}
        newPlaylistAdded={newPlaylistAdded}
      />
      <EditPlaylist
        show={showEditPlaylist}
        handleClose={handleCloseEditPlaylist}
        playlistId={playlistIdToEdit}
        triggerRerender={triggerRerenderPlaylists}
      />
      <Container className="playlistTable">
        <Row className="justify-content-md-center">
          <Col sm={4}>
            <h1>Your Playlists</h1>
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
                    <Button
                      style={{ marginLeft: "30px" }}
                      onClick={handleShowCreatePlaylist}
                    >
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
                        onClick={() => {
                          handleShowEditPlaylist();
                          setPlaylistIdToEdit(playlist.id);
                        }}
                      >
                        Edit Playlist Title
                      </Button>
                      <Button
                        className="buttonFromPlaylist"
                        value={playlist.id}
                        variant="danger"
                        onClick={() => {
                          handleShowDeleteModal();
                          setPlaylistToDeleteId(playlist.id);
                        }}
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

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the playlist?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log(playlistToDeleteId);
              deletePlaylist(playlistToDeleteId);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Playlist;
