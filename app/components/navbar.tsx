
import Link from "next/link";
import React from "react";
import { NavbarBrand, NavbarCollapse, NavbarToggle, NavLink } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Hamburger = () => {
    return (
        <span className="navbar-toggler-icon mt-2">
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
        </span>
    );
};


const Brand = () => {
    return (
        <Link href="/">
            <img
                height="70"
                src="https://charleston-pride.stream.prepr.io//7hv49f57o9bd-chspride-logo-4c.jpg"
                alt="Charleston Pride"
            ></img>
        </Link>
    );
};

const AboutUs = () => {
    return (
        <NavDropdown title="About Us" id="about-us">
            <NavLink href="/our-team">Our Team</NavLink>
            <NavLink href="/bylaws">Our Bylaws</NavLink>
            <NavLink href="/serve-on-the-board">
                Serve on the Board
            </NavLink>
        </NavDropdown>
    );
};


export default function MainNavBar({ }) {
    return (
        <Navbar bg="light" expand="lg">
            <Container className="py-3">
                <NavbarBrand>
                    <Brand />
                </NavbarBrand>

                <NavbarToggle aria-controls="basic-navbar-nav">
                    <Hamburger />
                </NavbarToggle>
                <NavbarCollapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <AboutUs />
                        {/* <Events /> */}
                        {/* <PrideWeek /> */}
                    </Nav>
                    {/* <LinkButton color="primary" href="/donate">
            Make a Donation
          </LinkButton>
          <LinkOutlineButton color="primary" href="/become-a-sponsor">
            Become a Sponsor
          </LinkOutlineButton> */}
                </NavbarCollapse>
            </Container>
        </Navbar>
    );
}
