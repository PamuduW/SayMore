import { Card } from "@/components/ui/card";
import { Mic, Brain, Target, LineChart } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-blue-500 via-white to-blue-400">
      <div>
        <h2 className="text-3xl font-bold text-center mb-16">
          Powerful features to enhance your speaking
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6">
            <Mic className="w-12 h-12 text-blue-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
            <p className="text-gray-600">Get instant feedback on your speech patterns and delivery</p>
          </Card>
          <Card className="p-6">
            <Brain className="w-12 h-12 text-blue-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">Advanced AI technology analyzes your speaking patterns</p>
          </Card>
          <Card className="p-6">
            <Target className="w-12 h-12 text-blue-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Goals</h3>
            <p className="text-gray-600">Set and track your speaking improvement goals</p>
          </Card>
          <Card className="p-6">
            <LineChart className="w-12 h-12 text-blue-800 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Monitor your improvement over time with detailed analytics</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
