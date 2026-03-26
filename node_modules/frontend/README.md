# Patient Referral Intake Form - Synergex Med

A modern, professional patient referral intake form built with Next.js, React Hook Form, Zod validation, and Tailwind CSS. This frontend application allows law offices and authorized representatives to submit patient referrals to Synergex Med via a type-safe tRPC API.

## Features

- **tRPC Integration**: Type-safe RPC calls to backend with automatic type inference
- **Backend Connected**: Submits referrals to Express backend with tRPC server
- **Database Persistence**: Referrals stored in PostgreSQL via Drizzle ORM
- **Client-Side Validation**: Real-time validation with Zod schemas
- **Form State Management**: React Hook Form for efficient form handling
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Professional UI**: Modern, accessible interface with Tailwind CSS
- **Real-time Feedback**: Success/error messages from backend response
- **Character Counter**: Real-time count for complaint field (max 500 chars)
- **Monorepo Architecture**: Shared types from @synergex-med/shared package

## Form Fields

### Patient Information
- First Name (required)
- Last Name (required)
- Date of Birth (required)
- Phone Number (required, min 10 digits)
- Email Address (optional)

### Referring Attorney Information
- Law Firm Name (required)
- Attorney/Case Manager Name (required)
- Attorney Email (required)
- Attorney Phone (required, min 10 digits)

### Referral Details
- Primary Complaint/Reason for Referral (required, max 500 characters)
- Preferred Clinic Location (required dropdown):
  - Anaheim, Culver City, Downey, El Monte, Long Beach, Los Angeles
- Preferred Appointment Type (required radio buttons):
  - In-Person
  - Telemedicine

## Tech Stack

- **Framework**: [Next.js 16.2.1](https://nextjs.org) with App Router
- **React**: 19.2.4
- **Form Library**: [React Hook Form](https://react-hook-form.com)
- **Validation**: [Zod](https://zod.dev)
- **API Layer**: [tRPC 11](https://trpc.io) with HTTP Batch Link
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Language**: TypeScript 5+
- **Icons**: lucide-react

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page renders ReferralForm
│   └── globals.css          # Global Tailwind styles
├── components/
│   └── ReferralForm.tsx     # Main form component (client-side)
└── lib/
    ├── schemas.ts           # Zod validation (from shared)
    └── trpc-client.ts       # tRPC client configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend running on `http://localhost:3001`

### Installation

```bash
cd frontend
npm install
```

### Development

1. **Start the backend** (in a separate terminal):
```bash
cd backend
npm run dev
```

2. **Start the frontend**:
```bash
npm run dev
```

3. **Open browser**:
[http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Form Submission Flow

1. **User fills form** with patient and referral information
2. **Client-side validation** (Zod on blur)
3. **Form submit** → tRPC client calls backend
4. **Backend validation** with same Zod schema
5. **Database insert** via Drizzle ORM into PostgreSQL
6. **Success response** includes:
   - `referralId` (UUID)
   - `message`: "Referral submitted successfully"
   - `estimatedFollowUp`: "Our team will contact the patient within 24 hours"
7. **Frontend feedback** displays success message with follow-up info
8. **Form reset** automatically

## tRPC Integration

### Client Setup

```typescript
// src/lib/trpc-client.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@synergex-med/shared';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});
```

### Usage in Components

```typescript
// Type-safe mutation with automatic type inference
const result = await trpc.referral.submitReferral.mutate(data);

// Response is fully typed:
// {
//   success: true,
//   referralId: string,
//   message: string,
//   estimatedFollowUp: string
// }
```

## Key Components

### ReferralForm Component
- Multi-section form layout
- Real-time validation feedback
- Success/error alert display
- Loading state with spinner
- Responsive grid (1 col mobile, 2 cols desktop)
- Submit and clear buttons

### tRPC Client
- Automatic serialization
- Request batching for efficiency
- Type-safe queries and mutations
- Error handling with tRPC errors

## Monorepo Integration

### Shared Package

The `@synergex-med/shared` package provides:
- `referralSchema` - Zod validation schema
- `type ReferralFormData` - TypeScript type
- `type AppRouter` - tRPC router type

Both frontend and backend use the same schema for consistency.

## Styling

- **Color Scheme**: Blue/indigo gradient with slate backgrounds
- **Responsive**: 1-column on mobile, 2-column on desktop (md breakpoint)
- **Icons**: lucide-react for visual hierarchy
- **Accessibility**: Proper labels, focus states, semantic HTML
- **Spacing**: 4-point grid system
- **Animations**: Smooth transitions, loading spinners

## Validation

All fields use Zod schema validation with custom error messages:

| Field | Type | Rules |
|-------|------|-------|
| Patient Name | Text | Required, trimmed |
| Phone | Tel | Required, min 10 digits |
| Email | Email | Optional (patient), required (attorney) |
| Complaint | Textarea | Required, max 500 chars |
| Clinic | Enum | From predefined list |
| Appointment | Enum | 'in-person' or 'telemedicine' |

## Backend Integration

This frontend connects to a Node.js/Express backend:

- **Port**: 3001
- **RPC Endpoint**: `/trpc`
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Same Zod schema

**To configure backend URL:**

Edit `src/lib/trpc-client.ts`:
```typescript
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) 
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  return 'http://localhost:3001';
};
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t synergex-referral .
docker run -p 3000:3000 -e NEXT_PUBLIC_BACKEND_URL=your-api-url synergex-referral
```

### Environment Variables

For production, set:
- `NEXT_PUBLIC_BACKEND_URL`: Backend tRPC endpoint URL

## Troubleshooting

### Backend 404 Errors

```bash
# Ensure backend is running
cd backend
npm run dev
```

### Port 3000 Already in Use

```bash
npm run dev -- -p 3001
```

### Clear Next.js Cache

```bash
rm -rf .next
npm run dev
```

### Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] React Query integration for advanced caching
- [ ] Real-time referral status tracking
- [ ] Multi-language support (i18n)
- [ ] Document/attachment uploads
- [ ] Email verification flow
- [ ] SMS notifications
- [ ] Referral history viewing

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Part of the Synergex Med platform.

## Last Updated

March 26, 2026
