"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

const NumberGuessing = (): React.JSX.Element => {
  // State to track if the game has started
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // State to track if the user has won (game over)
  const [gameOver, setGameOver] = useState<boolean>(false);

  // State to track if the game is being reset
  const [reset, setReset] = useState<boolean>(false);

  // Randomly generated number between 1 and 10 that user has to guess
  const [targetNumber, setTargetNumber] = useState<number>();

  // User's current input guess (can be empty string or number)
  const [userGuess, setUserGuess] = useState<number | string>("");

  // Number of attempts user has made
  const [attempts, setAttempts] = useState<number>(0);

  // Generate a random number between 1 and 10 when game starts or resets
  useEffect(() => {
    if (gameStarted) {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      setTargetNumber(randomNumber); // Set the target number
    }
  }, [gameStarted, reset]);

  // Start the game: set all relevant states to default
  const handleStartGame = (): void => {
    setGameStarted(true);
    setGameOver(false);
    setAttempts(0);
    setReset(false);
    setUserGuess(""); // clear input
  };

  // Reset the game without exiting
  const handleReset = (): void => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    setTargetNumber(randomNumber); // New number
    setAttempts(0); // Reset attempts
    setUserGuess(""); // Clear input
  };

  // Check if the user's guess is correct
  const handleGuess = (): void => {
    const guess = Number(userGuess); // Convert input to number
    if (guess === targetNumber) {
      setGameOver(true); // End game on correct guess
    } else {
      setAttempts((prev) => prev + 1); // Increment attempts
    }
  };

  // Restart everything from beginning
  const handleTryAgain = (): void => {
    setGameStarted(false);
    setGameOver(false);
    setUserGuess("");
    setAttempts(0);
  };

  // Handle user input in the number input field
  const handleUserGuessChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUserGuess(value); // Store user input (string or number)
  };

  // Determine if the guess button should be disabled
  const isGuessDisabled =
    userGuess === "" || // Empty input
    isNaN(Number(userGuess)) || // Not a number
    Number(userGuess) <= 0 || // 0 or negative numbers not allowed
    Number(userGuess) > 10; // Optional: limit to 10 max

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-black">
      {/* Main game container */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Game title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-black">
          Number Guessing Game
        </h1>

        {/* Game instructions */}
        <p className="text-center text-black mb-4">
          Try to guess the number between 1 and 10!
        </p>

        {/* Show Start Game button before game begins */}
        {!gameStarted && (
          <div className="flex justify-center mb-4">
            <button
              onClick={handleStartGame}
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Show main game controls if game has started and not over */}
        {gameStarted && !gameOver && (
          <div>
            {/* Reset game button */}
            <div className="flex justify-center mb-4">
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Reset
              </button>
            </div>

            {/* Input + Guess Button */}
            <div className="flex justify-center mb-4">
              <input
                type="number"
                value={userGuess}
                min={1} // 👈 Prevents typing below 1
                max={10}
                onChange={handleUserGuessChange}
                className="bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs"
                placeholder="Enter your guess"
              />
              <button
                onClick={handleGuess}
                disabled={isGuessDisabled}
                className={`ml-4 py-2 px-4 rounded font-bold text-white ${
                  isGuessDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-800"
                }`}
              >
                Guess
              </button>
            </div>

            {/* Show attempt count and target number for testing */}
            <div className="text-center text-black">
              <p>Total Attempts: {attempts}</p>
            </div>
          </div>
        )}

        {/* Show result if user guessed correctly */}
        {gameOver && (
          <div>
            <div className="text-center mb-4 text-black">
              <h2 className="text-2xl font-bold">Game Over!</h2>
              <p>You guessed the number in {attempts} attempts.</p>
            </div>
            {/* Try again button */}
            <div className="flex justify-center">
              <button
                onClick={handleTryAgain}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberGuessing;
