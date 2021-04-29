import { useContext } from "react";
import { PlayerContext, PlayerContextProps } from "../contents/PlayerContext";

export function usePlayer() {
  const context = useContext<PlayerContextProps>(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used within a PlayerContext");
  }

  return { ...context };
}
