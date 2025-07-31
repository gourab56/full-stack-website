import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">

      {/* Decorative Glow Circles */}
      <div className="absolute top-[-5rem] left-[-5rem] w-80 h-80 bg-pink-300 opacity-30 rounded-full blur-[120px] z-0"></div>
      <div className="absolute bottom-[-5rem] right-[-5rem] w-96 h-96 bg-pink-400 opacity-20 rounded-full blur-[140px] z-0"></div>

      {/* Sparkling Title Box */}
      <div className="relative z-10 bg-white/70 backdrop-blur-md border border-pink-200 px-8 py-6 rounded-2xl shadow-2xl mb-10 animate-fade-in">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-pink-600 tracking-tight">
          Showcase Your <span className="text-pink-700">Skills</span>
        </h1>
        <div className="absolute inset-0 rounded-2xl border-2 border-pink-300 animate-spark-border pointer-events-none" />
      </div>

      {/* Description */}
      <p className="text-lg sm:text-xl text-gray-700 max-w-2xl font-medium z-10 mb-10 leading-relaxed animate-fade-in delay-100">
        Build your profile, upload your projects, and let your work shine.
        <br />
        <span className="text-pink-500 font-semibold">Start your journey today.</span>
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-6 z-10 animate-fade-in delay-200">
        <Link
          to="/register"
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-300/50 hover:scale-105"
        >
          🚀 Get Started
        </Link>
        <Link
          to="/login"
          className="bg-white border border-pink-400 hover:bg-pink-50 text-pink-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-pink-200 hover:scale-105"
        >
          🔐 Login
        </Link>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          @keyframes spark-border {
            0%, 100% {
              box-shadow: inset 0 0 0 2px rgba(244,114,182, 0.3);
            }
            25% {
              box-shadow: inset 5px 0 10px rgba(244,114,182, 0.4);
            }
            50% {
              box-shadow: inset 10px 10px 20px rgba(244,114,182, 0.6);
            }
            75% {
              box-shadow: inset 0 5px 15px rgba(244,114,182, 0.5);
            }
          }

          .animate-spark-border {
            animation: spark-border 6s ease-in-out infinite;
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 1.2s ease-out forwards;
          }

          .delay-100 {
            animation-delay: 0.2s;
          }

          .delay-200 {
            animation-delay: 0.4s;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
