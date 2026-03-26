# Synergex Med Backend API

A robust backend API built with tRPC, Drizzle ORM, and PostgreSQL for the Synergex Med patient referral system.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+ (local or managed service)
- npm or yarn

### 1. Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Update .env with your database connection
# DATABASE_URL=postgresql://user:password@localhost:5432/synergex_med
```

### 3. Database Setup

#### Option A: Local PostgreSQL with Docker (Recommended for Development)

```bash
# Start PostgreSQL container
docker run --name synergex-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=synergex_med \
  -p 5432:5432 \
  -d postgres:15-alpine

# Create migrations and push to database
npm run db:push
```

#### Option B: Hosted PostgreSQL Services

**Railway.app** (Recommended)
```bash
# 1. Sign up at railway.app
# 2. Create PostgreSQL plugin
# 3. Copy DATABASE_URL to .env
# 4. Run: npm run db:push
```

**Render**
```bash
# 1. Create new PostgreSQL database at render.com
# 2. Copy connection string to .env
# 3. Run: npm run db:push
```

**Supabase**
```bash
# 1. Create project at supabase.com
# 2. Get connection string from settings
# 3. Add to .env: DATABASE_URL
# 4. Run: npm run db:push
```

### 4. Development

```bash
# Start development server (with hot reload)
npm run dev

# Server runs on http://localhost:3001
# tRPC endpoint on http://localhost:3001/trpc
```

Open your browser and check health:
```
http://localhost:3001/health
```

### 5. Build & Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── schema.ts           # Database schema definition
│   │   └── index.ts            # Database connection
│   ├── server/
│   │   ├── routers/
│   │   │   └── referral.ts     # Referral procedures
│   │   ├── trpc.ts             # tRPC configuration
│   │   └── router.ts           # App router
│   ├── lib/
│   │   ├── schemas.ts          # Zod validation schemas
│   │   └── utils.ts            # Utility functions
│   └── index.ts                # Server entry point
├── drizzle/                    # Auto-generated migrations
├── drizzle.config.ts           # Drizzle configuration
├── tsconfig.json               # TypeScript config
├── package.json
├── .env                        # Local env variables
├── .env.example                # Env template
└── README.md
```

---

## 🔌 API Endpoints

### Available tRPC Procedures

All endpoints are type-safe end-to-end with automatic type generation for the frontend.

#### Create Referral
```typescript
POST /trpc/referral.create
Input: ReferralFormData (validated with Zod)
Returns: { success: true, id: uuid, message: string }
```

**Example Request (from frontend):**
```typescript
const { mutate } = trpc.referral.create.useMutation();
mutate({
  patientFirstName: 'John',
  patientLastName: 'Doe',
  // ... other fields
});
```

#### Get Referral by ID
```typescript
GET /trpc/referral.getById?input={id}
Returns: Referral object
```

#### List All Referrals (Admin)
```typescript
GET /trpc/referral.list?input={limit,offset,status}
Returns: { data: Referral[], pagination: {...} }
```

#### Update Referral Status (Admin)
```typescript
POST /trpc/referral.updateStatus
Input: { id, status, notes? }
Returns: { success: true, referral: Referral }
```

#### Get Referrals by Attorney Email
```typescript
GET /trpc/referral.getByAttorneyEmail?input={email}
Returns: { email, count, referrals: [] }
```

#### Get Dashboard Statistics
```typescript
GET /trpc/referral.getStats
Returns: { total, submitted, reviewed, accepted, rejected }
```

---

## 🗄️ Database Schema

### Referrals Table

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | Primary Key |
| patientFirstName | VARCHAR(100) | Required |
| patientLastName | VARCHAR(100) | Required |
| patientDateOfBirth | TEXT | Required (YYYY-MM-DD) |
| patientPhone | VARCHAR(20) | Required |
| patientEmail | VARCHAR(255) | Optional |
| lawFirmName | VARCHAR(255) | Required |
| attorneyName | VARCHAR(100) | Required |
| attorneyEmail | VARCHAR(255) | Required, Indexed |
| attorneyPhone | VARCHAR(20) | Required |
| primaryComplaint | TEXT | Required (max 500 chars) |
| preferredLocation | ENUM | Required (Anaheim, Culver City, ...) |
| appointmentType | ENUM | Required (in-person, telemedicine) |
| status | ENUM | submitted, reviewed, accepted, rejected |
| adminNotes | TEXT | Optional |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

---

## ⚙️ Configuration

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/synergex_med

# Optional
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Database Operations

### Generate Migrations

```bash
# Create migration after schema changes
npm run db:migrate
```

### Push Schema to Database

```bash
# Sync database with schema (for development)
npm run db:push
```

### Drizzle Studio (Visual Database Browser)

```bash
# Open interactive database UI
npm run db:studio
```

Then visit `http://localhost:3000` (or shown port) to browse/edit data visually.

---

## 🔐 Security Considerations

### Current Implementation
- ✅ Zod validation on all inputs
- ✅ Type-safe queries with Drizzle
- ✅ CORS configured for frontend domain
- ✅ Error handling and logging

### TODO: Production Security
- [ ] JWT/API Key authentication
- [ ] Rate limiting
- [ ] HTTPS enforcement
- [ ] Input sanitization
- [ ] SQL injection prevention (already handled by Drizzle)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Audit logging

---

## 🧪 Testing (Future)

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📝 Validation Rules

All inputs are validated with Zod schemas:

```typescript
// Field validation
- patientFirstName: min 1, max 100 chars, trimmed
- patientPhone: min 10 digits, only phone characters
- attorneyEmail: valid email format
- primaryComplaint: min 1, max 500 chars
- preferredLocation: must be from predefined list
- appointmentType: must be 'in-person' or 'telemedicine'
```

---

## 🚀 Deployment

### Railway.app (Recommended)

```bash
# 1. Connect GitHub repo to Railway
# 2. Add PostgreSQL plugin
# 3. Set environment variables
# 4. Deploy automatically on push
```

### Render

```bash
# 1. Create Web Service from GitHub
# 2. Set build command: npm run build
# 3. Set start command: npm start
# 4. Add environment variables
# 5. Deploy
```

### Docker

```bash
# Build image
docker build -t synergex-backend .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  synergex-backend
```

---

## 📚 Useful Commands

```bash
npm run dev              # Start development server
npm run build            # Build TypeScript
npm start                # Start production server
npm run db:push          # Sync schema to database
npm run db:migrate       # Create migrations
npm run db:studio        # Open database UI
npm run lint             # Run ESLint
```

---

## 🔗 Frontend Integration

### Install tRPC in Frontend

```bash
npm install @trpc/client @trpc/react-query @trpc/next
```

### Create tRPC client

```typescript
// frontend/src/lib/trpc.ts
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@backend/src/server/router';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: 'http://localhost:3001/trpc',
        }),
      ],
    };
  },
  ssr: false,
});
```

### Use in Components

```typescript
const { mutate } = trpc.referral.create.useMutation();

const handleSubmit = (data) => {
  mutate(data);
};
```

---

## 🤝 Contributing

1. Create a new branch for features
2. Follow TypeScript and Zod patterns
3. Add error handling
4. Test database queries
5. Update documentation

---

## 📧 Email Notifications (Future)

Plan to add email notifications:
- Attorney receives confirmation
- Admin receives new referral alert
- Patient gets status updates

---

## 📞 Support

- Check this README first
- Review error messages in console
- Check database connection
- Verify environment variables

---

## 📄 License

ISC

---

**Last Updated:** March 25, 2026  
**Version:** 1.0.0
