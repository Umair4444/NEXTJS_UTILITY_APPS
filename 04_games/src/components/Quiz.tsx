"use client";

import { useState } from "react";
import { questions } from "@/lib/data";
import { Button } from "@/components/ui/button"; // if using Shadcn UI, or replace with <button>
import clsx from "clsx";

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[current];

  function handleOptionClick(option: string) {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);
    if (option === question.answer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (!showAnswer) return;
    setSelected(null);
    setShowAnswer(false);
    setCurrent((prev) => prev + 1);
  }

  if (current >= questions.length) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-indigo-900 to-black text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl md:text-4xl text-yellow-400 font-bold mb-6">
          Quiz Completed!
        </h1>
        <p className="text-xl">
          Your Score: {score} / {questions.length}
        </p>
        <Button
          onClick={() => {
            setCurrent(0);
            setScore(0);
          }}
          className="mt-6 px-10 py-8 bg-yellow-400 text-black rounded-full text-xl font-bold hover:bg-yellow-300 transition"
        >
          Restart
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-indigo-900 to-black text-white flex flex-col items-center justify-center px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400 drop-shadow">
        Question {current + 1}
      </h2>

      <div className="bg-gray-900 border border-yellow-500 rounded-xl p-6 py-14 w-full max-w-3xl text-center shadow-lg">
        <p className="text-lg md:text-xl font-semibold mb-8">
          {question.question}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => {
            const isCorrect = option === question.answer;
            const isSelected = option === selected;
            return (
              <Button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={showAnswer}
                className={clsx(
                  "py-6 px-4 text-lg rounded-full font-semibold transition border",
                  {
                    "bg-green-500 text-black border-green-700":
                      showAnswer && isCorrect,
                    "bg-red-500 text-white border-red-700":
                      showAnswer && isSelected && !isCorrect,
                    "bg-yellow-400 text-black hover:bg-yellow-300": !showAnswer,
                  }
                )}
              >
                {option}
              </Button>
            );
          })}
        </div>
        {showAnswer && (
          <Button
            onClick={() => {
              if (current === questions.length - 1) {
                setCurrent((prev) => prev + 1); // triggers "Quiz Completed"
              } else {
                handleNext();
              }
            }}
            className="mt-6 px-10 py-8 bg-yellow-400 text-black rounded-full text-lg font-bold hover:bg-yellow-300 transition"
          >
            {current === questions.length - 1 ? "Check Score" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
}
