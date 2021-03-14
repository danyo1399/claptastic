import React, { useState, useEffect, useRef } from "react";
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

import getLogger from "../utils/logger";
import ClapSvg from "./ClapSvg";

import { clapped } from "../claps/clap.events";
import { ClapIconContainer } from "./ClapIconContainer";
import { useRecoilValue } from "recoil";
import clapAtom, { clappersSelector } from "../claps/clap.state";
import { defaultAudioUrl } from "../claps/audio";
const { error } = getLogger("clapButton");
const clapAudioStorageKeyItem = "mp3";

export default function ClapButton() {
  const [playing, setPlaying] = useState<boolean>(false);
  const clappers = useRecoilValue(clappersSelector);
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();

  const svgRef = useRef(null);

  async function play() {
    if (!playing) {
      audioRef.current.src = clappers[0].audioUrl || (await defaultAudioUrl);
      await audioRef.current.play();
    } else {
      audioRef.current.load();
      stopAnim();
      setPlaying(false);
    }
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
    const audio = new Audio();
    audioRef.current = audio;
    const onStop = (_) => {
      stopAnim();
      setPlaying(false);
    };
    const onStart = async (_) => {
      startAnim();
      setPlaying(true);
      clapped.raiseEvent({});
    };

    audio.addEventListener("ended", onStop);
    audio.addEventListener("play", onStart);

    return () => {
      audio.removeEventListener("ended", onStop);
      audio.removeEventListener("play", onStart);
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
        audioRef.current.load();
        setPlaying(false);
      }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);
    return () =>
      document.removeEventListener(visibilityChange, handleVisibilityChange);
  }, []);
  return (
    <Wrapper>
      <ClapIconContainer onClick={play}>
        <ClapSvg clapping={playing} ref={svgRef}></ClapSvg>
      </ClapIconContainer>
    </Wrapper>
  );
}
