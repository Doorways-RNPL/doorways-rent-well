import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Supabase responses
const handlers = [
  // Auth endpoints
  http.post('https://your-supabase-url.supabase.co/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
      session: {
        access_token: 'test-access-token',
      },
    });
  }),

  // Tenant endpoints
  http.get('https://your-supabase-url.supabase.co/rest/v1/tenants', () => {
    return HttpResponse.json([
      {
        id: 'test-tenant-id',
        user_id: 'test-user-id',
        first_name: 'Test',
        last_name: 'Tenant',
      },
    ]);
  }),

  // Landlord endpoints
  http.get('https://your-supabase-url.supabase.co/rest/v1/landlords', () => {
    return HttpResponse.json([
      {
        id: 'test-landlord-id',
        user_id: 'test-user-id',
        first_name: 'Test',
        last_name: 'Landlord',
      },
    ]);
  }),

  // Property endpoints
  http.get('https://your-supabase-url.supabase.co/rest/v1/properties', () => {
    return HttpResponse.json([
      {
        id: 'test-property-id',
        address: '123 Test St',
        city: 'Test City',
        rent_amount: 2000,
      },
    ]);
  }),
];

export const server = setupServer(...handlers); 