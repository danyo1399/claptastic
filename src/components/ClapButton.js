import React, { useState, useEffect, useRef } from "react";
import localForage from "localforage";
import audioFileUrl from "../media/audio.mp3";

const audio = new Audio();

import logger from "../logger";
import ClapSvg from "./ClapSvg";
import { useImmerRecoilState } from "../state/immerRecoil";
import clapsState from "../state/clapsState";
import { addClap } from "../db";
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

  const [state, setState] = useImmerRecoilState(clapsState);
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
      const clap = await addClap();
      setState((x) => {
        x.total_rows++;
        x.rows.push(clap);
      });
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
    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
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
    <div className="wrapper">
      <div className="button-wrapper">
        <button className="button-icon" onClick={play}>
          <div className="svg-wrapper">
            <ClapSvg clapping={playing} ref={svgRef}></ClapSvg>
          </div>
        </button>
      </div>
    </div>
  );
}
