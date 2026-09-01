import React, { useRef, useState } from 'react';

export default function TiltedCard({
  imageSrc,
  altText = '',
  title = '',
  description = '',
  bgColor = '#c8b6ff',
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
  onClick,
  hoverReveal = false,
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
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
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
            className="relative flex items-center justify-center p-4"
            style={{ background: bgColor }}
          >
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-32 object-cover rounded-xl drop-shadow-xl relative z-10"
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
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: hoverReveal ? (isHovered ? '80px' : '0px') : '80px',
                opacity: hoverReveal ? (isHovered ? 1 : 0) : 1,
              }}
            >
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {description}
              </p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
