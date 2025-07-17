# Influbazzar - Influencer Marketing Platform

A modern, responsive React.js application for the Influbazzar influencer marketing platform, connecting creators, brands, and agencies.

## 🌟 Features

- **Modern Design**: Clean, professional interface with dark/light mode support
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Apple-style micro-interactions and scroll-triggered animations
- **Theme Toggle**: Seamless switching between light and dark modes
- **Performance Optimized**: Fast loading with optimized assets and code splitting
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Testing**: Comprehensive test coverage with Vitest and React Testing Library

## 🏗️ Architecture

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, LoadingSpinner, etc.)
│   ├── sections/        # Homepage sections
│   ├── MetricCard.js    # Animated metric display
│   ├── CampaignCard.js  # Campaign display component
│   ├── CreatorCard.js   # Creator profile component
│   └── ...
├── contexts/            # React contexts
│   └── ThemeContext.js  # Dark/light theme management
├── hooks/               # Custom React hooks
│   └── useIntersectionObserver.js  # Scroll animations
├── mocks/               # Mock data for development
│   ├── platformStats.js
│   ├── campaigns.js
│   ├── creators.js
│   └── ...
├── test/                # Test files
└── styles/              # Global styles and CSS utilities
```

### Key Technologies

- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd influbazzar-frontend
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code

## 🎨 Design System

### Colors

**Light Theme:**

- Background: `#ffffff`
- Card Background: `#f9fafb`
- Text: `#1f2937` (body), `#111827` (headings)
- Accent: `#6366f1` (Royal Indigo)

**Dark Theme:**

- Background: `#0A0A14`
- Card Background: `#1c1b2a`
- Text: `#f4f4f5` (body), `#e5e7eb` (muted)
- Accent: `#6d28d9` (Purple gradient)

### Typography

- **Primary Font**: Inter
- **Secondary Font**: Poppins
- **Headings**: Bold, large scale (text-2xl to text-7xl)
- **Body**: Regular weight (text-sm to text-base)

### Animations

- **Scroll Triggers**: Fade-in-up animations on section entry
- **Hover Effects**: Scale transforms and shadow changes
- **Transitions**: Smooth 300-700ms durations with easing
- **Counters**: Animated number counting for metrics

## 📱 Responsive Design

The application uses a mobile-first approach with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Key responsive features:

- Collapsible navigation for mobile
- Horizontal scroll sections on mobile
- Adaptive grid layouts
- Touch-friendly interactions

## ♿ Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Descriptive labels for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects user motion preferences

## 🧪 Testing

The project includes comprehensive testing with:

### Test Coverage

- Component rendering tests
- User interaction tests
- Theme toggle functionality
- Responsive behavior
- Accessibility compliance

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Configuration

### Theme Configuration

Themes are configured in `src/contexts/ThemeContext.js` and persist to localStorage.

### Tailwind Configuration

Custom colors, animations, and utilities are defined in `tailwind.config.js`.

### Build Configuration

Vite configuration in `vite.config.js` includes:

- React plugin setup
- Test environment configuration
- Build optimizations

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized LCP, FID, and CLS
- **Bundle Size**: Optimized with code splitting
- **Image Optimization**: Responsive images with lazy loading

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

The build folder can be deployed to any static hosting service:

1. Run `npm run build`
2. Deploy the `dist` folder
3. Configure redirects for SPA routing

### Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
VITE_API_URL=https://api.influbazzar.com
VITE_ANALYTICS_ID=your-analytics-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint configuration
- Follow React best practices
- Write tests for new components
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@influbazzar.com or join our Discord community.

## 🗺️ Roadmap

- [ ] Add campaign creation wizard
- [ ] Implement creator onboarding flow
- [ ] Add real-time notifications
- [ ] Integrate payment processing
- [ ] Add advanced analytics dashboard
- [ ] Implement messaging system
- [ ] Add mobile app companion

---

Built with ❤️ by the Influbazzar team
