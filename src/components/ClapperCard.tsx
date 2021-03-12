import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import ClapSvg from "./ClapSvg";
import { ClapIconContainer } from "./ClapIconContainer";

const Container = styled.div`
  width: 5rem;
  .icon {
    height: fit-content;
  }
`;
export function ClapperCard(props: {}) {
  return (
    <Container className="rounded border p-2 ">
      <div className="icon">
        <ClapIconContainer>
          <ClapSvg></ClapSvg>
        </ClapIconContainer>
      </div>
    </Container>
  );
}
