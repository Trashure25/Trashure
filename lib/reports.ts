// lib/reports.ts
// Reporting service for managing user reports and trust scores

export interface Report {
  id: string
  reporterId: string
  reportedId: string
  reason: string
  description?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
  updatedAt: string
  reporter?: {
    id: string
    firstName: string
    lastName: string
    username: string
  }
  reported?: {
    id: string
    firstName: string
    lastName: string
    username: string
  }
}

export interface CreateReportData {
  reportedId: string
  reason: string
  description?: string
}

export interface TrustScoreUpdate {
  userId: string
  newScore: number
  reason: string
}

export const reportsService = {
  async createReport(data: CreateReportData): Promise<Report> {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create report');
    }

    return response.json();
  },

  async getUserReports(userId: string): Promise<Report[]> {
    const response = await fetch(`/api/reports?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user reports');
    }

    const data = await response.json();
    return data.reports || data;
  },

  async getReportsAgainstUser(userId: string): Promise<Report[]> {
    const response = await fetch(`/api/reports/against/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports against user');
    }

    const data = await response.json();
    return data.reports || data;
  },

  async checkIfReported(reporterId: string, reportedId: string): Promise<boolean> {
    const response = await fetch(`/api/reports/check?reporterId=${reporterId}&reportedId=${reportedId}`);
    
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.hasReported;
  },

  async updateTrustScore(update: TrustScoreUpdate): Promise<boolean> {
    const response = await fetch('/api/users/trust-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      throw new Error('Failed to update trust score');
    }

    return true;
  },

  // Trust score calculation logic
  calculateTrustScorePenalty(reportCount: number, recentReports: number): number {
    // Base penalty for each report
    let penalty = reportCount * 5;
    
    // Additional penalty for recent reports (within last 30 days)
    penalty += recentReports * 10;
    
    // Cap the penalty to prevent score from going below 0
    return Math.min(penalty, 50);
  },

  // Trust score increase logic
  calculateTrustScoreIncrease(successfulTrades: number, creditUsage: number): number {
    // Increase based on successful trades
    let increase = successfulTrades * 2;
    
    // Increase based on credit usage (every 100 credits spent = +1 point)
    increase += Math.floor(creditUsage / 100);
    
    // Cap the increase to prevent score from going above 100
    return Math.min(increase, 30);
  }
}; 