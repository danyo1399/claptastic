import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import ClapSvg from "./ClapSvg";
import { ClapIconContainer } from "./ClapIconContainer";
import { deleteClapperAudio, setClapperAudio } from "../claps/clap.db";

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  display: grid;
  grid-template-columns: max-content auto;
  grid-template-rows: 1fr 1fr;
  grid-gap: 0.8rem;

  .icon-container {
    width: 5rem;
    height: fit-content;
    grid-column: 1;
    grid-row: 1 /3;
    place-self: center;
  }

  .input-container {
    position: relative;
  }

  .file-upload-common {
  }

  .file-upload-input {
    opacity: 0;
    z-index: 2;
    position: fixed;
    user-select: none;
    top: -1000px;
    left: -1000px;
    width: 0px;
    height: 0px;
  }

  .button {
    background-color: #676767;
    font-size: 0.9rem;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    user-select: none;
    outline: none;
  }
`;
export function ClapperCard(props: {}) {
  async function onChange(e) {
    const ele: HTMLInputElement = e.target;
    const file = ele.files[0] as File;
    if (!file || !file.type.includes("audio/")) {
      console.log("not an audio file");
      return;
    }
    console.log(ele.files[0]);
    await setClapperAudio(0, file.name, file);
    ele.value = null;
  }

  async function removeCustomAudio() {
    deleteClapperAudio(0);
  }
  return (
    <Container className="rounded border p-2 ">
      <label className="input-container button" htmlFor="file">
        <input
          id="file"
          type="file"
          className="file-upload-input"
          accept="audio/mp3, audio/wav"
          onChange={onChange}
        ></input>
        Upload Audio
      </label>

      <div className="icon-container">
        <ClapIconContainer>
          <ClapSvg></ClapSvg>
        </ClapIconContainer>
      </div>
      <button className="button" onClick={removeCustomAudio}>
        Restore
      </button>
    </Container>
  );
}
