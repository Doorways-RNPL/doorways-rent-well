import { useState } from 'react';
import { resetToLandlord, createAdminUser, getCurrentUserId } from '@/utils/roleManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function RoleManager() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { toast } = useToast();

  const handleResetToLandlord = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast({
          title: "Error",
          description: "No user logged in",
          variant: "destructive"
        });
        return;
      }

      const result = await resetToLandlord(userId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Role reset to landlord successfully"
        });
        // Force reload to update role
        window.location.href = '/';
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reset role",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminEmail || !adminPassword) {
      toast({
        title: "Error",
        description: "Please provide both email and password",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await createAdminUser(adminEmail, adminPassword);
      if (result.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully"
        });
        setAdminEmail('');
        setAdminPassword('');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create admin user",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Role Manager</h1>
      
      <div className="space-y-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Reset Current User to Landlord</h2>
          <Button onClick={handleResetToLandlord}>
            Reset to Landlord
          </Button>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Create Admin User</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Email</label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Admin Password</label>
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleCreateAdmin}>
              Create Admin User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 