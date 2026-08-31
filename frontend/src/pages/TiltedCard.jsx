import React, { useRef, useState } from 'react';

export default function TiltedCard({
  imageSrc,
  altText = '',
  title = '',
  description = '',
  bgColor = '#c8b6ff',
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
}) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -rotateAmplitude;
    const rotateY = ((x - centerX) / centerX) * rotateAmplitude;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="relative cursor-pointer"
      style={{
        width: '220px',
        perspective: '800px',
      }}
    >
      <div
        className="relative transition-transform duration-150 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scaleOnHover})`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Card body */}
        <div
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Top colored section with image */}
          <div
            className="relative flex items-center justify-center pt-6 pb-10"
            style={{ background: bgColor }}
          >
            <img
              src={imageSrc}
              alt={altText}
              className="w-28 h-28 object-contain drop-shadow-xl relative z-10"
              style={{ transform: 'translateZ(30px)' }}
            />
          </div>

          {/* Bottom white section */}
          <div className="bg-white px-5 pt-5 pb-5 relative">
            <h3
              className="font-bold text-gray-900 text-base mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              {description}
            </p>

            {/* Arrow button */}
            <div className="flex justify-end">
              <div className="w-8 h-8 rounded-full bg-[#1B3022] flex items-center justify-center text-white shadow-md hover:bg-[#27473b] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
