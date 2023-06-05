import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import JwtService from "../service/jwtservice";
import ClientVideo from "../service/clientVideo";
import CustomModal from "./CustomModal";

const Comments = ({
  videoId,
  commentsUpdated,
  setSuccesDeleteMessage,
  handleMessages,
}) => {
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
        setSuccesDeleteMessage(true);
        handleMessages();
      })
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      setSuccesDeleteMessage(false);
    }, 2500);
  };

  const setCommentId = (id) => {
    if (id !== commnetToDeleteId) {
      setCommnetToDeleteId(id);
    }
    return;
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
                    setCommentId(comment.idComment);
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
                      setCommentId(comment.idComment);
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
      <CustomModal
        show={showDeleteModal}
        onHide={handleDeleteModal}
        title={"Confirm delete"}
        body={"Are you sure you want to delete this comment?"}
        onClick={handleDeleteModal}
        variant={"danger"}
        onClickConfirm={() => {
          deleteComment(commnetToDeleteId);
        }}
        buttonMessage={"Delete"}
      />
    </>
  );
};

export default Comments;
