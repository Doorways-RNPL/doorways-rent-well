import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import TenantApplication from './TenantApplication';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('TenantApplication', () => {
  beforeEach(() => {
    // Reset the application state before each test
    localStorage.clear();
  });

  it('redirects to auth page if not authenticated', async () => {
    render(<TenantApplication />);
    
    await waitFor(() => {
      expect(screen.getByText(/please sign in first/i)).toBeInTheDocument();
    });
  });

  it('loads available properties', async () => {
    // Mock authenticated user
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'tenant');
    
    render(<TenantApplication />);
    
    await waitFor(() => {
      expect(screen.getByText(/123 Test St/i)).toBeInTheDocument();
      expect(screen.getByText(/Test City/i)).toBeInTheDocument();
    });
  });

  it('validates required fields in each step', async () => {
    // Mock authenticated user
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'tenant');
    
    render(<TenantApplication />);
    
    // Try to proceed without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/please fill out all required fields/i)).toBeInTheDocument();
    });
  });

  it('completes the application process', async () => {
    // Mock authenticated user
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'tenant');
    
    // Mock successful application submission
    server.use(
      http.post('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return HttpResponse.json({
          id: 'new-application-id',
          status: 'pending',
        });
      })
    );
    
    render(<TenantApplication />);
    
    // Step 1: Personal Information
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/id number/i), {
      target: { value: '123456789' },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 2: Current Residence
    fireEvent.change(screen.getByLabelText(/current address/i), {
      target: { value: '456 Current St' },
    });
    fireEvent.change(screen.getByLabelText(/current city/i), {
      target: { value: 'Current City' },
    });
    fireEvent.change(screen.getByLabelText(/move in date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 3: Employment Information
    fireEvent.change(screen.getByLabelText(/employer name/i), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: 'Software Engineer' },
    });
    fireEvent.change(screen.getByLabelText(/monthly income/i), {
      target: { value: '6000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 4: Property Selection
    fireEvent.click(screen.getByText(/123 Test St/i));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 5: Document Upload
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/id document/i), {
      target: { files: [file] },
    });
    fireEvent.change(screen.getByLabelText(/proof of income/i), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 6: Terms and Conditions
    fireEvent.click(screen.getByLabelText(/agree to terms/i));
    fireEvent.click(screen.getByLabelText(/agree to credit check/i));
    fireEvent.click(screen.getByLabelText(/agree to background check/i));
    
    // Submit application
    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/application submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('handles application submission error', async () => {
    // Mock authenticated user
    localStorage.setItem('user', JSON.stringify({ id: 'test-user-id' }));
    localStorage.setItem('role', 'tenant');
    
    // Mock failed application submission
    server.use(
      http.post('https://your-supabase-url.supabase.co/rest/v1/tenant_applications', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    render(<TenantApplication />);
    
    // Fill in required fields and submit
    // ... (similar to the successful submission test)
    
    await waitFor(() => {
      expect(screen.getByText(/error submitting application/i)).toBeInTheDocument();
    });
  });
}); 