export default function ProcessSection() {
  return (
    <section
      id="process"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Record Your Speech</h3>
            <p className="text-gray-600">
              Use our app to record your speech during practice sessions or real conversations
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Get AI Analysis</h3>
            <p className="text-gray-600">
              Receive detailed feedback on your speech patterns, pacing, and areas for improvement
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Practice & Improve</h3>
            <p className="text-gray-600">
              Follow personalized exercises and track your progress over time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
