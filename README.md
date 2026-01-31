# 🌿 Nature Explorer (Renamed from APH)

> A premium, modern React Native Expo application designed for discovering Indonesia's breathtaking natural tourist destinations.

**Nature Explorer** transforms the traditional tourism app into an immersive digital experience. Built with a focus on aesthetics, smooth interactions, and robust performance, it guides users through Indonesia's hidden gems—from the volcanic landscapes of Bromo to the pristine waters of Raja Ampat.

---

## ✨ Key Features

### 1. 🎨 Premium "Earth & Emerald" Design
- **Immersive UI**: A completely overhauled visual identity using deep emerald greens and warm sand tones (`#064E3B`, `#F9F9F7`).
- **Glassmorphism**: Modern glass-effect elements on cards and headers for a sophisticated look.
- **Micro-Interactions**: Subtle animations and bouncy parallax effects that make the app feel alive.

### 2. 🏠 Interactive Dashboard
- **Personalized Greeting**: Dynamic welcome message.
- **Smart Filtering**: Pill-shaped category filters (Gunung, Pantai, Sejarah, etc.) with instant list updates.
- **Horizon Scroll**: Smooth horizontal scrolling for popular destinations with optimized rendering.

### 3. 🗺️ Advanced Map Integration
- **Full Indonesia Coverage**: Interactive map centered on the Indonesian archipelago.
- **Custom Markers**: GeoJSON-powered data rendering with custom markers.
- **Interactive Popups**: Tap a marker to see a floating preview card with quick navigations.

### 4. 📄 Immersive Detail Screen
- **Parallax Header**: High-performance native scrolling animation for header images.
- **Content Sheet**: Modern bottom-sheet style layout for description, price, and operating hours.
- **Sticky Actions**: "Book Now" and navigation bar that remains accessible.

---

## 🚀 Performance Optimizations (Optimized for 60 FPS)

This project has undergone rigorous performance tuning:

- **Strict Caching Layer**: Custom `useCachedFetch` hook with `useRef` safety checks to prevent memory leaks and redundant network requests.
- **List Virtualization**: `FlatList` configured with `windowSize={3}`, `initialNumToRender={4}`, and `removeClippedSubviews` to handle heavy image lists smoothly on low-end Android devices.
- **Component Memoization**: Heavy UI components like `Card.tsx` are wrapped in `React.memo` to prevent unnecessary re-renders.
- **Native Driver Animations**: Used native scroll events for the parallax effect instead of JS-bridge heavy libraries.

---

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev) (React Native) via **Expo Router** (File-system based routing).
- **Language**: TypeScript (Strict typing for robustness).
- **Maps**: `react-native-maps` (Google Maps Provider).
- **Icons**: Ionicons (`@expo/vector-icons`).
- **Data**: Local GeoJSON/JSON architecture (Offline-first ready).

---

## 📁 Project Structure

```bash
c:\Projects\mps
├── app/                  # Screens & Routing
│   ├── index.tsx         # Dashboard / Home
│   ├── map.tsx           # Interactive Map Screen
│   ├── detail/
│   │   └── [id].tsx      # Dynamic Detail Screen
│   └── _layout.tsx       # Root Layout & Theme Provider
├── components/           # Reusable UI Blocks
│   ├── Card.tsx          # Memoized Destination Card
│   ├── Header.tsx        # Unified Header Component
│   ├── Shimmer.tsx       # Loading Skeletons
│   └── ...
├── hooks/                # Custom Logic
│   ├── useCachedFetch.ts # Optimized Data Fetching
│   └── useTheme.ts       # Theme Context
├── data/
│   └── map.json          # Curated Destination Data (Unsplash Images)
└── utils/
    ├── api.ts            # Data Access Layer & Type Definitions
    ├── colors.ts         # "Earth & Emerald" Design Tokens
    └── format.ts         # Currency & Text Formatters
```

## 🏁 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/tommyaditya/APH.git
    cd APH
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the App**
    ```bash
    npx expo start -c
    ```
    *(Use `-c` to clear Metro bundler cache if you encounter stale assets)*

---

## 📝 Recent Changelog (v2.0 Overhaul)

- **[UI]** Rebranded entire app to "Nature Explorer" with new color palette.
- **[Fix]** Resolved critical `null` pointer exceptions in Map and Home screens.
- **[Opt]** Implemented `React.memo` and `FlatList` optimizations.
- **[Data]** Replaced placeholder data with 14 real Indonesian destinations including Borobudur, Komodo, and Raja Ampat with high-res Unsplash images.
- **[Feat]** Added Parallax scroll effect to Detail page.

---

Developed with ❤️ by **Antigravity** for **Tommy Aditya**.
