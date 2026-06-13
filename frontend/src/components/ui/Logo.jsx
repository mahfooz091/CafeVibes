const Logo = ({ className = '', showText = true, light = false }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="19" stroke="#D4A373" strokeWidth="1.5" opacity="0.5" />
        <path
          d="M11 17h15v6a7.5 7.5 0 0 1-7.5 7.5h0A7.5 7.5 0 0 1 11 23v-6Z"
          fill="#0F766E"
        />
        <path
          d="M26 18.5h2a3 3 0 0 1 0 6h-2"
          stroke="#0F766E"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M16 12c-1 1.2.5 1.8-.3 3M20 12c-1 1.2.5 1.8-.3 3M24 12c-1 1.2.5 1.8-.3 3"
          stroke="#D4A373"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showText && (
        <span
          className={`font-display text-xl font-semibold tracking-tight ${
            light ? 'text-white' : 'text-teal'
          }`}
        >
          CafeVibes
        </span>
      )}
    </div>
  );
};

export default Logo;
