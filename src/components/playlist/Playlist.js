import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import Header from "../helpers/Header";
import CreatePlaylist from "./CreatePlaylist";
import EditPlaylist from "./EditPlaylist";
import ClientUser from "../../service/clientUser";
import ClientVideo from "../../service/clientVideo";
import CustomModal from "../customs/CustomModal";
import CustomAlert from "../customs/CustomAlert";

const Playlist = () => {
  const [playlists, setPlayListSet] = useState([]);
  const [numPlaylists, setNumPlaylists] = useState(0);
  const [playlistToDeleteId, setPlaylistToDeleteId] = useState(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showDeletePlaylistModal, setShowDeletePlaylistModal] = useState(false);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [playlistIdToEdit, setPlaylistIdToEdit] = useState(null);
  const [succesDelete, setSuccesDelete] = useState(false);
  const [succesAdded, setSuccesAdded] = useState(false);
  const [succesEdit, setSuccesEdit] = useState(false);
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
  };

  const handleMessagesForEdit = () => {
    setSuccesDelete(false);
    setSuccesAdded(false);
  };

  const handleMessagesForCreate = () => {
    setSuccesDelete(false);
    setSuccesEdit(false);
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
            setSuccesDelete(true);
            setSuccesAdded(false);
            setSuccesEdit(false);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

    setTimeout(() => {
      setSuccesDelete(false);
    }, 2500);
  };

  const classNameForAlert = "alertUser fixed-bottom alert-success";
  const variantForAlert = "success";

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
      <Container className="playlistTable">
        <Row className="justify-content-md-center">
          <Col className="yourPlaylist" sm={4}>
            <h1>Your Playlists</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              striped
              bordered
              hover
              variant="dark"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                <tr>
                  <th className="titleFromPlaylist">Title</th>
                  <th className="actionsFromPlaylist">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Add Playlist</td>
                  <td className="createAreaPlaylist">
                    <p>Press the button to create a new playlist </p>
                    <Button onClick={handleToggleCreatePlaylistModal}>
                      Create new Playlist
                    </Button>
                  </td>
                </tr>
                {playlists.map((playlist, index) => (
                  <tr key={index}>
                    <td>{playlist.title}</td>
                    <td className="actionsPlaylist">
                      <Button
                        className="buttonsPlaylist"
                        onClick={() => goToVideos(playlist.id, playlist.title)}
                      >
                        Explore Videos from playlist
                      </Button>
                      <Button
                        className="buttonsPlaylist"
                        value={playlist.id}
                        onClick={() => {
                          handleToggleEditPlaylistModal();
                          setPlaylistIdToEdit(playlist.id);
                        }}
                      >
                        Edit Playlist Title
                      </Button>
                      <Button
                        className="buttonsPlaylist"
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
        <CreatePlaylist
          show={showCreatePlaylistModal}
          handleModal={handleToggleCreatePlaylistModal}
          triggerRerender={triggerRerenderPlaylists}
          succesMessage={succesAdded}
          setSuccesMessage={setSuccesAdded}
          handleMessages={handleMessagesForCreate}
        />
        <EditPlaylist
          show={showEditPlaylistModal}
          handleModal={handleToggleEditPlaylistModal}
          playlistId={playlistIdToEdit}
          triggerRerender={triggerRerenderPlaylists}
          setSuccesMessage={setSuccesEdit}
          handleMessages={handleMessagesForEdit}
        />
        <CustomModal
          show={showDeletePlaylistModal}
          onHide={handleToggleDeleteModal}
          title={"Confirm delete"}
          body={"Are you sure you want to delete the playlist?"}
          onClick={handleToggleDeleteModal}
          variant={"danger"}
          onClickConfirm={() => {
            deletePlaylist(playlistToDeleteId);
          }}
          buttonMessage={"Delete"}
        />
        {succesDelete && (
          <CustomAlert
            className={classNameForAlert}
            variant={variantForAlert}
            message={"The playlist has been deleted!"}
          />
        )}
        {succesAdded && (
          <CustomAlert
            className={classNameForAlert}
            variant={variantForAlert}
            message={" New playlist has been created!"}
          />
        )}
        {succesEdit && (
          <CustomAlert
            className={classNameForAlert}
            variant={variantForAlert}
            message={"The playlist name has been changed!"}
          />
        )}
      </Container>
    </>
  );
};

export default Playlist;
