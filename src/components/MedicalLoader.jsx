const MedicalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">

      {/* Heartbeat Circle */}
      <div className="relative flex items-center justify-center">

        <div className="absolute h-32 w-32 rounded-full border-4 border-teal-200 animate-ping"></div>

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-xl">

          {/* Medical Cross */}
          <svg
            className="h-10 w-10 text-white animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-slate-600 animate-pulse">
        Saving your medical response...
      </p>

      {/* ECG line */}
      <div className="mt-4 w-48 overflow-hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-teal-500 to-transparent animate-[pulse_1.2s_linear_infinite]"></div>
      </div>

    </div>
  );
};

export default MedicalLoader;
