# Synergex Med - Patient Referral Intake System

A complete full-stack patient referral intake system for medical practices. This monorepo contains the frontend application, backend API, and shared packages for a type-safe, modern web application.

## 🎯 Project Overview

Synergex Med is a professional patient referral platform that allows law offices and authorized representatives to submit new patient referrals through a modern web interface. The system provides:

- **Type-safe RPC communication** between frontend and backend using tRPC
- **Real-time form validation** with shared Zod schemas
- **Persistent data storage** in PostgreSQL via Drizzle ORM
- **Professional UI** built with Next.js and React
- **Monorepo architecture** for code sharing and consistency

## 📁 Monorepo Structure

```
synergex-med/                 # Root: Shared configuration and workspaces
├── frontend/                 # Next.js 16 - Patient referral form UI
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components (ReferralForm)
│   │   └── lib/            # Utilities and tRPC client
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.ts  # Tailwind CSS config
│   └── README.md           # Frontend-specific documentation
│
├── backend/                  # Express.js - tRPC API server
│   ├── src/
│   │   ├── db/             # Database schema and migrations
│   │   ├── server/         # tRPC routers and middleware
│   │   └── index.ts        # Express server entry
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variable template
│   └── README.md           # Backend-specific documentation
│
├── packages/
│   └── shared/             # Shared types and schemas
│       ├── src/
│       │   ├── schemas/    # Zod validation schemas
│       │   ├── types/      # TypeScript types and interfaces
│       │   └── index.ts    # Package exports
│       ├── package.json    # Shared package config
│       └── tsconfig.json
│
├── package.json            # Root workspace config
├── tsconfig.json           # Root TypeScript config
├── ARCHITECTURE.md         # Detailed system architecture
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (for data persistence)

### Installation

1. **Clone and install dependencies:**
```bash
cd synergex-med
npm install
```

This installs all dependencies for:
- `packages/shared` - Shared types and validation schemas
- `frontend` - Next.js React application
- `backend` - Express API server

2. **Configure environment variables:**

Create `.env` in the backend folder:
```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL connection details
```

Example:
```
DATABASE_URL=postgresql://user:password@localhost:5432/synergex_med
NODE_ENV=development
```

3. **Run in development mode:**

Open two terminals:

**Terminal 1 - Start Backend (Port 3001):**
```bash
npm run dev:backend
# or manually:
cd backend && npm run dev
```

**Terminal 2 - Start Frontend (Port 3000):**

**Configure environment variables:**

Create `.env.local` in the frontend folder:
```bash
cd frontend
cp .env.local.example .env.local
```

```bash
npm run dev:frontend
# or manually:
cd frontend && npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## 📦 Monorepo Packages

### `packages/shared`

Shared code used by both frontend and backend:

```typescript
// Zod validation schema (used by both)
export const referralSchema = z.object({
  patientFirstName: z.string().min(1),
  patientLastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  patientPhone: z.string().regex(/^\d{10,}$/),
  // ... additional fields
});

// Type inference for both frontend and backend
export type ReferralFormData = z.infer<typeof referralSchema>;

// tRPC router type definition
export type AppRouter = typeof appRouter;
```

**Location:** [packages/shared/src](packages/shared/src)

**Benefits:**
- ✅ Single source of truth for validation
- ✅ Type safety across frontend-backend boundary
- ✅ No type mismatches or manual synchronization
- ✅ Shared utility functions and constants

### `frontend`

Next.js 16 React application for patient referral intake.

**Key Features:**
- Multi-section form with 11 input fields
- Real-time validation with Zod schemas
- tRPC client for backend communication
- Responsive design (mobile-first)
- Success/error message feedback
- Character counter for text areas

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- React Hook Form
- Zod validation
- Tailwind CSS 4
- TypeScript

**Getting Started:**
```bash
cd frontend
npm install
npm run dev
```

**Documentation:** See [frontend/README.md](frontend/README.md)

### `backend`

Express.js server with tRPC API endpoints.

**Key Features:**
- tRPC server for type-safe API
- Drizzle ORM with PostgreSQL
- Input validation with Zod
- Referral submission endpoint
- Error handling and logging

**Tech Stack:**
- Express.js
- tRPC 11
- Drizzle ORM
- PostgreSQL
- TypeScript

**Getting Started:**
```bash
cd backend
npm install
# Setup .env with DATABASE_URL
npm run dev
```

**Documentation:** See [backend/README.md](backend/README.md)

## 🔄 Data Flow

### Referral Submission Flow

```
1. User fills form in frontend
   ↓
2. Client validates with Zod schema
   ↓
3. Form submit → tRPC mutation
   ↓
4. HTTP POST to http://localhost:3001/trpc
   ↓
5. Backend validates again with Zod
   ↓
6. Drizzle ORM inserts into PostgreSQL
   ↓
7. Returns: { success, referralId, message, estimatedFollowUp }
   ↓
8. Frontend displays success message
   ↓
9. Form resets automatically
```

## 🛠️ Development Scripts

### Root Level (Monorepo)

```bash
# Install all dependencies
npm install

# Run frontend in development
npm run dev:frontend

# Run backend in development
npm run dev:backend

# Build all packages
npm run build

# Lint all packages
npm run lint
```

### Frontend Only

```bash
cd frontend
npm run dev              # Development server
npm run build            # Production build
npm start               # Start production server
npm run lint            # Lint code
```

### Backend Only

```bash
cd backend
npm run dev             # Development server with hot reload
npm run build           # TypeScript compilation
npm run lint           # Lint code
npm run type-check     # Type checking only
```

## 🗄️ Database Setup

### Automatic Schema Creation

On first run, Drizzle ORM creates the database schema:

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_first_name VARCHAR NOT NULL,
  patient_last_name VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  patient_phone VARCHAR NOT NULL,
  patient_email VARCHAR,
  law_firm_name VARCHAR NOT NULL,
  attorney_name VARCHAR NOT NULL,
  attorney_email VARCHAR NOT NULL,
  attorney_phone VARCHAR NOT NULL,
  primary_complaint TEXT NOT NULL,
  preferred_location VARCHAR NOT NULL,
  appointment_type VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Configuration

Update `backend/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/synergex_med
```

## 🔐 Type Safety

This monorepo prioritizes type safety across the entire stack:

### Frontend
- TypeScript components with strict mode
- React Hook Form with Zod validation
- tRPC client with automatic type inference

### Backend
- Express routes with tRPC type definitions
- Zod schema validation
- Drizzle ORM with typed queries

### Shared
- Single source of truth for schemas
- Automatic type generation from Zod schemas
- Shared utility types and interfaces

## 🚢 Deployment

### Frontend Deployment (Vercel - Recommended)

```bash
cd frontend
npm install -g vercel
vercel
```

### Backend Deployment

Options:
1. **Railway.app** - PostgreSQL + Node.js support
2. **Render.com** - Node.js hosting
3. **Heroku** - Classic Node.js platform
4. **AWS/Azure** - Custom deployments

**Environment Variables Required:**
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to 'production'

### Docker Deployment

```bash
# Frontend
docker build -t synergex-frontend ./frontend
docker run -p 3000:3000 synergex-frontend

# Backend
docker build -t synergex-backend ./backend
docker run -p 3001:3001 -e DATABASE_URL=... synergex-backend
```

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed system architecture and data flow
- **[frontend/README.md](frontend/README.md)** - Frontend-specific setup and features
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm run test              # Run tests
npm run test:coverage    # Coverage report
```

### Backend Testing

```bash
cd backend
npm run test             # Run tests
npm run test:coverage   # Coverage report
```

## 🐛 Troubleshooting

### Backend Connection Error

**Error:** Frontend shows "Failed to connect to backend"

**Solution:**
```bash
# Verify backend is running
cd backend
npm run dev

# Check port 3001 is not in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # macOS/Linux
```

### Database Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Verify PostgreSQL is running
# Update DATABASE_URL in backend/.env
# Ensure database exists
psql -U postgres -d postgres -c "CREATE DATABASE synergex_med;"
```

### Port Already in Use

**Frontend:**
```bash
npm run dev -- -p 3001  # Use different port
```

**Backend:**
```bash
PORT=3002 npm run dev   # Use different port
```

### Clear Cache and Rebuild

```bash
# Frontend
cd frontend
rm -rf .next node_modules
npm install
npm run dev

# Backend
cd backend
rm -rf dist node_modules
npm install
npm run dev
```

## 📋 Validation Rules

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| Patient First Name | Text | ✅ | Min 1 char, trimmed |
| Patient Last Name | Text | ✅ | Min 1 char, trimmed |
| Date of Birth | Date | ✅ | Valid date format |
| Patient Phone | Tel | ✅ | Min 10 digits |
| Patient Email | Email | ❌ | Valid email if provided |
| Law Firm Name | Text | ✅ | Min 1 char, trimmed |
| Attorney Name | Text | ✅ | Min 1 char, trimmed |
| Attorney Email | Email | ✅ | Valid email format |
| Attorney Phone | Tel | ✅ | Min 10 digits |
| Complaint | Textarea | ✅ | Max 500 characters |
| Clinic Location | Enum | ✅ | Predefined list |
| Appointment Type | Enum | ✅ | 'in-person' or 'telemedicine' |

## 🎨 Styling

The application uses Tailwind CSS 4 for styling with a cohesive design system:

- **Color Palette**: Blue/indigo primary, slate backgrounds
- **Responsive**: Mobile-first approach (1 col mobile, 2 cols desktop)
- **Components**: Pre-built form inputs, buttons, alerts
- **Accessibility**: Focus states, semantic HTML, proper contrast

## 🤝 Contributing

When adding new features:

1. **Update shared schema** in `packages/shared/src/schemas/`
2. **Update types** in `packages/shared/src/types/`
3. **Update backend router** in `backend/src/server/routers/`
4. **Update frontend component** in `frontend/src/components/`
5. **Sync types** - Types automatically update in both places

## 📊 Project Status

**Current Phase:** Production Ready

- ✅ Frontend form with validation
- ✅ Backend API with tRPC
- ✅ Database persistence
- ✅ Type-safe communication
- ✅ Responsive design
- ✅ Error handling

**Future Enhancements:**
- [ ] Admin dashboard
- [ ] Referral status tracking
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Email confirmations
- [ ] Document uploads
- [ ] Advanced analytics

## 📞 Support

For issues, questions, or feature requests, contact the development team or refer to:
- Technical Documentation: [ARCHITECTURE.md](ARCHITECTURE.md)
- Frontend Guide: [frontend/README.md](frontend/README.md)
- Backend Guide: [backend/README.md](backend/README.md)

## 📄 License

Part of the Synergex Med platform.

---

**Last Updated:** March 26, 2026  
**Version:** 1.0.0  
**Maintainer:** Tech Team
