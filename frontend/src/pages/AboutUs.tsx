import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Music, Brain, Heart, Users, Sparkles, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const AboutUs = () => {

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your music preferences to understand your emotional patterns and mental state."
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Spotify Integration",
      description: "Seamlessly connect with your Spotify account to analyze your playlists and listening history for deeper insights."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Mental Wellness Focus",
      description: "Every feature is designed with mental health in mind, providing recommendations that support your emotional well-being."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Personalized Recommendations",
      description: "Receive curated music suggestions based on your current mood and desired emotional state."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Privacy First",
      description: "Your musical data is used only for analysis and is not stored permanently. We respect your privacy."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Science-Backed",
      description: "Our approach is leverages music psychology research and evidence-based mental health practices."
    }
  ];

  return (
    <div className="select-none min-h-screen bg-almond-white flex flex-col items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-6xl space-y-8">
        <PageHeader title="About Chro.mA" />
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-12"
        >
          {/* Mission Statement */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl font-biorhyme font-bold text-persian-indigo">Our Mission</h2>
            <p className="text-lg font-fira-code text-persian-indigo/80 max-w-4xl mx-auto leading-relaxed">
              We believe that music is a powerful lens into our emotional world. Chro.mA harnesses the power of artificial intelligence 
              to help you understand your emotional relationship with music, providing insights that can support your mental wellness journey 
              and help you discover new aspects of yourself through the songs you love.
            </p>
          </section>

          {/* What Makes Us Different */}
          <section className="bg-gradient-to-r from-persian-indigo/5 via-rose-pink/5 to-pumpkin-orange/5 p-8 rounded-xl border border-persian-indigo/10">
            <h2 className="text-2xl font-biorhyme font-bold mb-6 text-persian-indigo text-center">What Makes Chro.mA Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-biorhyme font-semibold text-pumpkin-orange">Beyond Simple Recommendations</h3>
                <p className="font-fira-code text-persian-indigo/70">
                  While other platforms suggest music based on genre or popularity, Chro.mA analyzes the emotional undertones 
                  of your musical preferences to provide insights into your mental and emotional state.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-biorhyme font-semibold text-rose-pink">Wellness-Centered Approach</h3>
                <p className="font-fira-code text-persian-indigo/70">
                  Every feature is designed with mental health in mind. We don't just analyze your music—we help you use 
                  those insights for personal growth and emotional well-being.
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section>
            <h2 className="text-2xl font-biorhyme font-bold mb-8 text-persian-indigo text-center">How Chro.mA Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="h-full border-persian-indigo/20 hover:border-pumpkin-orange/50 transition-colors duration-300">
                    <CardHeader className="pb-4">
                      <div className="text-pumpkin-orange mb-2">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg font-biorhyme text-persian-indigo">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-fira-code text-persian-indigo/70 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* The Science Behind It */}
          <section>
            <h2 className="text-2xl font-biorhyme font-bold mb-6 text-persian-indigo">The Science Behind Chro.mA</h2>
            <Card className="bg-persian-indigo">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-biorhyme font-semibold text-pumpkin-orange mb-3">Music Psychology Research</h3>
                    <p className="font-fira-code text-almond-white">
                      Our approach is grounded in decades of research showing that musical preferences reflect personality traits, 
                      emotional states, and cognitive patterns. Studies have demonstrated strong correlations between music choices 
                      and psychological well-being indicators.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-biorhyme font-semibold text-rose-pink mb-3">AI & Machine Learning</h3>
                    <p className="font-fira-code text-almond-white">
                      We utilize advanced natural language processing and sentiment analysis to understand the emotional content 
                      of lyrics, combined with audio feature analysis to capture the mood and energy of musical compositions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-biorhyme font-semibold text-tile-green mb-3">Mental Health Integration</h3>
                    <p className="font-fira-code text-almond-white">
                      Our recommendations are informed by evidence-based mental health practices, including music therapy techniques 
                      and mood regulation strategies used by mental health professionals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-persian-indigo to-rose-pink p-8 rounded-xl text-almond-white">
            <h2 className="text-2xl font-biorhyme font-bold mb-4">Ready to Hum to Your Brain's Moods?</h2>
            <p className="font-biorhyme mb-6 opacity-90">
              Join thousands of users who are discovering new insights about themselves through their music. 
              Start your journey of musical self-discovery today.
            </p>
            <motion.div>
              <Button
                onClick={() => navigate("/song")}
                className="bg-tile-green text-persian-indigo hover:bg-rose-pink font-fira-code border-black border-r-4 border-b-4 hover:border-none"
              >
                    Start Your Analysis
               </Button>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
