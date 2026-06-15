# Quick Start: Installation & Setup

## Prerequisites

- **Node.js** 16+ ([download here](https://nodejs.org))
- **npm** 7+ (comes with Node.js)
- **Google Maps API Key** (free tier available)

Check your versions:
```bash
node --version
npm --version
```

---

## 1. Install Dependencies

```bash
npm install
```

This installs both frontend (React/Vite) and backend (Express) dependencies.

---

## 2. Get a Google Maps API Key

### Quick Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Sign in with your Google account
3. Create a new project or select an existing one
4. Click **+ CREATE CREDENTIALS → API Key**
5. Copy your API key
6. Create a file named `.env.local` in the project root:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
7. Save

### Restrict Your Key (Recommended)

To prevent unauthorized use:
1. Click the API key you just created in the Google Cloud Console
2. Under **Application restrictions**, select **HTTP referrers (web sites)**
3. Add your local domains:
   ```
   localhost:5173
   localhost:3000
   ```
4. Under **API restrictions**, select **Maps JavaScript API** only
5. Click **SAVE**

---

## 3. Run the Development Server

```bash
npm run dev
```

Opens:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 4. Build for Production

```bash
npm run build
npm start
```

---

## Troubleshooting

### Map Not Loading

Check that `.env.local` exists in the project root with `VITE_GOOGLE_MAPS_API_KEY` set. Verify the key is valid in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Make sure **Maps JavaScript API** is enabled for your project. Hard refresh the browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).

### API Key Not Being Picked Up

File must be named `.env.local` (not `.env` or `.env.example`). Must be in project root (same folder as `package.json`). Restart the dev server after creating or changing `.env.local`. Hard refresh the browser.

---

## Additional Information

For information about how neighborhoods are scored, see [SCORING_GUIDE.md](./SCORING_GUIDE.md).
