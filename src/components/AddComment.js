import { useState } from "react";
import ClientVideo from "../service/clientVideo";
import { Form, Button, Row, Col } from "react-bootstrap";

const AddComment = ({
  idVideo,
  onCommentAdded,
  setSuccesCommentAdded,
  handleMessages,
}) => {
  const [content, setContent] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [lengthError, setLengtError] = useState(false);

  const saveComment = (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setCommentError(true);
      return;
    }

    if (content.length > 600) {
      setLengtError(true);
      return;
    }

    ClientVideo.addComment(content, idVideo)
      .then(() => {
        onCommentAdded();
        setSuccesCommentAdded(true);
        setCommentError(false);
        setLengtError(false);
        handleMessages();
      })
      .catch((error) => {
        console.error(error);
      });
    setContent("");

    setTimeout(() => {
      setSuccesCommentAdded(false);
    }, 2500);
  };

  const changeContent = (event) => {
    setContent(event.target.value);
    setCommentError(false);
    if (content.length <= 600) {
      setLengtError(false);
    }
  };

  return (
    <Form onSubmit={saveComment} className="mb-3">
      <Row>
        <Col md={10}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              className={
                commentError
                  ? "is-invalid"
                  : "" || (lengthError && "is-invalid")
              }
              placeholder="Add a comment"
              id="commentContent"
              value={content}
              onChange={changeContent}
            />
            {commentError && (
              <Form.Control.Feedback type="invalid">
                The comment cannot be empty.
              </Form.Control.Feedback>
            )}
            {lengthError && (
              <Form.Control.Feedback type="invalid">
                Content too long
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end justify-content-start">
          <Button variant="primary" type="submit">
            Add Comment
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddComment;
