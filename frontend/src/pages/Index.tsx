import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSpotify } from '@/contexts/SpotifyContext';
import FeatureCard from '@/components/FeatureCard';
import SplitText from '@/components/ui/SplitText';
import { getFeatureCardsData } from '@/data/featureCardsData'; 
import { Link } from 'react-router-dom';

const Index = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { connectSpotify, isSpotifyConnected, logout } = useSpotify();
  const featureCards = getFeatureCardsData(isSpotifyConnected, connectSpotify, logout);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <div className="select-none relative min-h-screen bg-almond-white overflow-x-hidden">
                {/* Hero Section */}
          <section className="relative py-20 md:py-28 overflow-visible">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1,
                  type: "spring",
                  stiffness: 100
                }}
              >

                <SplitText
                  text="Chro.mA"
                  className="text-3xl sm:text-4xl md:text-8xl font-semibold font-biorhyme-expanded text-persian-indigo mb-6 text-center break-words"
                  delay={100}
                  duration={2}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  onLetterAnimationComplete={handleAnimationComplete}
                />

                <p className="text-base sm:text-xl md:text-2xl font-biorhyme text-pumpkin-orange/80 max-w-3xl mx-auto leading-relaxed px-2">
                  Discover the emotional landscape of your music with AI-powered mood analysis
                </p>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-10 md:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-biorhyme text-rose-pink mb-6">
                  Get curated recommendations for your mental wellness journey
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {featureCards.map((card, index) => (
                  <FeatureCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    buttonText={card.buttonText}
                    buttonColor={card.buttonColor}
                    buttonTextColor={card.buttonTextColor}
                    linkTo={card.linkTo}
                    connectSpotify={card.connectSpotify}
                    logoutSpotify={card.logoutSpotify}
                  />
                ))}
              </div>
              
            </div>
          </section>

          {/* Disclaimer */}
          <div className="pb-4 text-center text-xs text-persian-indigo/60 px-2">
            <p className="font-biorhyme text-persian-indigo/60">
              Your music data is used only for analysis and is not stored permanently
            </p>
          </div>

           {/* Footer */}
          <footer className="py-2 bg-tile-green border-t border-persian-indigo/20 w-full text-center px-2 overflow-x-hidden">
            <div className="container mx-auto px-6 text-center">
              <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
                <Link to="/about-creator" className="font-fira-code font-semibold text-persian-indigo/80 hover:text-persian-indigo transition-colors uppercase">
                  ABOUT THE CREATOR
                </Link>
                <Link to="/about" className="font-fira-code font-semibold text-persian-indigo/80 hover:text-persian-indigo transition-colors uppercase">
                  ABOUT US
                </Link>
                <Link to="/contact" className="font-fira-code font-semibold text-persian-indigo/80 hover:text-persian-indigo transition-colors uppercase">
                  CONTACT
                </Link>
              </div>
            </div>
          </footer>
      </div>
  );
};

export default Index;
