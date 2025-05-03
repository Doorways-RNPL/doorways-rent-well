import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import LandlordApplications from './LandlordApplications';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('LandlordApplications', () => {
  beforeEach(() => {
    // Reset the application state before each test
    localStorage.clear();
  });

  it('redirects to auth page if not authenticated', async () => {
    render(<LandlordApplications />);
    
    await waitFor(() => {
      expect(screen.getByText(/please sign in first/i)).toBeInTheDocument();
    });
  });

  it('loads applications for landlord properties', async () => {
    // Mock authenticated landlord
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'landlord');
    
    // Mock landlord's properties
    server.use(
      http.get('https://your-supabase-url.supabase.co/rest/v1/properties', () => {
        return HttpResponse.json([
          {
            id: 'test-property-id',
            address: '123 Test St',
            city: 'Test City',
            rent_amount: 2000,
          },
        ]);
      })
    );
    
    // Mock applications for the property
    server.use(
      http.get('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json([
          {
            id: 'test-application-id',
            tenant_first_name: 'John',
            tenant_last_name: 'Doe',
            status: 'pending',
            monthly_income: 6000,
            property: {
              id: 'test-property-id',
              address: '123 Test St',
              city: 'Test City',
              rent_amount: 2000,
            },
          },
        ]);
      })
    );
    
    render(<LandlordApplications />);
    
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });

  it('approves an application', async () => {
    // Mock authenticated landlord
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'landlord');
    
    // Mock successful application approval
    server.use(
      http.patch('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json({
          id: 'test-application-id',
          status: 'approved',
        });
      })
    );
    
    render(<LandlordApplications />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Click approve button
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/application approved/i)).toBeInTheDocument();
      expect(screen.getByText(/approved/i)).toBeInTheDocument();
    });
  });

  it('rejects an application', async () => {
    // Mock authenticated landlord
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'landlord');
    
    // Mock successful application rejection
    server.use(
      http.patch('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json({
          id: 'test-application-id',
          status: 'rejected',
        });
      })
    );
    
    render(<LandlordApplications />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Click reject button
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/application rejected/i)).toBeInTheDocument();
      expect(screen.getByText(/rejected/i)).toBeInTheDocument();
    });
  });

  it('shows income verification status', async () => {
    // Mock authenticated landlord
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'landlord');
    
    // Mock application with income information
    server.use(
      http.get('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json([
          {
            id: 'test-application-id',
            tenant_first_name: 'John',
            tenant_last_name: 'Doe',
            status: 'pending',
            monthly_income: 6000,
            property: {
              id: 'test-property-id',
              address: '123 Test St',
              city: 'Test City',
              rent_amount: 2000,
            },
          },
        ]);
      })
    );
    
    render(<LandlordApplications />);
    
    await waitFor(() => {
      // Income should be 3x rent amount (6000 >= 2000 * 3)
      expect(screen.getByText(/income verification: passed/i)).toBeInTheDocument();
    });
  });

  it('handles application review error', async () => {
    // Mock authenticated landlord
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'landlord');
    
    // Mock failed application update
    server.use(
      http.patch('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<LandlordApplications />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Try to approve application
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/error processing application/i)).toBeInTheDocument();
    });
  });
}); 