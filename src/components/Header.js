import React, { useState } from "react";
import { Navbar, Container, Form, FormControl, Button } from "react-bootstrap";
import MobileMenu from "./MobileMenu";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const submitSearch = (e) => {
    const videoPath = "/search/".concat(searchText);
    navigate(videoPath, { state: { searchText } });
  };

  const goToHome = () => {
    navigate("/search");
    window.location.reload();
  };

  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Container className="header">
        <Navbar.Brand onClick={goToHome}>Eagle</Navbar.Brand>
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
