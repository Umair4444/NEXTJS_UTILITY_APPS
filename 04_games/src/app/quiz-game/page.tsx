import BackButton from "@/components/BackButton"
import Quiz from "@/components/Quiz"

export default function QuizPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <BackButton/>
      <Quiz />
    </main>
  )
}
