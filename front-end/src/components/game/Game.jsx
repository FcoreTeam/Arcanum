import React, { useState, useRef, useEffect } from "react";
import blur from "../../img/blur__one.svg";
import video from "../../videos/intro.mp4";
import styles from "./game.module.scss";
import Controlls from "./controlls/Controlls";

const Game = ({ name }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  let [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      if (videoRef.current.muted) {
        setVolume(0);
      } else {
        setVolume(videoRef.current.volume);
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => {
            console.error("Ошибка при переходе в полноэкранный режим:", err);
          });
      } else {
        document
          .exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => {
            console.error("Ошибка при выходе из полноэкранного режима:", err);
          });
      }
    }
  };

  // Функция для блокировки ориентации экрана
  const lockOrientation = (orientation) => {
    if (window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation
        .lock(orientation)
        .then(() => {
          console.log(`Ориентация заблокирована: ${orientation}`);
        })
        .catch((err) => {
          console.error("Ошибка при блокировке ориентации:", err);
        });
    }
  };

  // Функция для разблокировки ориентации экрана
  const unlockOrientation = () => {
    if (window.screen.orientation && window.screen.orientation.unlock) {
      window.screen.orientation.unlock();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.screen.orientation.type.startsWith("landscape")) {
        if (videoRef.current && !document.fullscreenElement) {
          videoRef.current.requestFullscreen().catch((err) => {
            console.error("Ошибка при переходе в полноэкранный режим:", err);
          });
          // Блокируем ориентацию в landscape
          lockOrientation("landscape");
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        // Блокируем ориентацию в portrait
        lockOrientation("portrait");
      }
    };

    window.screen.orientation.addEventListener(
      "change",
      handleOrientationChange
    );

    return () => {
      window.screen.orientation.removeEventListener(
        "change",
        handleOrientationChange
      );
      unlockOrientation();
    };
  }, []);

  return (
    <div className={styles.game}>
      <img src={blur} alt="" className={styles.blur__image} />
      <img src={blur} alt="" className={styles.blur__image__sec} />
      <p className={styles.game__title}>{name}</p>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.game__video}
          muted={isMuted}
          volume={volume}
          controls={false}
        >
          <source src={video} type="video/mp4" />
        </video>
        <Controlls
          handleVolumeChange={handleVolumeChange}
          volume={volume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          isPlaying={isPlaying}
          toggleFullscreen={toggleFullscreen}
          togglePlayPause={togglePlayPause}
          toggleMute={toggleMute}
        />
        <p className={styles.video__subtitle}>
          Если вы знаете финальный ответ, введите его в формате *******
        </p>
      </div>
    </div>
  );
};

export default Game;
