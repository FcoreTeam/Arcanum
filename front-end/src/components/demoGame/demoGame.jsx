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

  console.log(gameData);
  const currentStage = gameData?.stages.find((s) => s.id === currentStageId);
  console.log(currentStage);

  useEffect(() => {
    if (videoRef.current && currentStage?.video_url) {
      videoRef.current.load();
    }
  }, [currentStage?.video_url]);

  const [visibleHintIndex, setVisibleHintIndex] = useState(-1);

  const hints = currentStage?.tips;

  const showNextHint = () => {
    if (visibleHintIndex < hints.length - 1) {
      setVisibleHintIndex((prev) => prev + 1);
    } else {
      setVisibleHintIndex(-1);
    }
  };

  const handleAnswer = () => {
    const trimmed = answer.trim().toLowerCase();
    const correct = trimmed === "правильный ответ";

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
      <img src={blur} alt="" className={styles.blur__image} />
      <img src={blur} alt="" className={styles.blur__image__sec} />

      <p className={styles.game__title}>{gameData?.name}</p>

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
      <p className={styles.game__description}>{gameData?.description}</p>
      {currentStage?.tips.length !== 0 ? (
        <div className={styles.tipContainer}>
          <div
            className={`${styles.hint} ${
              visibleHintIndex >= 0 ? styles.hintVisible : styles.hintHidden
            }`}
          >
            {visibleHintIndex >= 0 && hints[visibleHintIndex]}
          </div>
          <button onClick={showNextHint} className={styles.hintToggle}>
            {visibleHintIndex === -1
              ? "Показать подсказку"
              : visibleHintIndex < hints.length - 1
              ? "Показать следующую подсказку"
              : "Скрыть подсказки"}
          </button>
        </div>
      ) : (
        <p
          style={{
            width: "100%",
            textAlign: "center",
            color: "#fff",
            marginTop: "10px",
          }}
        >
          Подсказок нет
        </p>
      )}

      <div className={styles.tipButton}></div>

      {!currentStage?.end && (
        <div className={styles.game__controlls}>
          <input
            type="text"
            placeholder="Введите ответ"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={styles.answer__input}
          />
          <button className={styles.answer__button} onClick={handleAnswer}>
            Ответить
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoGame;
