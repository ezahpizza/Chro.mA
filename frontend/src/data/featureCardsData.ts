import { Music, Headphones, List, TrendingUp } from 'lucide-react';
import React from 'react'; 

interface FeatureCardDataItem {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  linkTo?: string;
  isSpotifyConnected?: boolean;
  connectSpotify?: () => void;
  logoutSpotify?: () => void;
}

export const getFeatureCardsData = (
  isSpotifyConnected: boolean,
  connectSpotify: () => void,
  logoutSpotify?: () => void
): FeatureCardDataItem[] => [
  {
    icon: Music,
    title: "Tell us what you've been listening to :)",
    description: "Enter your favorite songs and see how they've influenced you",
    buttonText: "Sing a Song",
    buttonColor: "bg-pumpkin-orange",
    buttonTextColor: "persian-indigo",
    linkTo: "/song",
  },
  {
    icon: Headphones,
    title: "Want to be Spotify mutuals? :)",
    description: "Analyze your recent Spotify listening history for mood trends",
    buttonColor: "bg-rose-pink",
    buttonText: "Check Recents",
    buttonTextColor: "almond-white",
    linkTo: "/spotify",
  },
  {
    icon: List,
    title: "Got a playlist we can check out together?",
    description: "Analyze any Spotify playlist or your own curated collections",
    buttonColor: "bg-persian-indigo",
    buttonText: "Drop a Playlist",
    buttonTextColor: "pumpkin-orange",
    linkTo: "/playlist",
  },
  {
    icon: TrendingUp,
    title: isSpotifyConnected ? "Check Out Our Spotify Features!" : "Connect your spotify for more",
    description: isSpotifyConnected
      ? "Spotify connected successfully!"
      : "Link your Spotify account to unlock all features",
    buttonColor: isSpotifyConnected ? "bg-red/70" : "bg-tile-green",
    buttonText: isSpotifyConnected ? "Disconnect Spotify" : "Connect Spotify",
    buttonTextColor: "persian-indigo",
    isSpotifyConnected: isSpotifyConnected,
    connectSpotify: !isSpotifyConnected ? connectSpotify : undefined,
    logoutSpotify: isSpotifyConnected ? (logoutSpotify || (() => {})) : undefined,
  },
];