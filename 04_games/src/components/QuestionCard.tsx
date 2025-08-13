"use client"

import { Button } from "@/components/ui/button"

type Props = {
  question: string
  options: string[]
  onAnswer: (option: string) => void
}

export default function QuestionCard({ question, options, onAnswer }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">{question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Button key={index} variant="outline" onClick={() => onAnswer(option)}>
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}
