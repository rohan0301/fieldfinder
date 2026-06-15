# FieldFinder

A baseball access mapping application for discovering RBI programs and youth baseball opportunities across Alameda and San Francisco counties.

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd fieldfinder
npm install
```

### 2. Set Up Google Maps API Key

**Option A: Using Your Own Key (Recommended)**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Click **Create Credentials → API Key**
4. Copy your API key
5. Create `.env.local` in the project root:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
6. That's it! Run `npm run dev`

**Option B: Ask the Original Developer**

If you don't want to set up your own key, the original developer can share their `.env.local` file (ask them).

### 3. Run Development Server

```bash
npm run dev
```

Opens:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Getting a Google Maps API Key (Detailed Steps)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Click **NEW PROJECT**
5. Name it (e.g., "FieldFinder") and click **CREATE**
6. Wait ~1 minute for the project to be created

### Step 2: Enable Maps JavaScript API

1. In the left sidebar, click **APIs & Services → Library**
2. Search for "Maps JavaScript API"
3. Click on it
4. Click **ENABLE**

### Step 3: Create an API Key

1. Click **APIs & Services → Credentials** (left sidebar)
2. Click **+ CREATE CREDENTIALS → API Key**
3. Copy the key that appears

### Step 4: (Recommended) Restrict Your Key

To prevent someone else from using your key:

1. In the API key dialog, click **RESTRICT KEY**
2. Under **Application restrictions**, select **HTTP referrers (web sites)**
3. Add your domain(s):
   ```
   localhost:5173
   localhost:3000
   yourdomain.com
   ```
4. Under **API restrictions**, select **Restrict key**
5. Check **Maps JavaScript API** only
6. Click **SAVE**

### Step 5: Add to Your Project

Create `.env.local` in the project root:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxx
```

Restart dev server:
```bash
npm run dev
```

---

## Project Structure

```
fieldfinder/
├── client/                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Map.tsx       # Google Maps integration
│   │   │   ├── NeighborhoodSidebar.tsx
│   │   │   └── ProgramSidebar.tsx
│   │   ├── lib/
│   │   │   ├── data.ts       # Neighborhood & program data + scoring
│   │   │   └── zipNeighborhoodMap.ts
│   │   ├── pages/
│   │   └── App.tsx
│   └── public/
├── server/                    # Backend (Express)
│   └── index.ts
├── .env.example              # Environment variables template
├── package.json
└── tsconfig.json
```

---

## Features

### Scoring System

Neighborhoods are scored on:
- **Social Vulnerability (SVI)**: CDC metric of economic/social distress
- **Baseball Fields**: Count of confirmed fields available
- **Boys & Girls Clubs**: Organizational infrastructure
- **Program Coverage**: Nearby RBI, Little League, and nonprofit programs (reduces need score)

See [QUICK_START.md](./QUICK_START.md) and [SCORING_GUIDE.md](./SCORING_GUIDE.md) for details.

### Data

- **Neighborhoods**: 60+ ZIP codes across Alameda and San Francisco counties
- **Programs**: 5+ confirmed RBI, Little League, and nonprofit programs
- **Fields**: Condition assessment and location data for each neighborhood

---

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run check    # Type-check TypeScript
npm run format   # Format code with Prettier
```

---

## Troubleshooting

### Map Not Loading

**Error:** "Failed to load Google Maps"

**Solutions:**
1. Check that `VITE_GOOGLE_MAPS_API_KEY` is set in `.env.local`
2. Verify the key is valid in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. Make sure **Maps JavaScript API** is enabled for your project
4. Check browser console for specific errors (F12 → Console tab)

### API Key Not Being Picked Up

**Error:** Environment variable not recognized

**Solutions:**
1. File must be named `.env.local` (not `.env`)
2. Located in project root (same level as `package.json`)
3. Restart dev server after changing `.env.local`:
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```
4. Hard refresh browser (Ctrl+Shift+R on Windows)

### "Invalid API Key"

**Error:** Maps loads but shows "Refused to load" or permission error

**Solutions:**
1. Verify key in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Check HTTP referrer restrictions match your domain
3. Ensure **Maps JavaScript API** is enabled
4. Wait 5 minutes for permissions to propagate

---

## Contributing

When adding features:

1. Keep neighborhood data (`data.ts`) in sync with source Excel/docs
2. Update scoring if adding new fields (see [SCORING_GUIDE.md](./SCORING_GUIDE.md))
3. Test with `npm run check` before committing
4. Run `npm run format` to format code

---

## License

MIT

---

## Questions?

- **Setup issues**: Check `.env.example` and troubleshooting above
- **Scoring questions**: See [SCORING_GUIDE.md](./SCORING_GUIDE.md)
- **Quick reference**: See [QUICK_START.md](./QUICK_START.md)
