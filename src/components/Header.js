import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Form, FormControl, Button } from "react-bootstrap";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const submitSearch = (e) => {
    const videoPath = `/search/${searchText}`;
    console.log(videoPath);
    navigate(videoPath);
  };

  const goToHome = () => {
    navigate("/home");
    window.location.reload();
  };

  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Container className="header">
        <Navbar.Brand onClick={goToHome} className="btn navbar-brand">
          Eagle
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form
            className="d-flex mx-auto position-relative"
            onSubmit={submitSearch}
          >
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2 search-field"
              aria-label="Search"
              name="search"
              formMethod="post"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              Search
            </Button>
          </Form>
          <div className="header-right d-flex align-items-center">
            <MobileMenu />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
