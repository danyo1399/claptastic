import React, { useState, useEffect, useRef } from "react";
import localForage from "localforage";
// @ts-ignore
import audioFileUrl from "../media/audio.mp3";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 80vw;
  max-width: 400px;
  max-height: 80vh;

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

  @keyframes loadButton {
    from {
      transform: rotate(180deg) scale(0.1);
      opacity: 0.1;
    }
    to {
      transform: none;
      opacity: 1;
    }
  } ;
`;

const audio = new Audio();

import logger from "../logger";
import ClapSvg from "./ClapSvg";

import { clapped } from "../claps/clap.events";
const { error } = logger("clapButton");
const clapAudioStorageKeyItem = "mp3";

async function loadMp3() {
  // Noticed some odd behavior in android where if offline for certain amount of time looks like audio is
  // removed from cache?
  // store in indexdb just to be safe
  // If we have previous saved version in db, we may still live
  try {
    const response = await fetch(audioFileUrl);
    if (!response.ok) {
      throw response;
    }

    const blob = await response.blob();
    await localForage.setItem(clapAudioStorageKeyItem, blob);
  } catch (e) {
    error("Failed to load audio", e);
  }

  return localForage.getItem(clapAudioStorageKeyItem);
}

(async () => {
  const blob = await loadMp3();
  audio.src = URL.createObjectURL(blob);
})();

export default function ClapButton() {
  const [playing, setPlaying] = useState(null);
  const intervalRef = useRef();

  const svgRef = useRef(null);

  async function play() {
    return audio.play();
  }

  // TODO: Replace this with a css animation
  function startAnim() {
    if (intervalRef.current != null) {
      return;
    }
    const ele = svgRef.current;
    let toggle = false;
    intervalRef.current = setInterval(() => {
      if (!toggle) {
        ele.style.transform = "scale(1.2)";
        toggle = true;
      } else {
        ele.style.transform = "scale(1)";
        toggle = false;
      }
    }, 100);
  }
  function stopAnim() {
    if (intervalRef.current == null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    svgRef.current.style.transform = undefined;
  }

  useEffect(() => {
    const stop = (_) => {
      stopAnim();
      setPlaying(null);
    };
    const start = async (_) => {
      startAnim();
      setPlaying(true);
      clapped.addEvent({});
    };

    audio.addEventListener("ended", stop);
    audio.addEventListener("play", start);

    return () => {
      audio.removeEventListener("ended", stop);
      audio.removeEventListener("play", start);
    };
  }, []);

  // visibility change
  useEffect(() => {
    var hidden, visibilityChange;
    const anyDoc = document as any;
    if (typeof anyDoc.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof anyDoc.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof anyDoc.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }
    async function handleVisibilityChange() {
      if (document[hidden]) {
        stopAnim();
        audio.load();
      }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);
    return () =>
      document.removeEventListener(visibilityChange, handleVisibilityChange);
  }, []);
  return (
    <Wrapper>
      <div className="button-wrapper">
        <button className="button-icon" onClick={play}>
          <div className="svg-wrapper">
            <ClapSvg clapping={playing} ref={svgRef}></ClapSvg>
          </div>
        </button>
      </div>
    </Wrapper>
  );
}
