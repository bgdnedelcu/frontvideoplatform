import React, { useState, useEffect } from "react";
import axios from "axios";
import JwtService from "../service/jwtservice";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Comments = ({ videoId, commentsUpdated }) => {
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [commentDeleted, setCommentDeleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commnetToDeleteId, setCommnetToDeleteId] = useState(null);
  const [userRole, setUserRole] = useState(undefined);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  useEffect(() => {
    const loadComments = () => {
      const config = {
        headers: { Authorization: JwtService.addAuthorization() },
      };

      axios
        .get(
          `http://localhost:8081/videoplatform/api/video/commentsByVideoId/${videoId}`,
          config
        )
        .then((response) => {
          setComments(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const getUserId = () => {
      const config = {
        headers: { Authorization: JwtService.addAuthorization() },
      };

      axios
        .get(
          "http://localhost:8081/videoplatform/api/video/getLogUserId",
          config
        )
        .then((response) => {
          setUserId(response.data);
          setCommentDeleted(false);
          console.log(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    loadComments();
    getUserId();

    const userRole = JwtService.getRole();
    setUserRole(userRole);
  }, [commentsUpdated, videoId, commentDeleted]);

  const deleteComment = (idComment) => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    axios
      .delete(
        `http://localhost:8081/videoplatform/api/video/deleteCommentById/${idComment}`,
        config
      )
      .then((response) => {
        setCommentDeleted(true);
        console.log(response.data);
        handleCloseDeleteModal();
        setCommnetToDeleteId(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div>
        {comments.map((comment) => (
          <div key={comment.idComment} className="card mb-3">
            <div className="card-header">
              <Link
                to={`/channel/${comment.channelName}`}
                state={{ channelVideo: comment.channelName }}
                className="linkToChannel"
              >
                {comment.channelName}
              </Link>
            </div>
            <div className="card-body">
              <p className="card-text">{comment.comment}</p>
            </div>
            {userRole === "admin" ? (
              <Button
                variant="outline-danger"
                className="deleteCommentButton"
                onClick={() => {
                  handleShowDeleteModal();
                  setCommnetToDeleteId(comment.idComment);
                }}
              >
                Delete comment
              </Button>
            ) : (
              comment.idUser === userId && (
                <Button
                  variant="outline-danger"
                  className="deleteCommentButton"
                  onClick={() => {
                    handleShowDeleteModal();
                    setCommnetToDeleteId(comment.idComment);
                  }}
                >
                  Delete your comment
                </Button>
              )
            )}
          </div>
        ))}
      </div>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log(commnetToDeleteId);
              deleteComment(commnetToDeleteId);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Comments;
