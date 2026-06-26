import httpClient, { type ApiResponse } from "@/services/api/httpClient";

export interface EarningDto {
  id: number;
  appointmentId: string;
  lawyerId: string;
  lawyerName: string;
  clientName: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: string;
  createdAt: string;
  payrollId: number | null;
}

export interface PayrollDto {
  id: number;
  lawyerId: string;
  lawyerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

export interface PayrollDetailsDto extends PayrollDto {
  earnings: EarningDto[];
}

export const adminFinancialService = {
  async getAllEarnings(): Promise<EarningDto[]> {
    const response = await httpClient.get<ApiResponse<EarningDto[]>>("/Earnings");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch earnings");
    }
    return response.data.data ?? [];
  },

  async getPayrolls(): Promise<PayrollDto[]> {
    const response = await httpClient.get<ApiResponse<PayrollDto[]>>("/Payrolls");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch payrolls");
    }
    return response.data.data ?? [];
  },

  async getPayrollDetails(id: number): Promise<PayrollDetailsDto> {
    const response = await httpClient.get<ApiResponse<PayrollDetailsDto>>(`/Payrolls/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch payroll details");
    }
    return response.data.data as PayrollDetailsDto;
  },

  async generatePayroll(data: { lawyerId: string; fromDate?: string; toDate?: string }): Promise<PayrollDetailsDto> {
    const response = await httpClient.post<ApiResponse<PayrollDetailsDto>>("/Payrolls", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to generate payroll");
    }
    return response.data.data as PayrollDetailsDto;
  },

  async markPayrollPaid(id: number): Promise<void> {
    await httpClient.put<ApiResponse<any>>(`/Payrolls/${id}/mark-paid`);
  },

  async markPayrollFailed(id: number): Promise<void> {
    await httpClient.put<ApiResponse<any>>(`/Payrolls/${id}/mark-failed`);
  }
};

export default adminFinancialService;
