import { createContext, useState } from "react";
import { Episode } from "../models/Episode";

type Props = {
  children: React.ReactNode;
};

export type PlayerContextProps = {
  listEpisode: Episode[];
  currentEpisode: number;
  episode: Episode;
  isPlaying: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  isJustUneEpisode: boolean;
  isShuffle: boolean;
  isLoop: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  nextEpisode: () => void;
  previousEpisode: () => void;
  togglePlaying: () => void;
  toggleLooping: () => void;
  toggleShuffling: () => void;
  clearPlayerState: () => void;
};

export const PlayerContext = createContext<PlayerContextProps>(
  {} as PlayerContextProps
);

export function PlayerContextProvider({ children }: Props) {
  const [listEpisode, setListEpisode] = useState<Episode[]>(null);
  const [episode, setEpisode] = useState<Episode>(null);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const isJustUneEpisode = listEpisode?.length > 1;
  const hasNext = currentEpisode + 1 < listEpisode?.length || isShuffle;
  const hasPrevious = currentEpisode > 0 || isShuffle;

  function play(episode: Episode) {
    setListEpisode([episode]);
    setEpisode(episode);
    setCurrentEpisode(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setListEpisode(list);
    setEpisode(list[index]);
    setCurrentEpisode(index);
    setIsPlaying(true);
  }

  function togglePlaying() {
    setIsPlaying(!isPlaying);
  }

  function toggleLooping() {
    setIsLoop(!isLoop);
  }

  function toggleShuffling() {
    setIsShuffle(!isShuffle);
  }

  function nextEpisode() {
    if (!hasNext) {
      return;
    }

    let nextEpisodeIndex = currentEpisode;
    while (nextEpisodeIndex === currentEpisode) {
      nextEpisodeIndex = isShuffle
        ? Math.floor(Math.random() * listEpisode.length)
        : currentEpisode + 1;
    }

    const nextEpisode = listEpisode[nextEpisodeIndex];
    setEpisode(nextEpisode);
    setCurrentEpisode(nextEpisodeIndex);
    setIsPlaying(true);
  }

  function previousEpisode() {
    if (!hasPrevious) {
      return;
    }

    let previousEpisodeIndex = currentEpisode;
    while (previousEpisodeIndex === currentEpisode) {
      previousEpisodeIndex = isShuffle
        ? Math.floor(Math.random() * listEpisode.length)
        : currentEpisode - 1;
    }

    const previousEpisode = listEpisode[previousEpisodeIndex];
    setEpisode(previousEpisode);
    setCurrentEpisode(previousEpisodeIndex);
    setIsPlaying(true);
  }

  function clearPlayerState() {
    setEpisode(null);
    setCurrentEpisode(-1);
    setIsPlaying(false);
  }

  return (
    <PlayerContext.Provider
      value={{
        listEpisode,
        currentEpisode,
        episode,
        isPlaying,
        hasNext,
        hasPrevious,
        isJustUneEpisode,
        play,
        playList,
        togglePlaying,
        nextEpisode,
        previousEpisode,
        toggleLooping,
        toggleShuffling,
        isShuffle,
        isLoop,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
