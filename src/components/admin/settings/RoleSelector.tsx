'use client';

import { Shield, Users, Calculator } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Role = 'admin' | 'reservation_staff' | 'account_staff';

interface RoleSelectorProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  disabled?: boolean;
}

const roleConfig = {
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  reservation_staff: {
    label: 'Reservation',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  account_staff: {
    label: 'Account',
    icon: Calculator,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
};

export function RoleSelector({ currentRole, onRoleChange, disabled }: RoleSelectorProps) {
  const config = roleConfig[currentRole];
  const Icon = config.icon;

  return (
    <Select value={currentRole} onValueChange={(v) => v && onRoleChange(v)} disabled={disabled}>
      <SelectTrigger className="h-8 w-32 text-xs">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Admin</span>
          </div>
        </SelectItem>
        <SelectItem value="reservation_staff">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Reservation</span>
          </div>
        </SelectItem>
        <SelectItem value="account_staff">
          <div className="flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5 text-green-600" />
            <span>Account</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
