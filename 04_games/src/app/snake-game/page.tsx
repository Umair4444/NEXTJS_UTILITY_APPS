"use client";

import BackButton from "@/components/BackButton";
import React, { useState, useEffect, useRef, useCallback } from "react";

const CELL_SIZE = 20;
const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 20;

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 9, y: 9 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(directions.ArrowRight);
  const [gameStatus, setGameStatus] = useState<
    "running" | "paused" | "over" | "idle"
  >("idle");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastKeyRef = useRef("ArrowRight");

  // Generate random food
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
    setFood(newFood);
  };

  // Handle key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const newDir = directions[e.key as keyof typeof directions];
    if (newDir) {
      const lastDir = directions[lastKeyRef.current as keyof typeof directions];
      // Prevent reverse direction
      if (newDir.x !== -lastDir.x && newDir.y !== -lastDir.y) {
        lastKeyRef.current = e.key;
        setDirection(newDir);
      }
    }
  }, []);

  useEffect(() => {
    if (gameStatus === "running") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown, gameStatus]);

  // Game loop
  useEffect(() => {
    if (gameStatus !== "running") return;

    intervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Game over: hit wall
        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= BOARD_WIDTH ||
          newHead.y >= BOARD_HEIGHT
        ) {
          setGameStatus("over");
          return prevSnake;
        }

        // Game over: hit self
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameStatus("over");
          alert("Game Over");
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          generateFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(intervalRef.current!);
  }, [direction, food, gameStatus]);

  const handleStart = () => {
    setSnake([{ x: 9, y: 9 }]);
    setDirection(directions.ArrowRight);
    lastKeyRef.current = "ArrowRight";
    generateFood();
    setGameStatus("running");
  };

  const handlePauseResume = () => {
    if (gameStatus === "running") {
      setGameStatus("paused");
    } else if (gameStatus === "paused") {
      setGameStatus("running");
    }
  };

  const handleReset = () => {
    setSnake([{ x: 9, y: 9 }]);
    setDirection(directions.ArrowRight);
    lastKeyRef.current = "ArrowRight";
    generateFood();
    setGameStatus("idle");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <BackButton/>
      <h1 className="text-white text-3xl font-bold mb-6">
        🐍 Snake Arcade Game
      </h1>

      <div
        className="relative border-4 border-green-500"
        style={{
          width: BOARD_WIDTH * CELL_SIZE,
          height: BOARD_HEIGHT * CELL_SIZE,
          backgroundColor: "#111",
        }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${
              index === 0 ? "bg-lime-400" : "bg-green-600"
            }`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              transition: "all 0.1s linear",
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </div>

      {/* Status */}
      {gameStatus === "over" && (
        <p className="text-red-500 mt-4 text-xl">💀 Game Over</p>
      )}

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleStart}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Start
        </button>

        <button
          onClick={handlePauseResume}
          className={`${
            gameStatus === "running" ? "bg-yellow-500" : "bg-blue-500"
          } hover:brightness-110 text-white px-4 py-2 rounded`}
        >
          {gameStatus === "running" ? "Pause" : "Resume"}
        </button>

        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
