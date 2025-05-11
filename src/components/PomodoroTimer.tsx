import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";


interface PomodoroTimerProps {
  workMinutes?: number;
  breakMinutes?: number;
}
const logSessionToFirebase = (type: "work" | "break", durationSec: number) => {
  const user = getAuth().currentUser;
  if (!user) return;

  const sessionRef = ref(db, `users/${user.uid}/sessions`);
  push(sessionRef, {
    type,
    duration: durationSec,
    timestamp: Date.now()
  });
};

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  workMinutes = 25,
  breakMinutes = 5,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            logSessionToFirebase(isWorkTime ? "work" : "break", isWorkTime ? workMinutes * 60 : breakMinutes * 60);
            setIsWorkTime(!isWorkTime);
            return (isWorkTime ? breakMinutes : workMinutes) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isWorkTime, workMinutes, breakMinutes]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{isWorkTime ? "Work Time" : "Break Time"}</h2>
      <h1 style={{ fontSize: "4rem" }}>{formatTime(secondsLeft)}</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button onClick={() => {
        setIsRunning(false);
        setSecondsLeft(isWorkTime ? workMinutes * 60 : breakMinutes * 60);
      }}>
        Reset
      </button>
    </div>
  );
};

export default PomodoroTimer;
