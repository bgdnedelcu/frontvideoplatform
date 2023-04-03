import React from "react";
import Comments from "./Comments";

function CommentSection(props) {
  const comments = props.comments.map((comment) => (
    <Comments key={comment.id} comment={comment} />
  ));

  return <div className="comment-section">{comments}</div>;
}

export default CommentSection;
