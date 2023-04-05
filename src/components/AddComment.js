import axios from "axios";
import { useState } from "react";
import JwtService from "../service/jwtservice";

const AddComment = ({ idVideo, onCommentAdded }) => {
  const [content, setContent] = useState("");

  const saveComment = (event) => {
    event.preventDefault();
    const config = {
      headers: {
        Authorization: JwtService.addAuthorization(),
        "Content-Type": "text/plain",
      },
    };

    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/addComment?idVideo=${idVideo}`,
        content,
        config
      )
      .then((response) => {
        console.log(response);
        onCommentAdded();
      })
      .catch((error) => {
        console.log(error);
      });
    setContent("");
  };

  const changeContent = (event) => {
    setContent(event.target.value);
  };

  return (
    <form onSubmit={saveComment} className="mb-3">
      <div className="row">
        <div className="col-md-8">
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Adaugă un comentariu"
              id="commentContent"
              value={content}
              onChange={changeContent}
            ></textarea>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-end justify-content-start">
          <button className="btn btn-primary" type="submit">
            Add Comment
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddComment;
