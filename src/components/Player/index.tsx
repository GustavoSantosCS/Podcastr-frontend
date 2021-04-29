import styles from "./styles.module.scss";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { usePlayer } from "../../hooks/usePlayer";
import { useEffect, useRef, useState } from "react";
import { convertDurationToTimeString } from "../../utils";

export function Player() {
  const {
    isPlaying,
    episode,
    togglePlaying,
    nextEpisode,
    previousEpisode,
    isJustUneEpisode,
    hasNext,
    hasPrevious,
    toggleLooping,
    toggleShuffling,
    isShuffle,
    isLoop,
    clearPlayerState,
  } = usePlayer();

  const [currentProgress, setCurrentProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentProgress(audioRef.current.currentTime);
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setCurrentProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      nextEpisode();
    } else {
      clearPlayerState();
      setCurrentProgress(0);
    }
  }

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioRef]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {!episode ? (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) : (
        <div className={styles.thumbnail}>
          <Image
            width={375}
            height={435}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <h3>{episode.title}</h3>
          <strong>{episode.members}</strong>
        </div>
      )}

      <footer className={styles.empty}>
        <div className={styles.progress}>
          <span>
            {convertDurationToTimeString(Math.floor(currentProgress))}
          </span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderBlockColor: "#04d361", borderWidth: 4 }}
                onChange={handleSeek}
                max={episode.duration}
                value={currentProgress}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{episode?.durationAsString || "00:00:00"}</span>
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!isJustUneEpisode}
            className={isShuffle ? styles.isActive : ""}
            onClick={toggleShuffling}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={!hasPrevious}
            onClick={previousEpisode}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={() => episode && togglePlaying()}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button type="button" disabled={!hasNext} onClick={nextEpisode}>
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>

          <button
            type="button"
            disabled={!episode}
            className={isLoop ? styles.isActive : ""}
            onClick={toggleLooping}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
      {episode && (
        <audio
          onLoadedMetadata={setupProgressListener}
          onEnded={handleEpisodeEnded}
          src={episode.url}
          loop={isLoop}
          ref={audioRef}
          autoPlay
        />
      )}
    </div>
  );
}
