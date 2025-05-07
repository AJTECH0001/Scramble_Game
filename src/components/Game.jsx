import React, { useState, useEffect, useRef } from "react";
import { words } from "./WordList";

const Game = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [availableWords, setAvailableWords] = useState(words);
  const timerRef = useRef(null);

  // Select and scramble a random word
  const selectWord = () => {
    if (!availableWords.length) {
      setMessage("No words available!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    setCurrentWord(selectedWord);
    setScrambledWord(
      selectedWord.word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
    );
    setGuess("");
    setMessage("");
    resetTimer();
  };

  // Start new round
  const startNewRound = () => {
    selectWord();
  };

  // Handle guess submission
  const handleGuess = () => {
    if (!guess || guess.trim() === "") {
      setMessage("Please enter a valid word");
      return;
    }
    if (!currentWord) return;

    if (guess.toLowerCase() === currentWord.word.toLowerCase()) {
      setScore(score + 10);
      setCorrectGuesses(correctGuesses + 1);
      setMessage("Correct!");
      updateDifficulty();
      startNewRound();
    } else {
      setMessage("Incorrect guess. Try again!");
    }
  };

  // Update difficulty every 5 correct guesses
  const updateDifficulty = () => {
    if ((correctGuesses + 1) % 5 === 0) {
      const newDifficulty = difficulty + 1;
      setDifficulty(newDifficulty);
      setAvailableWords(
        words.filter((word) => word.word.length >= newDifficulty * 3)
      );
    }
  };

  // Handle hint
  const showHint = () => {
    setMessage(currentWord ? currentWord.hint : "No hint available");
  };

  // Timer logic
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setMessage("Time's up!");
          startNewRound();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    setTimeLeft(30);
    startTimer();
  };

  // Initialize game
  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [availableWords]);

  return (
    <div className="game-container">
      <h1>Word Scramble Game</h1>
      <p>Score: {score}</p>
      <p>Time: {timeLeft}</p>
      <h2>Scrambled Word: {scrambledWord}</h2>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess"
      />
      <button onClick={handleGuess}>Submit Guess</button>
      <button onClick={showHint}>Get Hint</button>
      <p>{message}</p>
    </div>
  );
};

export default Game;