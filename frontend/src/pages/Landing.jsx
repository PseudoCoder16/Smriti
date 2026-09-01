import { Link } from 'react-router-dom';
import TiltedCard from './TiltedCard';
import ContinuousWallpaperBackground from '../components/ContinuousWallpaperBackground.jsx';

export default function Landing() {
  return (
    <div className="landing-container antialiased flex flex-col min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');
        
        .landing-container {
          font-family: 'Inter', sans-serif;
          background-color: #f9f8f3;
          color: #1f2937;
        }
        
        .landing-container h1, .landing-container h2, .landing-container h3, .font-serif-custom {
          font-family: 'Playfair Display', serif;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(193, 160, 99, 0.15);
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(27, 48, 34, 0.08);
        }
        
        .text-gold {
          color: #C1A063;
        }
        
        .bg-forest {
          background-color: #1B3022;
        }
        
        .text-forest {
          color: #1B3022;
        }
        
        .section-transition {
          background: linear-gradient(180deg, #f9f8f3 0%, #ffffff 100%);
        }
        
        .section-transition-alt {
          background: linear-gradient(180deg, #ffffff 0%, #f9f8f3 100%);
        }
      `}</style>
      
      <header className="w-full py-5 px-4 md:px-8 bg-transparent sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/50 border-b border-[#C1A063]/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-shrink-0 w-40">
            <a className="text-3xl font-serif-custom font-bold tracking-tight text-forest" href="/">
              Smriti
            </a>
          </div>
          <nav className="flex items-center justify-center gap-8 flex-grow">
            <a className="text-sm font-medium text-gray-700 hover:text-forest transition-colors tracking-wide" href="#games">Games</a>
            <a className="text-sm font-medium text-gray-700 hover:text-forest transition-colors tracking-wide" href="#about">About</a>
          </nav>
          <div className="flex items-center w-40 justify-end">
            <Link className="bg-forest text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#27473b] transition-colors shadow-sm" to="/auth">
              Login / Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative overflow-hidden py-16 md:py-24 px-4 md:px-8 text-center flex flex-col items-center justify-center section-transition">
          <ContinuousWallpaperBackground />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-7xl md:text-9xl font-serif-custom font-bold mb-2 tracking-tight leading-none">
              <span className="text-black">smri</span><span className="text-gold">ti</span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-500 font-light tracking-widest mt-4 uppercase text-sm md:text-base">
              memory, made gentle
            </p>
          </div>
        </section>


        <section className="py-12 md:py-20 px-4 md:px-8 bg-white" id="games">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs font-bold text-gold tracking-[0.2em] uppercase mb-3">Inside the Platform</p>
            <h2 className="text-4xl md:text-5xl font-serif-custom font-bold text-forest mb-4 leading-tight">Five cognitive games,<br/>one gentle routine</h2>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-base font-light">
              Each game targets a different cognitive domain — memory, attention, sequencing, discrimination and motor timing.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
              {[
                { name: 'Music & Memory', desc: 'Recall melodies from your past and match familiar tunes to strengthen auditory memory.', bgColor: '#C8E6C9', img: '/images/games/music-memory.jpg' },
                { name: 'Remember My Story', desc: 'Identify family members and loved ones through photos to reinforce facial recognition.', bgColor: '#BBDEFB', img: '/images/games/remember-story.jpg' },
                { name: 'Color Sort', desc: 'Sort objects by color and shape to sharpen visual discrimination and attention.', bgColor: '#FFE0B2', img: '/images/games/color-sort.jpg' },
                { name: 'Rhythm & Tap', desc: 'Follow rhythmic patterns and tap along to exercise motor timing and coordination.', bgColor: '#F8BBD0', img: '/images/games/rhythm-tap.jpg' },
                { name: 'Pattern Recognition', desc: 'Spot patterns in sequences and shapes to train attention and cognitive focus.', bgColor: '#D1C4E9', img: '/images/games/pattern-recognition.jpg' }
              ].map((game) => (
                <TiltedCard
                  key={game.name}
                  imageSrc={game.img}
                  altText={game.name}
                  title={game.name}
                  description={game.desc}
                  bgColor={game.bgColor}
                  rotateAmplitude={12}
                  scaleOnHover={1.05}
                  hoverReveal={true}
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-forest text-white py-12 md:py-16 px-4 md:px-8 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif-custom font-bold mb-3 leading-tight">Ready to try it with a patient<br className="hidden md:block"/> or as a caregiver?</h2>
            <p className="text-gray-300 font-light text-sm md:text-base">No installation needed — works right in the browser.</p>
          </div>
          <div className="flex-shrink-0 mt-4 md:mt-0">
            <Link to="/auth" className="inline-block bg-[#C1A063] text-white px-8 py-3.5 rounded-full font-medium text-base hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
               Get Started
            </Link>
          </div>
        </div>
      </footer>

      <section className="py-16 md:py-24 px-4 md:px-8 bg-[#f9f8f3]" id="about">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img src="/images/about/about-us.jpg" alt="About Smriti" className="rounded-2xl shadow-xl w-full h-auto object-cover" />
          </div>
          <div className="md:w-1/2">
            <p className="text-xs font-bold text-gold tracking-[0.2em] uppercase mb-3">Our Mission</p>
            <h2 className="text-4xl md:text-5xl font-serif-custom font-bold text-forest mb-6 leading-tight">About Us</h2>
            <p className="text-gray-700 leading-relaxed text-lg font-medium mb-4">
              We believe that every person has a story worth remembering.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our platform is built to make everyday life a little easier and more engaging for older adults who may be experiencing memory and cognitive difficulties. Through simple games, familiar activities, helpful reminders, and personalized experiences, we create moments that encourage people to think, remember, interact, and enjoy.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Caregivers can also stay involved, understand their loved one's progress, and be there when it matters most. We're not here to replace human care—we're here to <em className="font-semibold text-forest">support it with technology, one small moment and one precious memory at a time.</em>
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-forest text-white/80 py-10 px-4 md:px-8 border-t border-[#C1A063]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-serif-custom font-bold text-[#C1A063] mb-2">Smriti</span>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Smriti. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#games" className="hover:text-white transition-colors">Games</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="mailto:support@smriti.app" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
