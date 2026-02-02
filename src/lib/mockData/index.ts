// Barrel export for all mock data
// This file re-exports all mock data from organized modules

export { MOCK_PATIENTS } from './patients';
export { MOCK_PROFESSIONALS } from './professionals';
export { MOCK_SERVICES } from './services';
export { MOCK_PHARMACY, INITIAL_EVOLUTIONS, INITIAL_PRESCRIPTIONS } from './clinical';
export { INITIAL_PRICE_TABLES, INITIAL_BUDGETS } from './financial';
export { MOCK_COMPANIES, INITIAL_STOCK_LOCATIONS, INITIAL_STOCK_ITEMS, INITIAL_STOCK_ENTRIES } from './logistics';
export { INITIAL_PERMISSIONS, INITIAL_ROLES, INITIAL_USER_ROLES, INITIAL_LOGS } from './auth';
