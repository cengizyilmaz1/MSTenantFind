import React from 'react';

interface OwlIconProps {
  className?: string;
  fill?: string;
}

const OwlIcon: React.FC<OwlIconProps> = ({ className = "w-6 h-6", fill = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 240 240" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ultra Realistic Owl Design */}
      <g>
        {/* Body Shadow */}
        <ellipse cx="120" cy="220" rx="40" ry="8" fill="#000000" opacity="0.2" />
        
        {/* Main Body */}
        <path d="M 120 200 C 80 200 50 170 50 130 C 50 90 50 60 120 60 C 190 60 190 90 190 130 C 190 170 160 200 120 200 Z" 
              fill={fill} />
        
        {/* Chest Detail */}
        <ellipse cx="120" cy="150" rx="35" ry="45" fill={fill} opacity="0.7" />
        
        {/* Head */}
        <ellipse cx="120" cy="80" rx="55" ry="50" fill={fill} />
        
        {/* Face Disc */}
        <ellipse cx="120" cy="85" rx="45" ry="40" fill={fill} opacity="0.8" />
        
        {/* Ear Tufts */}
        <path d="M 75 45 Q 70 30 80 40 L 85 55 Q 80 60 75 55 Z" fill={fill} />
        <path d="M 165 45 Q 170 30 160 40 L 155 55 Q 160 60 165 55 Z" fill={fill} />
        
        {/* Eye Backgrounds */}
        <ellipse cx="100" cy="80" rx="20" ry="22" fill="white" />
        <ellipse cx="140" cy="80" rx="20" ry="22" fill="white" />
        
        {/* Iris */}
        <circle cx="100" cy="82" r="16" fill="#FFA500" />
        <circle cx="140" cy="82" r="16" fill="#FFA500" />
        
        {/* Pupils */}
        <ellipse cx="100" cy="82" rx="9" ry="11" fill="#000000" />
        <ellipse cx="140" cy="82" rx="9" ry="11" fill="#000000" />
        
        {/* Eye Highlights */}
        <ellipse cx="105" cy="77" rx="4" ry="5" fill="white" />
        <ellipse cx="145" cy="77" rx="4" ry="5" fill="white" />
        <circle cx="97" cy="85" r="2" fill="white" opacity="0.7" />
        <circle cx="137" cy="85" r="2" fill="white" opacity="0.7" />
        
        {/* Beak */}
        <path d="M 120 95 L 112 103 Q 120 110 128 103 Z" fill="#FF8C00" />
        <line x1="120" y1="100" x2="120" y2="107" stroke="#D2691E" strokeWidth="2" />
        
        {/* Wing Details */}
        <path d="M 60 110 C 60 110 50 120 50 140 C 50 160 55 170 60 180" 
              stroke={fill} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M 180 110 C 180 110 190 120 190 140 C 190 160 185 170 180 180" 
              stroke={fill} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6" />
        
        {/* Feather Texture -->}
        <g opacity="0.3">
          <path d="M 95 140 Q 100 145 105 140" stroke={fill} strokeWidth="1.5" fill="none" />
          <path d="M 110 140 Q 115 145 120 140" stroke={fill} strokeWidth="1.5" fill="none" />
          <path d="M 125 140 Q 130 145 135 140" stroke={fill} strokeWidth="1.5" fill="none" />
          <path d="M 100 150 Q 105 155 110 150" stroke={fill} strokeWidth="1.5" fill="none" />
          <path d="M 115 150 Q 120 155 125 150" stroke={fill} strokeWidth="1.5" fill="none" />
          <path d="M 130 150 Q 135 155 140 150" stroke={fill} strokeWidth="1.5" fill="none" />
        </g>
        
        {/* Talons */}
        <g fill="none" stroke="#FF8C00" strokeWidth="3" strokeLinecap="round">
          <path d="M 105 195 L 105 205 M 100 205 L 110 205" />
          <path d="M 135 195 L 135 205 M 130 205 L 140 205" />
        </g>
      </g>
    </svg>
  );
};

export default OwlIcon;