import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

function CommentSection(props) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      author: "John Doe",
      text: "Great video!",
      date: "2023-03-31",
    },
    {
      author: "Jane Smith",
      text: "Thanks for sharing!",
      date: "2023-04-01",
    },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newComment = {
      author: "User",
      text: commentText,
      date: new Date().toISOString().slice(0, 10),
    };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <p>{comment.text}</p>
          <p>
            By {comment.author} on {comment.date}
          </p>
        </div>
      ))}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentText">
          <Form.Label>Add a comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add
        </Button>
      </Form>
    </div>
  );
}

export default CommentSection;
