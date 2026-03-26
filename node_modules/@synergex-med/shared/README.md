# @synergex-med/shared

Shared types and validation schemas for the Synergex Med monorepo. This package serves as the **single source of truth** for validation rules and data types across the frontend and backend.

## Purpose

- **Single Schema Definition**: `referralSchema` defined once in `src/schemas.ts`
- **Type Safety**: `ReferralFormData` type exported for TypeScript usage
- **Consistency**: Frontend and backend use identical validation rules
- **Maintainability**: Changes to validation happen in one place

## Usage

### Frontend
```typescript
import { referralSchema, type ReferralFormData } from '@synergex-med/shared';

// In your form component
const { register } = useForm<ReferralFormData>({
  resolver: zodResolver(referralSchema),
});
```

### Backend
```typescript
import { referralSchema } from '@synergex-med/shared';

// In your tRPC router
router.mutation('submitReferral', {
  input: referralSchema,
  async resolve({ input }) {
    // input is automatically typed as ReferralFormData
  }
});
```

## File Structure

```
packages/shared/
├── src/
│   ├── index.ts        # Main exports
│   └── schemas.ts      # Zod validation schemas
├── package.json        # Workspace package metadata
└── tsconfig.json       # TypeScript configuration
```

## Workspace Resolution

This package is part of the npm workspace configuration in the root `package.json`. Dependencies are automatically linked:

```json
{
  "workspaces": ["packages/shared", "frontend", "backend"]
}
```

Both `frontend` and `backend` list this as a dependency:
```json
"@synergex-med/shared": "*"
```

The asterisk (`*`) resolves to the local workspace package version.

## Adding New Schemas

1. Add the schema to `src/schemas.ts`
2. Export from `src/index.ts`
3. Use in frontend and backend without package reinstall (workspaces handle it)
4. Commit both files

Example:
```typescript
// src/schemas.ts
export const newFeatureSchema = z.object({
  field1: z.string(),
  field2: z.number(),
});

export type NewFeatureData = z.infer<typeof newFeatureSchema>;

// src/index.ts
export { referralSchema, type ReferralFormData, newFeatureSchema, type NewFeatureData } from './schemas';
```

## Benefits

✅ No schema duplication  
✅ Type-safe validation across frontend and backend  
✅ Single update point for validation rule changes  
✅ Consistent error messages  
✅ Easier maintenance and refactoring  

## Development

After modifying schemas:
1. Changes are immediately available to frontend and backend (no rebuild needed with workspaces)
2. TypeScript will flag any type mismatches
3. Both applications maintain type safety

---

Last Updated: March 25, 2026
