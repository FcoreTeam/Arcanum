import { useEffect, useRef, useState } from "react";
import { api } from "../../api/api";
import { useParams } from "react-router-dom";
import styles from "./demoGame.module.scss";
import blur from "../../img/blur__one.svg";

const DemoGame = () => {
  const [gameData, setGameData] = useState(null);
  const [currentStageId, setCurrentStageId] = useState(null);
  const [answer, setAnswer] = useState("");
  const videoRef = useRef(null);
  const { demoGameId } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.getDemoGame(demoGameId);
        setGameData(res.data);

        const startStage = res.data.stages.find((s) => s.start);
        if (startStage) setCurrentStageId(startStage.id);
      } catch (err) {
        console.error("Ошибка загрузки демо-игры", err);
      }
    };

    fetchGame();
  }, [demoGameId]);

  const currentStage = gameData?.stages.find((s) => s.id === currentStageId);

  useEffect(() => {
    if (videoRef.current && currentStage?.video_url) {
      videoRef.current.load();
    }
  }, [currentStage?.video_url]);

  const handleAnswer = () => {
    const trimmed = answer.trim().toLowerCase();
    const correct = trimmed === "правильный ответ"; // Здесь подставь свою логику проверки

    const nextId = correct
      ? currentStage?.next_correct_answer?.id
      : currentStage?.next_wrong_answer?.id;

    if (nextId) {
      setAnswer("");
      setCurrentStageId(nextId);
    } else {
      alert("Игра завершена или нет следующего этапа.");
    }
  };

  return (
    <div className={styles.demogame}>
      <img src={blur} alt="" className={styles.demoGame__blur} />
      <img src={blur} alt="" className={styles.blur__image__sec} />

      <div className={styles.game__title}>{gameData?.name}</div>

      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.game__video}
          preload="auto"
          playsInline
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#000",
          }}
        >
          <source src={currentStage?.video_url} type="video/mp4" />
        </video>
      </div>

      <div className={styles.tipButton}></div>

      {!currentStage?.end && (
        <div className={styles.answerContainer}>
          <input
            type="text"
            placeholder="Введите ответ"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button className={styles.sumbitButton} onClick={handleAnswer}>
            Ответить
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoGame;
