import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import blur from "../../img/blur__one.svg";
import correct from "../../img/Correct.svg";
import styles from "./game.module.scss";
import Controlls from "./controlls/Controlls";
import Input from "../@ui/Input/Input";
import { api } from "../../api/api";

const Game = ({ name, video }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gameId = searchParams.get('id');
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  let [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await api.getGames();
        const game = response.data.games.find(g => g.id === parseInt(gameId));
        if (game) {
          setGameData(game);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных игры:', error);
      }
    };

    if (gameId) {
      fetchGameData();
    }
  }, [gameId]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const checkAnswer = () => {
    if (!gameData?.answer) {
      alert("Ошибка: ответ не определен");
      return;
    }

    const isAnswerCorrect = userAnswer.toLowerCase().trim() === gameData.answer.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setIsTimerRunning(false);
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    
    if (!isAnswerCorrect) {
      alert("Неправильный ответ, попробуйте еще раз!");
    }
  };

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

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        if (!hasStartedRef.current) {
          setIsTimerRunning(true);
          hasStartedRef.current = true;
        }
        setIsPlaying(true);
        await videoRef.current.play();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      setIsPlaying(false);
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
          lockOrientation("landscape");
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
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
      {isCorrect && (
        <>
          <div className={`${styles.game__blur} ${styles.active}`} />
          <div className={`${styles.game__correct} ${styles.active}`}>
            <img src={correct} alt="Правильный ответ" />
            <p className={styles.correct_answer}>Верно!</p>
          </div>
        </>
      )}
      <div className={`${styles.game__header} ${isCorrect ? styles.hidden : ''}`}>
        <h3 className={styles.game__title}>{gameData?.name || name}</h3>
        <div className={styles.timer}>
          <p>{formatTime(time)}</p>
        </div>
      </div>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.game__video}
          muted={isMuted}
          volume={volume}
          controls={false}
        >
          <source src={gameData?.video_after_url || video} type="video/mp4" />
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
          Если вы знаете финальный ответ, введите его.
        </p>
      </div>
      <div className={`${styles.game__controlls} ${isCorrect ? styles.hidden : ''}`}>
        <Input 
          secondClass="answer__input" 
          placeholder="Введите ответ"
          value={userAnswer}
          onChange={handleAnswerChange}
        />
        <button 
          className={styles.answer__button}
          onClick={checkAnswer}
        >
          Ответить
        </button>
      </div>
      {isCorrect && (
        <div className={`${styles.back__container} ${styles.active}`}>
          <button 
            className={styles.back_button}
            onClick={() => navigate('/main')}
          >
            Вернуться
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;

