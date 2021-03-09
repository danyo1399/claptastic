import React from "react";
import styled from "styled-components";
import InstallPrompt from "./InstallPrompt";
import SideNav, { ExpandIconButton } from "./SideNav";
import ClapSvg from "./ClapSvg";
import { useRecoilValue } from "recoil";
import clapsState from "../state/clapsState";

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

  @media (max-width: 372px) {
    .sub-header {
      display: none;
    }
  }

  .right-section {
    display: contents;
  }
  .counter-icon {
    transform: rotate(-45deg);
    margin-bottom: -2px;
  }
`;

export default function Header() {
  const claps = useRecoilValue(clapsState);
  return (
    <HeaderWrapper className="min-height-hide">
      <div className="flex">
        <ExpandIconButton></ExpandIconButton>
        <span className="pl-4">Claptastic</span>
        <span className="sub-header">by danyo1399</span>
      </div>
      <div className="right-section flex">
        <div className="flex items-center pr-1">
          <span className="px-2">{claps?.total_rows || 0}</span>
          <div className="counter-icon">
            <ClapSvg width="1.25rem"></ClapSvg>
          </div>
        </div>

        <InstallPrompt></InstallPrompt>
      </div>
    </HeaderWrapper>
  );
}
