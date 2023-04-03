import axios from "axios";
import { useState } from "react";
import JwtService from "../service/jwtservice";

const AddComment = ({ idVideo }) => {
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
      })
      .catch((error) => {
        console.log(error);
      });
    setContent(""); // Reset the content field after submitting the form
  };

  const changeContent = (event) => {
    setContent(event.target.value);
  };

  return (
    <form onSubmit={saveComment} className="mb-3">
      <div className="row">
        <div className="col-md-8"> {/* Reduce the width of the comment field */}
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Adaugă un comentariu"
              id="commentContent"
              value={content}
              onChange={changeContent}
            ></textarea>
            {/* Remove the label and use the placeholder instead */}
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-end justify-content-end"> {/* Align the button to the right */}
          <button className="btn btn-primary" type="submit">
            Adaugă comentariu
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddComment;
