import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Header from "./Header";
import CreatePlaylist from "./CreatePlaylist";
import EditPlaylist from "./EditPlaylist";
import ClientUser from "../service/clientUser";
import ClientVideo from "../service/clientVideo";

const Playlist = () => {
  const [playlists, setPlayListSet] = useState([]);
  const [numPlaylists, setNumPlaylists] = useState(0);
  const [playlistToDeleteId, setPlaylistToDeleteId] = useState(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showDeletePlaylistModal, setShowDeletePlaylistModal] = useState(false);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [playlistIdToEdit, setPlaylistIdToEdit] = useState(null);
  const [actionRerender, setActionRerender] = useState(0);

  const navigate = useNavigate();

  const handleToggleDeleteModal = () =>
    setShowDeletePlaylistModal(!showDeletePlaylistModal);
  const handleToggleCreatePlaylistModal = () =>
    setShowCreatePlaylistModal(!showCreatePlaylistModal);
  const handleToggleEditPlaylistModal = () =>
    setShowEditPlaylistModal(!showEditPlaylistModal);

  const triggerRerenderPlaylists = () => {
    setActionRerender((prevActionRerender) => prevActionRerender + 1);
    console.log(actionRerender);
  };

  const getPlayListSet = () => {
    ClientUser.getPlaylistByEmailFromToken()
      .then((response) => {
        setPlayListSet(response.data);
        setNumPlaylists(response.data.length);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deletePlaylist = (playlistToDeleteId) => {
    const idPlayList = playlistToDeleteId;

    const body = {
      idPlayList: idPlayList,
    };

    ClientVideo.deleteAllVideosFromPlaylist(body)
      .then(() => {
        ClientUser.deletePlaylistById(idPlayList)
          .then(() => {
            setNumPlaylists((prevNumPlaylists) => prevNumPlaylists - 1);
            setPlaylistToDeleteId(null);
            handleToggleDeleteModal();
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const goToVideos = (playlistId) => {
    const videoPath = "/playlist/".concat(playlistId);
    navigate(videoPath, { state: { playlistId } });
  };

  useEffect(() => {
    getPlayListSet();
  }, [numPlaylists, actionRerender]);

  return (
    <>
      <Header />
      <CreatePlaylist
        show={showCreatePlaylistModal}
        handleModal={handleToggleCreatePlaylistModal}
        triggerRerender={triggerRerenderPlaylists}
      />
      <EditPlaylist
        show={showEditPlaylistModal}
        handleModal={handleToggleEditPlaylistModal}
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
                      onClick={handleToggleCreatePlaylistModal}
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
                          handleToggleEditPlaylistModal();
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
                          handleToggleDeleteModal();
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

      <Modal show={showDeletePlaylistModal} onHide={handleToggleDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the playlist?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleToggleDeleteModal}>
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
