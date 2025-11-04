import apiClient from '../utils/apiClient';
import {
  VisitorLog,
  VisitorLogResponse,
  PaginationParams,
  PaginatedResponse,
} from '../types/camera';

/**
 * Visitor Log Service - Read-Only
 * This service provides view-only access to visitor entry/exit logs
 */
class VisitorLogService {
  /**
   * Get visitor log by ID
   * GET /v2/yard-visitor-log/{log_id}
   */
  async getVisitorLog(logId: number): Promise<VisitorLogResponse> {
    return apiClient.get<VisitorLogResponse>(`/yard-visitor-log/${logId}`);
  }

  /**
   * Get list of visitor logs with pagination
   * GET /v2/yard-visitor-log
   * Default sort: capture_time,desc (most recent first)
   */
  async getVisitorLogs(params?: PaginationParams): Promise<PaginatedResponse<VisitorLog>> {
    const defaultParams = {
      sort: 'capture_time,desc',
      ...params,
    };
    return apiClient.get<PaginatedResponse<VisitorLog>>('/yard-visitor-log', defaultParams);
  }

  /**
   * Get visitor logs by location
   * GET /v2/yard-visitor-log?filter=location_id:{locationId}
   */
  async getVisitorLogsByLocation(
    locationId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<VisitorLog>> {
    return apiClient.get<PaginatedResponse<VisitorLog>>('/yard-visitor-log', {
      ...params,
      filter: `location_id:${locationId}`,
      sort: 'capture_time,desc',
    });
  }

  /**
   * Get visitor logs by entry type
   * GET /v2/yard-visitor-log?filter=entry_type:{entryType}
   */
  async getVisitorLogsByType(
    entryType: 'entry' | 'exit',
    params?: PaginationParams
  ): Promise<PaginatedResponse<VisitorLog>> {
    return apiClient.get<PaginatedResponse<VisitorLog>>('/yard-visitor-log', {
      ...params,
      filter: `entry_type:${entryType}`,
      sort: 'capture_time,desc',
    });
  }

  /**
   * Get visitor logs by date range
   * GET /v2/yard-visitor-log?filter=capture_time:gte:{start},capture_time:lte:{end}
   */
  async getVisitorLogsByDateRange(
    startDate: string,
    endDate: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<VisitorLog>> {
    return apiClient.get<PaginatedResponse<VisitorLog>>('/yard-visitor-log', {
      ...params,
      filter: `capture_time:gte:${startDate},capture_time:lte:${endDate}`,
      sort: 'capture_time,desc',
    });
  }

  /**
   * Get visitor logs by visitor type
   * GET /v2/yard-visitor-log?filter=visitor_type:{visitorType}
   */
  async getVisitorLogsByVisitorType(
    visitorType: 'person' | 'vehicle' | 'unknown',
    params?: PaginationParams
  ): Promise<PaginatedResponse<VisitorLog>> {
    return apiClient.get<PaginatedResponse<VisitorLog>>('/yard-visitor-log', {
      ...params,
      filter: `visitor_type:${visitorType}`,
      sort: 'capture_time,desc',
    });
  }

  /**
   * Search visitor logs by name
   * GET /v2/yard-visitor-log?filter=visitor_name:like:{keyword}
   */
  async searchVisitorLogs(
    keyword: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<VisitorLog>> {
    return apiClient.get<PaginatedResponse<VisitorLog>>('/yard-visitor-log', {
      ...params,
      filter: `visitor_name:like:${keyword}`,
      sort: 'capture_time,desc',
    });
  }
}

export default new VisitorLogService();
