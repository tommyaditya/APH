# TODO: Fix All Code Errors

## Linting Warnings to Fix

### app/detail/[id].tsx
- [x] Change import from default `api` to named `fetchWisataById` to resolve import/no-named-as-default and import/no-named-as-default-member warnings
- [x] Remove unused `router` variable
- [x] Wrap `loadDestination` in `useCallback` and add to `useEffect` dependencies to fix react-hooks/exhaustive-deps

### app/index.tsx
- [x] Change import from default `api` to named `fetchAllWisata` to resolve import/no-named-as-default warning

### app/map.tsx
- [x] Change import from default `api` to named `fetchAllWisata` to resolve import/no-named-as-default warning
- [x] Remove unused `width` and `height` variables

## Verification
- [ ] Run `npm run lint` to confirm all warnings are resolved
- [ ] Run `npx tsc --noEmit` to ensure no TypeScript errors
