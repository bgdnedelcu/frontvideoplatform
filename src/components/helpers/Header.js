import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Form, FormControl, Button } from "react-bootstrap";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    const videoPath = `/search/${searchText}`;
    navigate(videoPath);
    navigate(0);
  };

  const goToHome = () => {
    navigate("/home");
    navigate(0);
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
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              variant="outline-success"
              type="submit"
              onClick={submitSearch}
            >
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
