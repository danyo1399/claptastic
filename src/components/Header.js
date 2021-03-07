import React from "react";
import styled from "styled-components";
import InstallPrompt from "./InstallPrompt";
import SideNav, { ExpandIconButton } from "./SideNav";

const HeaderWrapper = styled.div`
  height: 50px;
  width: 100%;
  background-color: #323030;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 100;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  font-size: 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  .sub-header {
    padding-left: 0.5rem;
    font-size: 0.8rem;
    font-weight: 100;
  }
`;

export default function Header() {
  return (
    <HeaderWrapper className="min-height-hide">
      <div className="flex">
        <ExpandIconButton></ExpandIconButton>
        <span className="pl-4">Claptastic</span>
        <span className="sub-header">by danyo1399</span>
      </div>
      <div className="flex">
        <InstallPrompt></InstallPrompt>
      </div>
    </HeaderWrapper>
  );
}
