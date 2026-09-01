// Subtle, continuously-scrolling photo wallpaper for the Landing hero.
// Pure CSS transform animation (no JS timers, no React state) — the image
// sequence is duplicated once so that when the first copy scrolls fully out
// of view, the duplicate is already in the exact same position, making the
// loop invisible. Purely decorative background imagery: hidden from screen
// readers via aria-hidden, no alt text needed.
const WALLPAPER_IMAGES = [
  '/wallpaper/wallpaper-1.jpg',
  '/wallpaper/wallpaper-2.jpg',
  '/wallpaper/wallpaper-3.jpg',
  '/wallpaper/wallpaper-4.jpg',
]

export default function ContinuousWallpaperBackground() {
  const track = [...WALLPAPER_IMAGES, ...WALLPAPER_IMAGES]

  return (
    <div className="wallpaper-bg" aria-hidden="true">
      <style>{`
        .wallpaper-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.7) 35%,
            rgba(0, 0, 0, 0.7) 60%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.7) 35%,
            rgba(0, 0, 0, 0.7) 60%,
            rgba(0, 0, 0, 0) 100%
          );
        }

        .wallpaper-track {
          display: flex;
          align-items: center;
          height: 100%;
          gap: 1rem;
          width: max-content;
          will-change: transform;
          animation: wallpaper-scroll 48s linear infinite;
        }

        .wallpaper-track img {
          width: 320px;
          height: 220px;
          object-fit: cover;
          border-radius: 1rem;
          flex-shrink: 0;
          filter: grayscale(80%) contrast(85%) brightness(105%);
          opacity: 0.28;
        }

        @media (max-width: 640px) {
          .wallpaper-track img {
            width: 170px;
            height: 130px;
          }
        }

        @keyframes wallpaper-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wallpaper-track {
            animation: none;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>

      <div className="wallpaper-track">
        {track.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" draggable="false" />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(249,248,243,0.45) 0%, rgba(249,248,243,0.55) 55%, #f9f8f3 100%)',
        }}
      />
    </div>
  )
}
