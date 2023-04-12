import React, { useState, useEffect } from "react";
import axios from "axios";
import JwtService from "../service/jwtservice";

const Comments = ({ videoId, commentsUpdated }) => {
  const [comments, setComments] = useState([]);

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
    loadComments();
  }, [commentsUpdated, videoId]);

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.idComment} className="card mb-3">
          <div className="card-header">{comment.channelName}</div>
          <div className="card-body">
            <p className="card-text">{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comments;
