import httpClient from "@/services/api/HttpClient";

export interface AdminAppointmentInterface {
  id: string;
  clientId: string;
  clientFirstName?: string;
  clientLastName?: string;
  lawyerId: string;
  lawyerFirstName?: string;
  lawyerLastName?: string;
  slotId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: number;
  status: number;
  createdAt: string;
}

export interface AppointmentsReceivedStats {
  total: number;
  pending: number;
  awaitingAdminApproval: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  meta: AppointmentsReceivedStats;
}

export interface GetAllAppointmentsParams {
  Page?: number;
  PageSize?: number;
  SearchTerm?: string;
  Status?: number;
  SortDescending?: boolean;
}

class AppointmentsService {
  async getAllAdminAppointments(params: GetAllAppointmentsParams) {
    const response = await httpClient.get<{ data: PaginatedResult<AdminAppointmentInterface> }>("/Appointments/admin", {
      params,
    });
    return response.data;
  }

  async approveAppointment(id: string) {
    const response = await httpClient.put(`/Appointments/admin/${id}/approve`);
    return response.data;
  }

  async rejectAppointment(id: string) {
    const response = await httpClient.put(`/Appointments/admin/${id}/reject`);
    return response.data;
  }
}

export default new AppointmentsService();
