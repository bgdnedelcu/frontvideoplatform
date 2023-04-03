import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

function Comments() {
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const commentText = formData.get("commentText");

    setComments((prevComments) => [
      ...prevComments,
      { text: commentText, channelName: "ChannelName", date: new Date() },
    ]);

    // clear form after submit
    event.target.reset();
  };

  return (
    <div>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group controlId="commentText">
          <Form.Label>Adaugă un comentariu</Form.Label>
          <Form.Control as="textarea" rows={3} name="commentText" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Adaugă
        </Button>
      </Form>
      <div className="mt-3">
        <h3>Comentarii</h3>
        {comments.map((comment) => (
          <div key={comment.date}>
            <p>
              <strong>{comment.channelName}:</strong> {comment.text}
            </p>
            <p>{comment.date.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
