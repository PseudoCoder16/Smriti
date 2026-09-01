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
          <div className="hidden md:block w-40"></div>
          <nav className="flex items-center gap-8">
            <a className="text-sm font-medium text-gray-700 hover:text-forest transition-colors tracking-wide" href="#games">Games</a>
            <a className="text-sm font-medium text-gray-700 hover:text-forest transition-colors tracking-wide" href="#why-smriti">Why Smriti</a>
          </nav>
          <div className="flex-shrink-0 text-center mx-4">
            <a className="text-3xl font-serif-custom font-bold tracking-tight text-forest" href="/">
              Smriti
            </a>
          </div>
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
              <span className="text-forest">smr</span><span className="text-gold">iti</span>
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
                { name: 'Familiar Songs', desc: 'Recall melodies from your past and match familiar tunes to strengthen auditory memory.', bgColor: '#C8E6C9', img: 'https://lh3.googleusercontent.com/aida/AEtjO1WORpLxeo0narmz-Xgsz8r5jWtM7azxr-1RiYAfkyEUdGIsKh94ydE1BixdbN8RkvqMm2deMiJLaqfqKAPG0DkrGIXicWRHvCk-Cn48TvMQWO2pilqYMES40zHlQkamNFf0Xx3DDOezSkzNvpYGq14_clV53tPV8TrjQD-vAJ2DayA4O3LHJmpw-igaB0SGfv_fW5gdV0duhpY6HFuiGRYUBevlagvC2wWO95dOewIsBY8SYDyITLFcUck' },
                { name: 'Family Memory', desc: 'Identify family members and loved ones through photos to reinforce facial recognition.', bgColor: '#BBDEFB', img: 'https://lh3.googleusercontent.com/aida/AEtjO1WgceprIvRHAQxQ6jN7SCJeIUyRzzKf2G85Zg1m_05k_klDHI1YCYcjlUplRRyhXma_I2N4K_vS8I8MpMsdnARasFGoiMIQLYx-D_ZbyzmE0IzJwNhzqTTnCGtFEIZPtXRcQT5cMBUXOtetvjJADyTsx6c2JbhcU0fZ4m9ppGZVmULaj9xv2lgSP_JPJZLuZ7uPghZjpiTsk8DpBt7bU0No7NnC_LWDdE0H1BIl0LMKFt6N-zXxTWiUfC0' },
                { name: 'Color Sort', desc: 'Sort objects by color and shape to sharpen visual discrimination and attention.', bgColor: '#FFE0B2', img: 'https://lh3.googleusercontent.com/aida/AEtjO1WTKtNfLjDoYY4JFdkkn5Iz811kHMJgw3KcKlhHZDWo_2qCNzF04sU6zbk82PMDVhaEvULRBDwAOZUoi_2Gsy1K_ufPs9d4Y38AOMGRDn7PpCfeHWjZs0J-Dym4GX7SXlyIbDRHHXX6Uv5FDuPeiM7ur_tOjUP9F4zSf1om6OCSK4rC9rnR9uSebYf13svf_PrZsknxV_rrp44f1SslI9FJbkPXn-sOwV9x9XinhFrwUmI4-11oAfke354' },
                { name: 'Rhythm & Tap', desc: 'Follow rhythmic patterns and tap along to exercise motor timing and coordination.', bgColor: '#F8BBD0', img: 'https://lh3.googleusercontent.com/aida/AEtjO1VtXZpVzXePs_KGuJLm_9NTRtPriBQ_EzZoteaCQnxYxm0-IX8J6arObNw4j2VKRHzPZLlTdXv6BD2U2KD6Wg5ZCKwtJjJf8K1grBwlhtBOibVZx6jUWIu8UluM780lsF_vOWO615py0W3uJvY2R8NeUzkXSIiuLSLc91G9E3dLb5y7Br5g8wcNEpNUSu_8P-ORPbonkjO7w9_DUr4NtpcAZslpUijtN9eQzCMp-KVKY9TjKvzr16kGDX4' },
                { name: 'Pattern Recognition', desc: 'Spot patterns in sequences and shapes to train attention and cognitive focus.', bgColor: '#D1C4E9', img: 'https://lh3.googleusercontent.com/aida/AEtjO1UA2u9MwDfGA37jCJJj2PNr3aU30KbsjVXop5yIdm9LkyrN-0vgo7hi_bNfOnNWlATaHVzfc5F9g4QesQKnhZPZNcRnjwNC7H0qr_DCZju96ee6iEyCDWIL9Zh4Z8UsOTLnnFdWBunSYPBYVLf8aa2FDNZCgJgVqhx2M33THgpXaZPIU9Kx9jB4dkbDHo72V6JoSN3vm3sMIWC8ykhGPI3Gbd1mfXwTxZiCeWnp9OWEoboedi02bhAp6g' }
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
    </div>
  );
}
