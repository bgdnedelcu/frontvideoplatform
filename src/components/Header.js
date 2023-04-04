import React from "react";
import { Navbar, Container, Form, FormControl, Button } from "react-bootstrap";
import MobileMenu from "./MobileMenu";
import JwtService from "../service/jwtservice";

const Header = () => {
  

  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Container className="header">
        <Navbar.Brand href="#">Eagle</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto">
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2 search-field"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
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
