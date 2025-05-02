import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";


import styles from "./demoGame.module.scss"
import clsx from "clsx";


import { useDispatch } from "react-redux";
import { api } from "../../api/api";
import Button from "../@ui/Button/Button";
import { openPopup } from "../../store/slices/popupSlice";

const DemoGame = () => {
  const { demoGameId } = useParams();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [game, setGame] = useState(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.getDemoGame(demoGameId);
        setGame(res.data);
      } catch (err) {
        console.error("Ошибка загрузки демо-игры", err);
      }
    };

    fetchGame();
  }, [demoGameId]);

  useEffect(() => {
    if (!game || isAnswered) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleAnswer(null);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [game, stageIndex, isAnswered]);

  const handleAnswer = (optionIndex) => {
    setIsAnswered(true);
    setSelectedOption(optionIndex);
    setTimeout(() => {
      setStageIndex((prev) => prev + 1);
      setTimer(30);
      setIsAnswered(false);
      setSelectedOption(null);
    }, 1000);
  };

  const handleTipClick = () => {
    if (game) {
      dispatch(
        openPopup({
          type: "tip",
          name: game.name,
          description: game.description || "Описание отсутствует",
        })
      );
    }
  };

  if (!game) return <div className={styles.loading}>Загрузка демо-игры...</div>;

  const currentStage = game.stages[stageIndex];
  const isFinished = stageIndex >= game.stages.length;

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.header}>
        <h2 className={styles.name}>{game.name}</h2>
        <div className={styles.controls}>
          <Button onClick={setIsFullscreen} buttonContent="⛶" />
          <Button onClick={handleTipClick} buttonContent="Описание" />
        </div>
      </div>

      {isFinished ? (
        <div className={styles.finished}>Игра завершена!</div>
      ) : (
        <div className={styles.stage}>
          <div className={styles.question}>{currentStage.question}</div>
          <div className={styles.options}>
            {currentStage.options.map((option, index) => (
              <button
                key={index}
                className={clsx(styles.option, {
                  [styles.correct]: isAnswered && index === currentStage.correct_option,
                  [styles.incorrect]: isAnswered && selectedOption === index && index !== currentStage.correct_option,
                  [styles.disabled]: isAnswered,
                })}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>
          <div className={styles.timer}>{timer} сек</div>
        </div>
      )}
    </div>
  );
};

export default DemoGame;
