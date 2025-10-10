import { Link } from "react-router";
import { Brain, BarChart3, Pill, Shield, Heart, Zap } from "lucide-react";
export default function Home() {
  const features = [{
    icon: Brain,
    title: "Smart Tracking",
    description: "Quick 4-point scales for mood, anxiety, energy, and sleep quality. Log multiple entries daily with retroactive support.",
    color: "from-blue-500 to-indigo-600"
  }, {
    icon: BarChart3,
    title: "Clinical Analytics",
    description: "Visual charts and pattern recognition to identify triggers and predict episodes with actionable insights.",
    color: "from-purple-500 to-pink-600"
  }, {
    icon: Pill,
    title: "Medication Tracking",
    description: "Track medication effectiveness, dosage changes, and correlate with mood patterns for better treatment outcomes.",
    color: "from-green-500 to-emerald-600"
  }, {
    icon: Shield,
    title: "Privacy First",
    description: "Local data storage, no ad tracking, encrypted backup optional, and full offline functionality for your peace of mind.",
    color: "from-orange-500 to-red-600"
  }, {
    icon: Heart,
    title: "Judgment-Free Design",
    description: "Accessibility features, customizable reminders, and a supportive interface designed with mental health in mind.",
    color: "from-teal-500 to-cyan-600"
  }, {
    icon: Zap,
    title: "Clinical Tools",
    description: "CBT thought records, crisis alerts, and HIPAA-compliant provider reports in PDF and CSV formats.",
    color: "from-indigo-500 to-purple-600"
  }];
  return <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Mindwell Mood Tracker</h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Privacy-first mood tracking with clinical-grade analytics and consumer UX
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/track" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            Start Tracking
          </Link>
          <Link to="/analytics" className="px-8 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-200">
            View Analytics
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => <div key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group">
            <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </div>)}
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-indigo-200/50 dark:border-indigo-700/50">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Your Privacy, Your Control
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Mindwell stores all your data locally on your device. No third-party tracking, no ads, no data mining. 
              Optional encrypted cloud backup is available when you're ready. Your mental health journey is personal - 
              we keep it that way.
            </p>
          </div>
        </div>
      </div>
    </div>;
}