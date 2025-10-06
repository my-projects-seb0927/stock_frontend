# 📈 Stock Analysis Dashboard

A modern, responsive web application for analyzing stock market data, ratings, and recommendations. Built with Vue 3, TypeScript, and Tailwind CSS.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### 📊 Stock List Dashboard
- **Advanced Filtering**: Filter stocks by ticker, company, brokerage, and rating
- **Server-Side Sorting**: Sort by ticker, company, or brokerage with real-time API updates
- **Smart Pagination**: Navigate through large datasets with customizable page sizes (10/25/50/100 items)
- **Color-Coded Ratings**: Visual indicators for positive (green), neutral (blue), and negative (red) ratings
- **Responsive Table**: Mobile-friendly design with horizontal scrolling

### 🔍 Stock Detail View
- **Comprehensive Information**: View detailed stock analysis including rating changes and price targets
- **Visual Indicators**: Upgrade/downgrade arrows and status messages
- **Historical Records**: Complete history table showing all records for a specific ticker
- **Timeline View**: Analysis time and creation timestamps for each record
- **Brokerage Information**: Track which firms are providing recommendations

### ⭐ Stock Recommendations
- **Data-Driven Scoring**: Algorithm-based recommendations (0-10 score)
- **Top Picks**: View the best investment opportunities ranked by score
- **Medal System**: Visual ranking with 🥇🥈🥉 for top 3 stocks
- **Detailed Reasoning**: Understand why each stock is recommended
- **Upside Potential**: See percentage increase potential based on target prices
- **Quick Navigation**: Direct links to full stock details

### 🎨 UI/UX Features
- **PrimeIcons Integration**: Consistent icon library throughout the application
- **Tailwind CSS**: Modern, utility-first styling with custom design system
- **Loading States**: Smooth user experience with animated spinners
- **Error Handling**: Graceful error messages and empty states
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Frontend Stack
- **Vue 3** (Composition API with `<script setup>`)
- **TypeScript** (Strict mode for type safety)
- **Pinia** (State management)
- **Vue Router** (Client-side routing)
- **Axios** (HTTP client)
- **Tailwind CSS** (Styling)
- **PrimeIcons** (Icon library)
- **Vite** (Build tool and dev server)

### Project Structure
```
stock_frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   │   ├── FilterPanel.vue
│   │   └── Pagination.vue
│   ├── router/          # Vue Router configuration
│   │   └── index.ts
│   ├── services/        # API service layer
│   │   ├── api.client.ts
│   │   └── stock.service.ts
│   ├── stores/          # Pinia stores
│   │   ├── index.ts
│   │   └── stock.store.ts
│   ├── types/           # TypeScript type definitions
│   │   ├── api.types.ts
│   │   ├── index.ts
│   │   └── stock.types.ts
│   ├── views/           # Page components
│   │   ├── StockListView.vue
│   │   ├── StockDetailView.vue
│   │   └── RecommendationsView.vue
│   ├── App.vue          # Root component
│   ├── main.ts          # Application entry point
│   └── style.css        # Global styles
├── public/              # Public static assets
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** or **pnpm** or **yarn**
- **Backend API** running on `http://localhost:8080`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (Optional)
   
   The default API URL is `http://localhost:8080/api/v1`
   
   To change it, update `src/services/api.client.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Rating System

### Rating Levels (Highest to Lowest)

**Level 5** - Most Positive
- Strong-Buy

**Level 4** - Positive
- Buy
- Speculative Buy
- Overweight
- Outperform
- Market Outperform
- Sector Outperform
- Positive

**Level 3** - Neutral
- Hold
- Neutral
- In-Line
- Market Perform
- Sector Perform
- Equal Weight

**Level 2** - Negative
- Underweight
- Underperform
- Reduce

**Level 1** - Most Negative
- Sell

### Color Coding
- 🟢 **Green** - Positive ratings (Level 4-5)
- 🔵 **Blue** - Neutral ratings (Level 3)
- 🔴 **Red** - Negative ratings (Level 1-2)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### TypeScript Configuration

The project uses strict TypeScript with path aliases:
- `@/` maps to `src/`
- Strict type checking enabled
- ES2020 target

## 📦 Key Dependencies

### Production
- **vue** (3.5.21) - Progressive JavaScript framework
- **vue-router** (4.5.1) - Official router for Vue.js
- **pinia** (3.0.3) - State management library
- **axios** (1.12.2) - HTTP client
- **tailwindcss** (4.1.14) - Utility-first CSS framework
- **primeicons** (7.0.0) - Icon library

### Development
- **vite** (7.1.7) - Next generation frontend tooling
- **typescript** (5.8.3) - Typed superset of JavaScript
- **vue-tsc** (3.0.7) - TypeScript checker for Vue
- **vitest** (3.2.4) - Testing framework
