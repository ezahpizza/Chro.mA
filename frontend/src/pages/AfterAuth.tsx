import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSpotify } from "@/contexts/SpotifyContext"; 

export default function AfterAuth() {
  const [searchParams] = useSearchParams();
  const spotifyUserId = searchParams.get("spotify_user_id");
  const navigate = useNavigate();
  const { setSpotifyUserId } = useSpotify(); 

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (spotifyUserId) {
      setSpotifyUserId(spotifyUserId);
      navigate("/");
    }
  }, [spotifyUserId, setSpotifyUserId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-almond-white overflow-hidden">
      <div className="text-center p-6 rounded-lg shadow-md bg-white w-full max-w-xs mx-auto">
        <span className="text-lg font-semibold text-persian-indigo">Authenticating...</span>
      </div>
    </div>
  );
}
