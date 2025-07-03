# Chro.mA Frontend

This is the frontend for Chro.mA, an AI-powered music mood analysis and mental wellness platform. The frontend is built with modern web technologies and provides a seamless, interactive user experience for exploring the emotional landscape of your music.

---

## Tech Stack
- **React** (with TypeScript) — component-based UI
- **Vite** — fast development and build tooling
- **Tailwind CSS** — utility-first styling for rapid, responsive design
- **Framer Motion** — smooth, modern animations
- **Lucide Icons** — beautiful, consistent iconography
- **React Router** — client-side routing

---

## Features
- **Spotify Integration:** Secure OAuth login, playlist and listening history analysis, playlist creation
- **AI-Powered Mood Analysis:** Visualize the emotional tone of your music using backend AI models
- **Personalized Recommendations:** Get song suggestions tailored to your mood and mental wellness goals
- **Session Management:** Temporary session-based mood analysis caching for smooth playlist creation
- **Privacy-First:** No permanent storage of your musical data; all analysis is ephemeral
- **Beautiful UI:** Responsive, accessible, and visually engaging design

---

## Project Structure
- `src/pages/` — Main pages (About, About Creator, Song Analysis, etc.)
- `src/components/` — Reusable UI components
- `src/api/` — API calls to the backend
- `src/styles/` — Tailwind and custom styles

---

## Integration with Backend
- Communicates with the FastAPI backend via REST API endpoints
- Handles authentication, session IDs, and playlist management in sync with backend logic
- All mood analysis and playlist operations are powered by backend AI and Spotify integrations

---

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables (see `.env.example` for API base URL)
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The app will be available at `http://localhost:5173` (or as configured)

---

## Customization
- Update theme colors and branding in `tailwind.config.js`
- Add or modify pages in `src/pages/`
- API endpoints can be configured in the environment file

---

## License
This project is licensed under the MIT License.
