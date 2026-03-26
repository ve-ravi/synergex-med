# Synergex Med - Patient Referral Intake Form

## Project Overview

A professional patient referral intake page built with Next.js, React Hook Form, Zod validation, and Tailwind CSS. This application allows law offices and authorized representatives to submit new patient referrals to Synergex Med.

## Project Status

✅ **COMPLETED**

- [x] Next.js 16+ project scaffolding
- [x] React Hook Form integration
- [x] Zod schema validation
- [x] Tailwind CSS styling (responsive, mobile-first)
- [x] Form component with all required fields
- [x] Client-side validation with error messages
- [x] Success/error submission states
- [x] Professional UI design
- [x] TypeScript type safety
- [x] ESLint configuration

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.1 | React framework with App Router |
| React | 19.2.4 | UI component library |
| React Hook Form | Latest | Form state management |
| Zod | Latest | Schema validation |
| Tailwind CSS | 4 | Utility-first CSS styling |
| TypeScript | ^5 | Type-safe development |

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   ├── page.tsx                # Home page (renders ReferralForm)
│   │   ├── globals.css             # Global Tailwind styles
│   │   └── favicon.ico
│   ├── components/
│   │   └── ReferralForm.tsx        # Main referral form (client component)
│   └── lib/
│       └── schemas.ts              # Zod validation schemas
├── public/                          # Static assets
├── .github/
│   └── copilot-instructions.md     # This file
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
├── next.config.ts                  # Next.js configuration
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

## Form Structure

### Three Main Sections:

1. **Patient Information**
   - First/Last Name
   - Date of Birth
   - Phone Number
   - Email (optional)

2. **Referring Attorney Information**
   - Law Firm Name
   - Attorney/Case Manager Name
   - Attorney Email
   - Attorney Phone

3. **Referral Details**
   - Primary Complaint (max 500 chars)
   - Preferred Clinic Location (dropdown)
   - Appointment Type (radio buttons)

## Development Guidelines

### Running the Project

```bash
# Development server (watches for changes)
npm run dev

# Production build and start
npm run build
npm start

# Linting
npm run lint
```

### Code Organization

- **Components**: Always use `'use client'` directive for client components
- **Validation**: Use Zod schemas in `src/lib/schemas.ts` for single source of truth
- **Form Handling**: Leverage React Hook Form for efficient state management
- **Styling**: Use Tailwind utility classes; avoid custom CSS when possible
- **Type Safety**: Export types from Zod schema (`type MyType = z.infer<typeof mySchema>`)

### Adding New Features

1. **New form fields**: Add to `schemas.ts` → Update `ReferralForm.tsx` UI
2. **New validation**: Update Zod schema in `schemas.ts`
3. **API endpoints**: Create in `src/app/api/` directory (Next.js App Router)
4. **Components**: Organize in `src/components/` with clear naming

### Validation Pattern

```typescript
// In src/lib/schemas.ts
export const mySchema = z.object({
  fieldName: z.string().min(1, 'Error message'),
});

// In component
const { register, formState: { errors } } = useForm({
  resolver: zodResolver(mySchema),
});
```

## Form Validation Rules

| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| Patient First Name | Yes | String | Min 1 char, trimmed |
| Patient Last Name | Yes | String | Min 1 char, trimmed |
| Date of Birth | Yes | Date | Valid date format |
| Patient Phone | Yes | String | Min 10 digits |
| Patient Email | No | String | Valid email if provided |
| Law Firm Name | Yes | String | Min 1 char, trimmed |
| Attorney Name | Yes | String | Min 1 char, trimmed |
| Attorney Email | Yes | String | Valid email format |
| Attorney Phone | Yes | String | Min 10 digits |
| Primary Complaint | Yes | Text | Max 500 characters |
| Clinic Location | Yes | Enum | Predefined list |
| Appointment Type | Yes | Enum | 'in-person' or 'telemedicine' |

## Clinic Locations

Currently supported California locations:
- Anaheim
- Culver City
- Downey
- El Monte
- Long Beach
- Los Angeles

*(To add more: Update `CLINIC_LOCATIONS` in ReferralForm.tsx and schema in schemas.ts)*

## Backend Integration

Currently, form submission simulates a 1-second API call. To connect to a real backend:

1. Create API endpoint: `src/app/api/referrals/route.ts`
2. Update `onSubmit` in `ReferralForm.tsx` to call real endpoint
3. Handle response success/error states

Example:
```typescript
const response = await fetch('/api/referrals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

## UI/UX Features

- **Responsive Grid**: 1 column on mobile, 2 columns on desktop (md breakpoint)
- **Section Headers**: Visual separators with bottom borders
- **Error States**: Inline field errors with red styling
- **Success Message**: Green banner feedback on submission
- **Character Counter**: Real-time count for complaint textarea
- **Button States**: Disabled state during submission, hover effects
- **Accessibility**: Proper labels, focus states, semantic HTML

## Styling Approach

- **Color Scheme**: Blue/Indigo gradient background, white form
- **Spacing**: Consistent use of 4-point grid (p-4, gap-4, mb-4, etc.)
- **Typography**: Professional sans-serif (Geist font), semantic hierarchy
- **Interactive Elements**: Hover effects, focus rings, smooth transitions
- **Mobile First**: Responsive classes (md:grid-cols-2, etc.)

## Troubleshooting

**Issue**: Port 3000 already in use
```bash
npm run dev -- -p 3001
```

**Issue**: Dependency conflicts
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript compilation errors
```bash
npm run build
```

## Next Steps / Future Work

- [ ] Backend API endpoint for persistence
- [ ] Email notifications to law firm
- [ ] PDF referral confirmation
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Document upload fields
- [ ] Referral tracking system
- [ ] Analytics and reporting

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t synergex-referral .
docker run -p 3000:3000 synergex-referral
```

### Traditional Node Server
```bash
npm run build
npm start
```

## Support & Maintenance

- Check `README.md` for general project documentation
- Review `package.json` for current dependencies
- Run `npm audit` regularly for security updates
- Update dependencies: `npm update`
- Test on mobile devices before deploying

## Version History

- **v1.0.0** (Mar 2026): Initial release with all required features

---

Last Updated: March 25, 2026
