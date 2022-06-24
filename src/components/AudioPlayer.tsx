//AudioPlayer.js

import React, { useState, useRef, useEffect } from "react";

type PlayerProps = {
    audio: string;
}

function Player(props: PlayerProps) {
  const audioElement = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if(audioElement.current)
        audioElement.current.volume = 0.2;
    if (isPlaying) {
        audioElement.current?.play();
    } else {
        audioElement.current?.pause();
    }

  });

  function toggleMusic(){
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <div className="music-player">
        <audio
          src={props.audio}
          ref={audioElement}
        ></audio>
        <a href="#" onClick={toggleMusic}>
        {isPlaying ? <i className="fa-solid fa-pause b-0 w-[50px] h-[50px] absolute top-[25px] right-[25px] text-5xl drop-shadow-[0_0_12px_rgba(255,0,0)]"></i> :
        <i className="fa-solid fa-play b-0 w-[50px] h-[50px] absolute top-[25px] right-[25px] text-5xl drop-shadow-[0_0_12px_rgba(255,0,0)]"></i>}</a>
      </div>
    </>
  );
}
export default Player;