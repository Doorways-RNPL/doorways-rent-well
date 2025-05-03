import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/AuthProvider';
import { UserRoleProvider } from '@/components/UserRoleProvider';
import { Toaster } from 'sonner';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  
  const testQueryClient = createTestQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UserRoleProvider>
            {children}
          </UserRoleProvider>
        </AuthProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 