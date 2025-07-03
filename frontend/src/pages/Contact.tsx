import { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { Mail, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contact = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const WEB3FORMS_API_KEY = import.meta.env.VITE_WEB3FORMS_API_KEY as string;
  if (!WEB3FORMS_API_KEY) {
    console.error('WEB3FORMS_API_KEY is not defined');
    return <div>Error: WEB3FORMS_API_KEY is not defined</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_API_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Chro.mA Contact Form',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        toast({
          title: 'Message Sent!',
          description: 'Thank you for your message. We\'ll get back to you soon.',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="select-none min-h-screen bg-almond-white flex flex-col items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-5xl space-y-8">
        <PageHeader title="Get in Touch" />
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Contact Intro */}
          <section className="text-center space-y-4">
            <p className="text-lg font-biorhyme text-persian-indigo/80 max-w-2xl mx-auto">
              Have questions about Chro.mA? Want to share feedback or suggestions? 
              We'd love to hear from you!
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-persian-indigo">
                <CardHeader>
                  <CardTitle className="font-biorhyme text-rose-pink flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-pumpkin-orange" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8 space-y-4"
                    >
                      <CheckCircle className="h-16 w-16 text-tile-green mx-auto" />
                      <h3 className="text-xl font-biorhyme font-semibold text-tile-green">
                        Message Sent Successfully!
                      </h3>
                      <p className="font-fira-code text-tile-green/70">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-tile-green text-persian-indigo hover:bg-rose-pink font-fira-code border-black border-r-4 border-b-4 hover:border-none"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-fira-code text-rose-pink">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="border-persian-indigo/30 focus:border-pumpkin-orange font-biorhyme"
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-fira-code text-rose-pink">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="border-persian-indigo/30 focus:border-pumpkin-orange font-biorhyme"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="font-fira-code text-rose-pink">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="border-persian-indigo/30 focus:border-pumpkin-orange font-biorhyme"
                          placeholder="What's this about?"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-fira-code text-rose-pink">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="border-persian-indigo/30 focus:border-pumpkin-orange font-biorhyme resize-none"
                          placeholder="Tell us what's on your mind..."
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-pumpkin-orange hover:bg-tile-green text-persian-indigo font-fira-code border-black border-r-4 border-b-4 hover:border-none"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-almond-white/30 border-t-almond-white rounded-full animate-spin" />
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Send Message
                          </div>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              <Card className="bg-persian-indigo/70">
                <CardHeader>
                  <CardTitle className="font-biorhyme text-almond-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-rose-pink" />
                    Other Ways to Reach Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-biorhyme font-semibold text-almond-white mb-2">Direct Email</h3>
                    <p className="font-fira-code text-almond-white/70 text-sm">
                      prateekmsoa@gmail.com
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-biorhyme font-semibold text-almond-white mb-2">Response Time</h3>
                    <p className="font-fira-code text-almond-white/70 text-sm">
                      We typically respond within 24 hours during business days.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-biorhyme font-semibold text-almond-white mb-2">Bug Reports</h3>
                    <p className="font-fira-code text-almond-white/70 text-sm">
                      Found a bug? Please include as much detail as possible about what you were doing when the issue occurred.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-tile-green/50 to-persian-indigo/50 border-persian-indigo/20">
                <CardContent className="p-6">
                  <h3 className="font-biorhyme font-semibold text-persian-indigo mb-4">We Value Your Feedback</h3>
                  <p className="font-fira-code font-semibold text-persian-indigo/70 text-sm leading-relaxed">
                    Chro.mA is constantly evolving, and your input counts a lot. Whether it's a feature request, 
                    bug report, or just your thoughts on how we can improve, we're all ears!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
