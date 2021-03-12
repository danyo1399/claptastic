import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;

  animation-name: loadButton;
  animation-duration: 500ms;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier();
  @media (max-height: 480px) {
    max-width: 300px;
  }

  @media (max-height: 360px) {
    max-width: 200px;
  }

  .svg-wrapper {
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .button-wrapper {
    position: relative;
    padding-bottom: 100%;
    height: 0;
    width: 100%;
  }

  .button-icon {
    outline: none !important;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 999px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at bottom center, #ffc837 15px, #ff8008);
    box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  }
`;

export function ClapIconContainer({ onClick, children }: any) {
  const type = onClick ? "button" : "div";
  return (
    <Wrapper>
      <div className="button-wrapper">
        <ButtonOrDiv type={type} className="button-icon" onClick={onClick}>
          <div className="svg-wrapper">{children}</div>
        </ButtonOrDiv>
      </div>
    </Wrapper>
  );
}

function ButtonOrDiv({ children, type, ...props }: any) {
  if (type === "button") {
    return <button {...props}>{children}</button>;
  } else {
    return <div {...props}>{children}</div>;
  }
}
