export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  department?: string;
  designation?: string;
  avatar?: string;
  joinDate?: string;
  phone?: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveType   = 'CASUAL' | 'SICK' | 'EARNED' | 'MATERNITY' | 'UNPAID';

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export interface LeaveBalance {
  leaveType: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface Department {
  id: number;
  name: string;
  headName?: string;
  employeeCount: number;
}