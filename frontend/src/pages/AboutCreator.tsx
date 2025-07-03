import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaBehance, FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';

const AboutCreator = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const skills = [
    "Full Stack Development", 
    "AI/ML", 
    "Music Technology", 
    "UI/UX Design", 
    "Data Science",
    "Mental Health Tech"
  ];
  
  return (
    <div className="select-none min-h-screen bg-almond-white flex flex-col items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-6xl space-y-8">
        <PageHeader title="About the Creator" />
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-12"
        >
          {/* Bio Section */}
          <section className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              <h2 className="text-3xl font-biorhyme font-semibold text-persian-indigo">Meet the Creator</h2>
              <div className="space-y-4 font-fira-code font-semibold text-persian-indigo/80">
                <p>
                  Hello! I'm the creator of Chro.mA. My journey began with a deep fascination for the intersection of music, technology, and mental wellness. As someone who has always found solace and understanding through music and art, I recognized the potential to harness AI to help others discover the emotional landscape of their musical preferences.
                </p>
                <p>
                  With a background in computer science and a passion for mental health advocacy, I've spent years exploring how technology can support emotional well-being. Chro.mA represents the culmination of this research, designed to provide AI-powered mood analysis that helps users understand their emotional connection to music.
                </p>
                <p>
                  In addition to Chro.mA, I've also built other wellness-focused applications including <a href="https://mindease-eight.vercel.app" target="_blank" rel="noopener noreferrer" className="font-bold text-pumpkin-orange hover:text-rose-pink">MindEase</a>, a mental wellness platform, and <a href="https://mindease-eight.vercel.app" target="_blank" rel="noopener noreferrer" className="font-bold text-pumpkin-orange hover:text-rose-pink">nexaFit</a>, a personalized fitness companion. I believe in creating technology that truly serves human well-being.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new music genres, engrossed in my digital painting sessions singing along to Mitski, and constantly researching the latest developments in AI, therapy, and digital mental health.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-biorhyme font-semibold mb-4 text-persian-indigo">Connect With Me</h3>
                <div className="flex flex-wrap gap-3">
                  <a href="https://github.com/ezahpizza" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2  text-persian-indigo hover:bg-persian-indigo hover:text-almond-white font-fira-code border-black border-r-4 border-b-4 hover:border-none">
                      <FaGithub size={16} /> GitHub
                    </Button>
                  </a>

                  <a href="https://linkedin.com/in/prateekmp/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2  text-persian-indigo hover:bg-persian-indigo hover:text-almond-white font-fira-code border-black border-r-4 border-b-4 hover:border-none">
                      <FaLinkedin size={16} /> LinkedIn
                    </Button>
                  </a>

                  <a href="https://www.behance.net/prateekmohapat" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2  text-persian-indigo hover:bg-persian-indigo hover:text-almond-white font-fira-code border-black border-r-4 border-b-4 hover:border-none">
                      <FaBehance size={16} /> Behance
                    </Button>
                  </a>

                  <a href="mailto:prateekmsoa@gmail.com">
                    <Button variant="outline" size="sm" className="gap-2  text-persian-indigo hover:bg-persian-indigo hover:text-almond-white font-fira-code border-black border-r-4 border-b-4 hover:border-none">
                      <IoMdMail size={16} /> Email
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-persian-indigo to-rose-pink rounded-lg p-6 text-almond-white h-full"
              >
                <div className="aspect-square rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden bg-almond-white/20">
                      <img 
                        src="assets/Prateek-Mohapatra.webp" 
                        alt="Chro.mA hero" 
                        className="w-full h-full object-cover rounded-full"
                      />
                </div>

                <h3 className="text-xl font-biorhyme font-bold text-center mb-2">Founder & Developer</h3>
                <p className="text-almond-white/90 text-center font-fira-code">
                  My mission is to help people understand their emotional relationship with art and use those insights for personal growth and mental wellness.
                </p>
              </motion.div>
            </div>
          </section>
          
          {/* Skills & Expertise */}
          <section>
            <h2 className="text-2xl font-biorhyme font-bold mb-6 text-persian-indigo">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-pumpkin-orange/10 text-pumpkin-orange px-4 py-2 rounded-full text-sm font-fira-code font-medium border border-pumpkin-orange/20"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </section>
        
          
          {/* Vision for the Future */}
          <section className="bg-gradient-to-r from-persian-indigo/10 via-rose-pink/10 to-pumpkin-orange/10 p-8 rounded-xl border border-persian-indigo/20">
            <h2 className="text-2xl font-biorhyme font-bold mb-4 text-persian-indigo">Vision for the Future</h2>
            <p className="mb-6 font-biorhyme text-persian-indigo/80">
              Chro.mA is evolving to become a comprehensive platform for music-based mental wellness. The roadmap includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6 font-biorhyme text-persian-indigo/70">
              <li>Advanced emotional pattern recognition across listening history</li>
              <li>Integration with mental health tracking and journaling features</li>
              <li>Community features for sharing musical wellness journeys</li>
              <li>Collaboration with music therapists and mental health professionals</li>
              <li>Real-time mood-responsive playlist generation</li>
              <li>Integration with meditation and mindfulness practices</li>
            </ul>
            <p className="font-biorhyme text-persian-indigo/80">
              The ultimate vision is to create a platform where music becomes a bridge to better mental health, 
              helping users develop deeper self-awareness and emotional intelligence through their musical preferences.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutCreator;
