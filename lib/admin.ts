// lib/admin.ts
// Admin service for managing reports and user actions

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: string
  trustScore: number
  isBanned: boolean
  banReason?: string
  createdAt: string
  listingsCount: number
  reportsReceived: number
}

export interface AdminReport {
  id: string
  reporterId: string
  reportedId: string
  reason: string
  description?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  adminNotes?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  reporter: {
    id: string
    firstName: string
    lastName: string
    username: string
  }
  reported: {
    id: string
    firstName: string
    lastName: string
    username: string
    trustScore: number
    isBanned: boolean
  }
  reviewer?: {
    id: string
    firstName: string
    lastName: string
    username: string
  }
}

export interface ReviewReportData {
  reportId: string
  action: 'approve' | 'dismiss'
  adminNotes?: string
  banUser?: boolean
  banReason?: string
}

export interface BanUserData {
  userId: string
  reason: string
  duration?: number // days, undefined = permanent
}

export const adminService = {
  // Check if user is admin
  async checkAdminStatus(): Promise<boolean> {
    const response = await fetch('/api/admin/check');
    if (!response.ok) return false;
    const data = await response.json();
    return data.isAdmin;
  },

  // Get all pending reports
  async getPendingReports(): Promise<AdminReport[]> {
    const response = await fetch('/api/admin/reports/pending');
    if (!response.ok) {
      throw new Error('Failed to fetch pending reports');
    }
    const data = await response.json();
    return data.reports || data;
  },

  // Get all reports
  async getAllReports(page: number = 1, limit: number = 20): Promise<{ reports: AdminReport[], pagination: any }> {
    const response = await fetch(`/api/admin/reports?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    return response.json();
  },

  // Review a report
  async reviewReport(data: ReviewReportData): Promise<boolean> {
    const response = await fetch('/api/admin/reports/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to review report');
    }

    return true;
  },

  // Ban a user
  async banUser(data: BanUserData): Promise<boolean> {
    const response = await fetch('/api/admin/users/ban', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to ban user');
    }

    return true;
  },

  // Unban a user
  async unbanUser(userId: string): Promise<boolean> {
    const response = await fetch(`/api/admin/users/${userId}/unban`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to unban user');
    }

    return true;
  },

  // Get user details for admin
  async getUserDetails(userId: string): Promise<AdminUser> {
    const response = await fetch(`/api/admin/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    return response.json();
  },

  // Get all users (admin list)
  async getAllUsers(page: number = 1, limit: number = 20): Promise<{ users: AdminUser[], pagination: any }> {
    const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  // Update user trust score
  async updateUserTrustScore(userId: string, newScore: number, reason: string): Promise<boolean> {
    const response = await fetch('/api/admin/users/trust-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newScore, reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to update trust score');
    }

    return true;
  },

  // Get admin dashboard stats
  async getDashboardStats(): Promise<{
    totalUsers: number
    totalReports: number
    pendingReports: number
    bannedUsers: number
    recentReports: number
  }> {
    const response = await fetch('/api/admin/dashboard/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
  }
}; 