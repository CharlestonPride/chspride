import { NavigationQueryResult } from "@/sanity/lib/sanity.types";
import { navigationQuery } from "@/sanity/queries";
import Link from "next/link";
import React from "react";
import {
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavLink,
} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkButton } from "./button";
import { sanityFetch } from "@/sanity/lib/live";

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
        src="https://cdn.sanity.io/images/jgra26o6/production/c2e72b38614921be7af4ec9ad998470791fa28bd-1955x677.jpg?h=140"
        alt="Charleston Pride"
      ></img>
    </Link>
  );
};

function getExternalNavItem(props: {
  label: string | null;
  url: string | null;
}) {
  return (
    <NavLink target="_blank" href={props.url ?? ""} key={props.label}>
      {props.label}
    </NavLink>
  );
}
function getNavItem(props: { label: string | null; slug: string | null }) {
  return (
    <NavLink href={props.slug ?? ""} key={props.label}>
      {props.label}
    </NavLink>
  );
}

export default async function MainNavBar() {
  const { data } = await sanityFetch({
    query: navigationQuery,
    tag: "main-nav",
  });
  const nav = data as NavigationQueryResult;
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
            {nav!.main?.map((menu: any) => {
              if (menu._type == "dropdownItem" && menu.list) {
                return (
                  <NavDropdown title={menu.label} key={menu.label}>
                    {menu.list?.map((item: any) => {
                      if (item._type == "externalUrl") {
                        return getExternalNavItem(item);
                      }
                      return getNavItem(item);
                    })}
                  </NavDropdown>
                );
              } else {
                return <></>;
              }
            })}
          </Nav>
          {nav!.callToAction?.length && (
            <LinkButton
              reference={nav?.callToAction[0]}
              label={nav!.callToAction[0].title!}
              url={""}
              theme={nav!.theme!}
              style="solid"
            ></LinkButton>
          )}
          {nav!.callToAction?.length == 2 && (
            <LinkButton
              reference={nav?.callToAction[1]}
              label={nav!.callToAction[1].title!}
              url={""}
              theme={nav!.theme!}
              style="outline"
            ></LinkButton>
          )}
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
}
