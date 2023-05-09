import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import JwtService from "../service/jwtservice";
import ClientVideo from "../service/clientVideo";

const Comments = ({ videoId, commentsUpdated }) => {
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [commentDeleted, setCommentDeleted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commnetToDeleteId, setCommnetToDeleteId] = useState(null);
  const [userRole, setUserRole] = useState(undefined);

  const handleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const loadComments = () => {
    ClientVideo.getCommentsByVideoId(videoId)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getUserId = () => {
    if (JwtService.checkJwt()) {
      ClientVideo.getLogUserId()
        .then((response) => {
          setUserId(response.data);
          setCommentDeleted(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const deleteComment = (idComment) => {
    ClientVideo.deleteCommentById(idComment)
      .then(() => {
        setCommentDeleted(true);
        handleDeleteModal();
        setCommnetToDeleteId(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    const userRole = JwtService.getRole();
    setUserRole(userRole);
    loadComments();
    getUserId();
  }, [commentsUpdated, videoId, commentDeleted]);

  return (
    <>
      {comments.length === 0 ? (
        <p>There are no comments yet</p>
      ) : (
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
                    handleDeleteModal();
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
                      handleDeleteModal();
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
      )}
      <Modal show={showDeleteModal} onHide={handleDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
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
