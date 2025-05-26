import React from "react";
import Login from "./components/Login";
import PomodoroTimer from "./components/PomodoroTimer";

function App() {
  return (
    <div className="App">
      <h1>Pomodoro App</h1>
      <Login />
      <PomodoroTimer />
    </div>
  );
}

export default App;
