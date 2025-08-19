import GameCard from "@/components/GameCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800">
      {/* Hero Section */}
      <header className="text-center py-12 px-6 bg-white shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
          Play & Learn With Mini Games
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Test your mind and reflexes with our fun & interactive games!
        </p>
      </header>

      {/* Game Cards Section */}
      <main className="flex-1 px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <GameCard
          href="/number-guessing"
          title="🎯 Number Guessing"
          description="Guess the correct number and test your luck!"
        />
        <GameCard
          href="/snake-game"
          title="🐍 Snake Game"
          description="Classic snake game for fun and speed challenge."
        />
        <GameCard
          href="/quiz-game"
          title="❓ Quiz Game"
          description="Answer questions and boost your knowledge."
        />
      </main>
    </div>
  );
}
