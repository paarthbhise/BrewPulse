# Overview

This is a Coffee Vending Machine Management System built as a full-stack web application. The system provides comprehensive management capabilities for coffee vending machines including real-time monitoring, remote brewing, location tracking via interactive maps, and detailed analytics. The application features a modern premium UI with 8 sophisticated themes, interactive dashboards, administrative tools for managing a fleet of coffee machines, and a complete admin portal with authentication and user management.

## Recent Changes

- **Premium Theme System**: Enhanced to 8 premium themes (Dark Professional, Light Minimal, Midnight Blue, Forest Green, Warm Copper, Deep Purple, Arctic Ice, Rose Gold) with advanced glass morphism effects, neural background patterns, and sophisticated visual design
- **Theme Showcase Page**: Dedicated page (/themes) featuring interactive theme preview cards with live demonstrations
- **Admin Portal**: Complete admin authentication and dashboard system with login page, user management, and advanced system monitoring
- **Enhanced Navigation**: Added admin access buttons and improved UI with floating theme selector

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18+ with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animation**: Framer Motion for smooth UI transitions and micro-interactions
- **Theme System**: Custom theme provider supporting multiple themes (dark professional, light minimal, midnight blue, forest green, warm copper) with CSS custom properties

## Backend Architecture
- **Runtime**: Node.js with Express.js for the REST API server
- **Language**: TypeScript with ES modules for type safety and modern JavaScript features
- **API Design**: RESTful endpoints following conventional patterns (/api/machines, /api/brews, /api/analytics)
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Storage Layer**: Abstracted storage interface (IStorage) with in-memory implementation for development

## Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL with Neon serverless configuration
- **Schema Management**: Centralized schema definitions in shared directory with automated migrations
- **Connection**: Uses @neondatabase/serverless for optimized serverless database connections

## Key Features & Components
- **Machine Management**: Full CRUD operations for coffee machines with real-time status monitoring
- **Remote Brewing**: Async brewing system with status tracking (pending → brewing → completed/failed)
- **Interactive Mapping**: Leaflet-based maps for machine location visualization and management
- **Analytics Dashboard**: Recharts-powered visualizations for revenue, usage patterns, and performance metrics
- **Real-time Updates**: Polling-based updates every 10-30 seconds for live data synchronization

## Component Architecture
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency
- **Layout**: Responsive design with mobile-first approach using Tailwind breakpoints
- **Navigation**: Sticky navigation with active state management and smooth transitions
- **Modals & Overlays**: Dialog system for remote brewing and machine management actions
- **Data Visualization**: Progress rings, charts, and real-time status indicators

## Development Setup
- **Hot Reloading**: Vite dev server with HMR for rapid development
- **Type Checking**: Strict TypeScript configuration with path mapping for clean imports
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines
- **Asset Management**: Public assets served statically with proper caching headers

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, esbuild for development and production builds
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer for utility-first styling

## UI Component Libraries
- **Radix UI**: Complete set of accessible headless components (@radix-ui/react-*)
- **shadcn/ui**: Pre-built component library with Tailwind integration
- **Lucide React**: Modern icon library for consistent iconography
- **Framer Motion**: Animation library for smooth UI transitions

## Data & State Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation integration
- **Hookform Resolvers**: Zod integration for form validation

## Backend & Database
- **Express.js**: Web framework for REST API development
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Zod**: Runtime type validation and schema generation

## Maps & Visualization
- **Leaflet**: Open-source mapping library for interactive maps
- **React-Leaflet**: React integration for Leaflet maps
- **Recharts**: React charting library for analytics visualization
- **Date-fns**: Date utility library for time-based analytics

## Development & Utility
- **Class Variance Authority**: Utility for conditional CSS classes
- **clsx & Tailwind Merge**: CSS class composition utilities
- **cmdk**: Command palette component for enhanced UX
- **Embla Carousel**: Touch-friendly carousel component

## Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Cookie management**: Secure session handling with PostgreSQL backend