import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SongAnalysis from "./pages/SongAnalysis";
import SpotifyAnalysisPage from "./pages/SpotifyAnalysisPage";
import PlaylistAnalysisPage from "./pages/PlaylistAnalysisPage";
import AfterAuth from "./pages/AfterAuth";
import AboutCreator from "./pages/AboutCreator";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import { SpotifyProvider } from "@/contexts/SpotifyContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SpotifyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/song" element={<SongAnalysis />} />
            <Route path="/spotify" element={<SpotifyAnalysisPage />} />
            <Route path="/playlist" element={<PlaylistAnalysisPage />} />
            <Route path="/after-auth" element={<AfterAuth />} />
            <Route path="/about-creator" element={<AboutCreator />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </BrowserRouter>
      </SpotifyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
