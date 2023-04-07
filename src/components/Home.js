import React from "react";
import Header from "./Header";
import { useState, useEffect } from "react";
import JwtService from "../service/jwtservice";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";

function Home() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const size = 12;

  const navigate = useNavigate();

  const loc = useLocation();
  const search = loc.state;

  useEffect(() => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
      params: {
        size: size,
        page: page,
      },
    };

    let baseUrl = "http://localhost:8081/videoplatform/api/video/";
    if (search == null) {
      baseUrl = baseUrl.concat("home");
    } else {
      baseUrl = baseUrl.concat("search/").concat(search.searchText);
    }

    axios
      .get(baseUrl, config) 
      .then((response) => {
        console.log(response.data);
        const newVideos = response.data;
        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [page]);

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }

  const play = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Header />
      <Container className="videosTable">
        <Row>
          <Col>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Channel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, key) => {
                  return (
                    <tr key={video.videoId}>
                      <td>{video.videoTitle}</td>
                      <td>{video.videoChannel}</td>
                      <td>
                        <Button
                          style={{ marginRight: "10px" }}
                          value={video.videoId}
                          onClick={play}
                        >
                          Go to video
                        </Button>
                        <Dropdown as={ButtonGroup}>
                          <Dropdown.Toggle
                            variant="primary"
                            id="dropdown-basic"
                          >
                            Add in playlist
                          </Dropdown.Toggle>
                          <Dropdown.Menu></Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
