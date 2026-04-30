'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserPlus, Loader2, Shield, Mail, MoreHorizontal, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoleSelector } from './RoleSelector';
import { createUserAction, deleteUserAction, updateRoleAction } from '@/app/admin/settings/actions';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'reservation_staff' | 'account_staff';
  avatar_url: string | null;
  is_active: boolean;
  phone: string | null;
  created_at: string;
}

export function UserManagementTable() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'reservation_staff' | 'account_staff'>('reservation_staff');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUserEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setCreating(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('email', newUserEmail);
    formData.append('role', newUserRole);

    const result = await createUserAction(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || 'User created successfully!');
      setNewUserEmail('');
      setNewUserRole('reservation_staff');
      setShowAddUser(false);
      fetchUsers();
    }

    setCreating(false);
  };

  const handleDeleteUser = async (id: string, email: string) => {
    const result = await deleteUserAction(id, email);

    if (result.error) {
      toast.error(`Failed to delete user: ${result.error}`);
    } else {
      toast.success('User deleted successfully');
      fetchUsers();
    }
  };

  const handleRoleChange = async (id: string, newRole: 'admin' | 'reservation_staff' | 'account_staff') => {
    const result = await updateRoleAction(id, newRole);

    if (result.error) {
      toast.error(`Failed to update role: ${result.error}`);
    } else {
      toast.success('Role updated successfully');
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    }
  };

  const roleLabels = {
    admin: 'Admin',
    reservation_staff: 'Reservation',
    account_staff: 'Account',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add User Form */}
      {showAddUser ? (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Add New User</h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="new_user_email" className="text-[10px]">Email</Label>
              <Input
                id="new_user_email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="new_user_role" className="text-[10px]">Role</Label>
              <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as any)}>
                <SelectTrigger id="new_user_role" className="h-8 text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reservation_staff">Reservation Staff</SelectItem>
                  <SelectItem value="account_staff">Account Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <form action={handleCreateUser}>
              <Button
                type="submit"
                disabled={creating || !newUserEmail}
                className="gap-1.5 h-8 px-3 text-xs"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Create User
                  </>
                )}
              </Button>
            </form>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowAddUser(false);
                setMessage(null);
              }}
              className="h-8 px-3 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => setShowAddUser(true)}
            className="gap-1.5 h-9 px-4 text-xs font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-[10px] font-semibold text-muted-foreground">User</TableHead>
              <TableHead className="text-[10px] font-semibold text-muted-foreground">Role</TableHead>
              <TableHead className="text-[10px] font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="text-[10px] font-semibold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-primary">
                        {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{user.full_name || user.email}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <RoleSelector
                    currentRole={user.role}
                    onRoleChange={(newRole) => handleRoleChange(user.id, newRole as any)}
                  />
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium uppercase ${
                    user.is_active
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-red-500/10 text-red-600'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent transition-colors outline-hidden">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert('Password reset will be sent to their email')}>
                        <Key className="mr-2 h-3.5 w-3.5" />
                        Send Password Reset
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.length === 0 && (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        )}
      </div>

      {/* Role Legend */}
      <div className="bg-muted/30 border border-border rounded-lg p-3">
        <p className="text-[10px] text-muted-foreground mb-2">Role Permissions:</p>
        <ul className="space-y-1 text-[10px] text-muted-foreground">
          <li><strong className="text-foreground">Admin:</strong> Full access to all features</li>
          <li><strong className="text-foreground">Reservation:</strong> Itineraries, bookings, blog management</li>
          <li><strong className="text-foreground">Account:</strong> Invoices, payments, settings access</li>
        </ul>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-[10px] text-blue-900 font-medium mb-1">User Creation Process:</p>
        <ol className="text-[10px] text-blue-800 space-y-1 list-decimal list-inside">
          <li>Add user with their email</li>
          <li>User will receive email to confirm their account</li>
          <li>User can use &quot;Forgot Password&quot; to set their password</li>
          <li>After setup, user can log in with their credentials</li>
        </ol>
      </div>
    </div>
  );
}
