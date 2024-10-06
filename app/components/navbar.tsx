import { client } from "@/sanity/lib/client";
import { NavigationQueryResult } from "@/sanity/lib/sanity.types";
import { homeQuery, navigationQuery } from "@/sanity/queries";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import React from "react";
import {
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavItem,
  NavLink,
} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

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
      <NavLink href="/serve-on-the-board">Serve on the Board</NavLink>
    </NavDropdown>
  );
};

function getNavItem(props: { label: string | null; url: string | null }) {
  return (
    <NavLink target="_blank" href={props.url ?? ""} key={props.label}>
      {props.label}
    </NavLink>
  );
}

export default async function MainNavBar() {
  const nav = (await client.fetch(navigationQuery))[0];
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
            {nav?.main?.map((menu: any) => {
              if (menu._type == "dropdownItem") {
                return (
                  <NavDropdown title={menu.label} key={menu.label}>
                    {menu.list?.map((item: any) => {
                      if (item._type == "singleItem") {
                        return getNavItem(item);
                      }
                      return getNavItem({
                        url: (item as any).slug,
                        label: (item as any).title,
                      });
                    })}
                  </NavDropdown>
                );
              } else {
                return <></>;
              }
            })}
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
}
