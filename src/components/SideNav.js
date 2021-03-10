import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import sideNavState from "../state/sideNavState";
import { useImmerRecoilState } from "../state/immerRecoil";
import { useRecoilValue } from "recoil";
import CloseIcon from "./CloseIcon";
import MenuIcon from "./MenuIcon";
import clapsState from "../state/clapsState";
import { ClapperCard } from "./ClapperCard";

const StyledButton = styled.button`
  color: white;
  outline: none !important;
`;
export function ExpandIconButton() {
  const [state, setState] = useImmerRecoilState(sideNavState);

  function onClick() {
    setState((value) => {
      value.expanded = !value.expanded;
    });
  }
  return (
    <StyledButton
      onClick={onClick}
      className="min-height-hide"
      data-testid="side-nav-button"
    >
      {state.expanded ? <CloseIcon></CloseIcon> : <MenuIcon></MenuIcon>}
    </StyledButton>
  );
}

const SideNavContainer = styled.div`
  position: fixed;
  overflow: hidden;
  width: 100vw;
  top: 50px;
  left: 0px;
  background-color: rgb(82 79 79);
  bottom: 0;
  margin-left: -100vw;
  padding: 10px;
  color: white;
  z-index: 20;
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function: ease-out;

  .version-header {
    font-weight: normal;
    font-size: 0.8rem;
    .version {
      padding-left: 0.5rem;
    }
  }
  ${(props) =>
    props.expanded &&
    css`
      margin-left: 0px;
    `}
`;

export default function SideNav() {
  const version = WEBPACK_VERSION;
  const state = useRecoilValue(sideNavState);
  return (
    <SideNavContainer
      className="min-height-hide"
      expanded={state.expanded}
      data-testid="side-nav"
    >
      <div className="version-header">
        Version:
        <span id="version" className="version">
          {version}
        </span>
      </div>

      <div>
        <ClapperCard></ClapperCard>
      </div>
    </SideNavContainer>
  );
}
