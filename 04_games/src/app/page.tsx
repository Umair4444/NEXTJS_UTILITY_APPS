import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800">
      {/* Hero Section */}
      <header className="text-center py-20 px-6 bg-white shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
          Play & Learn With Mini Games
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Test your mind and reflexes with our fun & interactive games!
        </p>
      </header>

      {/* Game Cards Section */}
      <main className="flex-grow px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} Developed by <span className="font-semibold">Umair</span>
      </footer>
    </div>
  );
}

// Game Card Component
function GameCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition duration-300 hover:-translate-y-1">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
