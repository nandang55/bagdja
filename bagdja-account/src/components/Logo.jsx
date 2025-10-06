// Bagdja Account Logo Component
export default function Logo({ className = "w-12 h-12" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bagdjaLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      
      {/* Left side of A (Teal) */}
      <path
        d="M 60 180 L 20 180 L 80 20 L 100 20 L 60 130 Z"
        fill="#14b8a6"
      />
      
      {/* Right side of A (Orange) */}
      <path
        d="M 140 180 L 180 180 L 120 20 L 100 20 L 140 130 Z"
        fill="#f97316"
      />
      
      {/* Keyhole shape (White) */}
      <g transform="translate(100, 90)">
        {/* Circle part */}
        <circle cx="0" cy="0" r="15" fill="white" />
        
        {/* Key shaft */}
        <path
          d="M -8 10 L -8 35 L 8 35 L 8 10 Z"
          fill="white"
        />
      </g>
    </svg>
  )
}

