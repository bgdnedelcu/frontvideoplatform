import { useState } from "react";
import ClientVideo from "../../service/clientVideo";
import { Form, Button, Row, Col } from "react-bootstrap";

const AddComment = ({
  idVideo,
  onCommentAdded,
  setSuccesCommentAdded,
  handleMessages,
}) => {
  const [content, setContent] = useState("");
  const [emptyContentError, setEmptyContentError] = useState(false);
  const [lengthError, setLengthError] = useState(false);

  const saveComment = (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setEmptyContentError(true);
      return;
    }

    if (content.length > 600) {
      setLengthError(true);
      return;
    }

    ClientVideo.addComment(content, idVideo)
      .then(() => {
        onCommentAdded();
        setSuccesCommentAdded(true);
        setEmptyContentError(false);
        setLengthError(false);
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
    setEmptyContentError(false);
    if (content.length <= 600) {
      setLengthError(false);
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
                emptyContentError
                  ? "is-invalid"
                  : "" || (lengthError && "is-invalid")
              }
              placeholder="Add a comment"
              id="commentContent"
              value={content}
              onChange={changeContent}
            />
            {emptyContentError && (
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
