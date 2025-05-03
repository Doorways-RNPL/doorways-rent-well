import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import AdminDashboard from './AdminDashboard';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { supabase } from '@/lib/supabase';

describe('AdminDashboard', () => {
  beforeEach(() => {
    // Reset the application state before each test
    localStorage.clear();
  });

  it('redirects to auth page if not authenticated', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/please sign in first/i)).toBeInTheDocument();
    });
  });

  it('loads pending applications', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock pending applications
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
              landlord_id: 'test-landlord-id',
            },
          },
        ]);
      })
    );
    
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });

  it('loads approved applications', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock approved applications
    server.use(
      http.get('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json([
          {
            id: 'test-application-id',
            tenant_first_name: 'John',
            tenant_last_name: 'Doe',
            status: 'approved',
            monthly_income: 6000,
            property: {
              id: 'test-property-id',
              address: '123 Test St',
              city: 'Test City',
              rent_amount: 2000,
              landlord_id: 'test-landlord-id',
            },
          },
        ]);
      })
    );
    
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/approved/i)).toBeInTheDocument();
    });
  });

  it('generates offer for approved application', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock successful offer generation
    server.use(
      http.post('https://your-supabase-url.supabase.co/rest/v1/offers', () => {
        return HttpResponse.json({
          id: 'test-offer-id',
          status: 'pending',
          property_id: 'test-property-id',
          tenant_application_id: 'test-application-id',
        });
      })
    );
    
    render(<AdminDashboard />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Click generate offer button
    fireEvent.click(screen.getByRole('button', { name: /generate offer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/offer generated successfully/i)).toBeInTheDocument();
    });
  });

  it('views application details', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    render(<AdminDashboard />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Click view details button
    fireEvent.click(screen.getByRole('button', { name: /view details/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/application details/i)).toBeInTheDocument();
      expect(screen.getByText(/monthly income/i)).toBeInTheDocument();
      expect(screen.getByText(/property details/i)).toBeInTheDocument();
    });
  });

  it('filters applications by status', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    render(<AdminDashboard />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Select filter
    fireEvent.click(screen.getByRole('combobox', { name: /filter/i }));
    fireEvent.click(screen.getByText(/approved/i));
    
    await waitFor(() => {
      expect(screen.getByText(/approved applications/i)).toBeInTheDocument();
    });
  });

  it('searches applications', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    render(<AdminDashboard />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Enter search term
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'John' },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.queryByText(/jane doe/i)).not.toBeInTheDocument();
    });
  });

  it('handles offer generation error', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock failed offer generation
    server.use(
      http.post('https://your-supabase-url.supabase.co/rest/v1/offers', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<AdminDashboard />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Try to generate offer
    fireEvent.click(screen.getByRole('button', { name: /generate offer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/error generating offer/i)).toBeInTheDocument();
    });
  });

  it('changes application status successfully', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock successful status change
    server.use(
      http.patch('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json({
          id: 'test-application-id',
          status: 'approved',
        });
      })
    );
    
    render(<AdminDashboard />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Change status
    fireEvent.click(screen.getByRole('button', { name: /change status/i }));
    fireEvent.click(screen.getByText(/approve/i));
    
    await waitFor(() => {
      expect(screen.getByText(/status updated successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/approved/i)).toBeInTheDocument();
    });
  });

  it('handles application status change error', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock failed status change
    server.use(
      http.patch('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<AdminDashboard />);
    
    // Wait for application to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Try to change status
    fireEvent.click(screen.getByRole('button', { name: /change status/i }));
    fireEvent.click(screen.getByText(/approve/i));
    
    await waitFor(() => {
      expect(screen.getByText(/error updating status/i)).toBeInTheDocument();
    });
  });

  it('updates UI on realtime application changes', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    render(<AdminDashboard />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Simulate realtime update
    const newApplication = {
      id: 'new-application-id',
      tenant_first_name: 'Jane',
      tenant_last_name: 'Smith',
      status: 'pending',
      monthly_income: 5000,
      property: {
        id: 'test-property-id',
        address: '456 Test St',
        city: 'Test City',
        rent_amount: 1500,
        landlord_id: 'test-landlord-id',
      },
    };
    
    // Trigger realtime update
    server.use(
      http.get('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json([newApplication]);
      })
    );
    
    await waitFor(() => {
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });
  });

  it('handles empty search results', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    render(<AdminDashboard />);
    
    // Wait for applications to load
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
    
    // Enter non-matching search term
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'NonExistentName' },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/no applications found/i)).toBeInTheDocument();
    });
  });

  it('handles network errors during data fetch', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock network error
    server.use(
      http.get('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading applications/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching data', async () => {
    // Mock authenticated admin
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'admin');
    
    // Mock delayed response
    server.use(
      http.get('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json([]);
      })
    );
    
    render(<AdminDashboard />);
    
    // Check for loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
}); 