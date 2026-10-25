import { useRef, useCallback } from "react";

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3");
        audioRef.current.volume = 0.7;
      }
      
      audioRef.current.play()
        .catch((err) => {
          console.error("🔇 Erreur son:", err.message);
        });
    } catch (e) {
      console.error("❌ Erreur audio:", e);
    }
  }, []);

  return { play };
}