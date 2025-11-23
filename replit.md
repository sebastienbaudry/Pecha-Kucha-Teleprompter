# Pecha Kucha Teleprompter

## Overview

A professional presentation teleprompter application designed specifically for Pecha Kucha format presentations (20 slides × 20 seconds each). The application provides automatic 30-second slide transitions with visual timing cues, allowing presenters to practice and deliver presentations with precise timing control. Features include a presentation editor for managing multiple presentations, a full-screen teleprompter view with countdown timer, and visual urgency indicators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching
- Shadcn UI component library built on Radix UI primitives
- Tailwind CSS for utility-first styling

**Routing Structure:**
- `/` - Presentation list page showing all saved presentations
- `/editor/:id` - Presentation editor for creating/editing presentations (supports `/editor/new` for new presentations)
- `/present/:id` - Full-screen teleprompter view for presenting

**Design System:**
- Custom teleprompter color palette defined in Tailwind config: black background (#000000), white text (#ffffff), cyan accent (#00e5ff), red warning (#ff3d00)
- Responsive typography with fluid scaling using clamp() for optimal readability
- Consistent spacing system using 15px and 20px units
- Component library configured via Shadcn UI in "new-york" style with CSS variables

**Key UI Features:**
- Presentation view includes fixed header with slide counter and timer, progress bar, centered script content, and fixed footer controls
- Timer displays with color-coded urgency (cyan for normal, red for <5 seconds remaining)
- Auto-scrolling disabled to prevent manual interference during timed presentations
- Mobile-responsive with viewport constraints to prevent user scaling

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type-safe API development
- Separate development and production server configurations
- Custom logging middleware for request tracking and debugging

**Development vs Production:**
- Development mode uses Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets from dist/public
- Build process uses esbuild for server bundling and Vite for client bundling

**API Endpoints:**
- `GET /api/presentations` - Fetch all presentations
- `GET /api/presentations/:id` - Fetch single presentation by ID
- `POST /api/presentations` - Create new presentation with validation
- `PATCH /api/presentations/:id` - Update existing presentation
- `DELETE /api/presentations/:id` - Delete presentation

**Data Validation:**
- Zod schemas for runtime validation of presentation data
- Schema validation integrated with Drizzle ORM via drizzle-zod
- Client and server share validation schemas from shared/ directory

**Storage Layer:**
- Storage interface (IStorage) defines contract for data operations
- In-memory storage implementation (MemStorage) for development/testing
- Includes seed data with sample French Pecha Kucha presentation about art and morality
- Database-ready architecture with Drizzle ORM configuration pointing to PostgreSQL

### Data Storage Solutions

**Database Configuration:**
- Drizzle ORM configured for PostgreSQL via Neon serverless driver
- Database schema defined in shared/schema.ts for code sharing between client and server
- Migration files stored in migrations/ directory
- Connection via DATABASE_URL environment variable

**Schema Design:**
```typescript
presentations {
  id: varchar (primary key, auto-generated UUID)
  title: text (required)
  slides: text[] (array, required, minimum 1 slide)
}
```

**Current Implementation:**
- MemStorage provides in-memory persistence for immediate functionality
- Pre-seeded with sample presentation demonstrating expected data format
- Database migration ready via `db:push` script when PostgreSQL is provisioned

### Authentication and Authorization

**Current State:**
- No authentication or authorization implemented
- All presentations publicly accessible
- API endpoints open without authentication middleware

**Architecture Readiness:**
- Express session configuration present (connect-pg-simple for session storage)
- Request object extended to potentially include session data
- Ready for future authentication layer integration

### Component Architecture Patterns

**Form Management:**
- React Hook Form with Zod resolver for type-safe form validation
- Shared form components from Shadcn UI library
- Optimistic updates with TanStack Query mutations

**State Management:**
- Server state managed via TanStack Query with aggressive caching (staleTime: Infinity)
- Local component state for UI interactions (timer, slide index, presentation state)
- Query invalidation on mutations to maintain data consistency

**Error Handling:**
- Custom error boundary via Replit runtime error modal plugin
- Toast notifications for user-facing errors
- API errors caught and displayed with descriptive messages

**Presentation Timer Logic:**
- 30-second countdown per slide with 1-second interval updates
- Automatic progression to next slide on timer expiration
- Manual controls (play/pause, next/previous, reset)
- Visual urgency indicators (color change at 5 seconds remaining)
- Finished state when final slide completes

## External Dependencies

### Third-Party UI Libraries
- **Radix UI:** Headless component primitives for accessible UI components (accordion, dialog, dropdown, popover, progress, slider, tabs, toast, tooltip, etc.)
- **Shadcn UI:** Pre-styled component system built on Radix UI with Tailwind CSS
- **Lucide React:** Icon library for consistent iconography
- **Embla Carousel:** Carousel/slider functionality (included but not actively used in core features)

### Development Tools
- **Replit Plugins:** Vite plugin for runtime error overlay, cartographer for dependency visualization, dev banner
- **TypeScript:** Static type checking across entire codebase
- **ESBuild:** Fast JavaScript bundler for production server build
- **PostCSS with Autoprefixer:** CSS processing and vendor prefixing

### Database and ORM
- **Drizzle ORM:** Type-safe SQL query builder and schema manager
- **@neondatabase/serverless:** Serverless PostgreSQL driver for edge/serverless environments
- **drizzle-kit:** CLI tool for schema migrations and database operations
- **connect-pg-simple:** PostgreSQL session store for Express sessions (configured but not active)

### Utility Libraries
- **date-fns:** Date manipulation and formatting
- **clsx & class-variance-authority:** Conditional className composition
- **cmdk:** Command menu functionality (included but not actively used)
- **nanoid:** Unique ID generation for development server cache busting
- **zod:** Runtime schema validation and type inference

### Build and Development
- **Vite:** Frontend build tool and development server with HMR
- **@vitejs/plugin-react:** React plugin for Vite with Fast Refresh support
- **Tailwind CSS:** Utility-first CSS framework with custom configuration
- **Wouter:** Lightweight React router (~1KB alternative to React Router)