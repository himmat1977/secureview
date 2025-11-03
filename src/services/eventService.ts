import apiClient from '../utils/apiClient';
import {
  Event,
  EventResponse,
  PaginationParams,
  PaginatedResponse,
  CameraEventRecordRequest,
  CameraEventRecordResponse,
} from '../types/camera';

/**
 * Event Service - Read-Only
 * This service provides view-only access to camera events
 */
class EventService {
  /**
   * Get event by ID
   * GET /v2/event/{event_id}
   */
  async getEvent(eventId: number): Promise<EventResponse> {
    return apiClient.get<EventResponse>(`/event/${eventId}`);
  }

  /**
   * Get list of events with pagination
   * GET /v2/events
   */
  async getEvents(params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    return apiClient.get<PaginatedResponse<Event>>('/events', params);
  }

  /**
   * Get events by camera
   * GET /v2/events?filter=camera_id:{cameraId}
   */
  async getEventsByCamera(cameraId: number, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    return apiClient.get<PaginatedResponse<Event>>('/events', {
      ...params,
      filter: `camera_id:${cameraId}`,
    });
  }

  /**
   * Fetch and store event records from camera system
   * POST /v2/fetch-store-event-records
   * Note: This fetches events from the camera hardware and syncs to the database
   */
  async fetchAndStoreEventRecords(data: CameraEventRecordRequest): Promise<CameraEventRecordResponse> {
    return apiClient.post<CameraEventRecordResponse>('/fetch-store-event-records', data);
  }

  /**
   * Get events by date range
   * GET /v2/events?filter=event_timestamp:gte:{start},event_timestamp:lte:{end}
   */
  async getEventsByDateRange(
    startDate: string,
    endDate: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Event>> {
    return apiClient.get<PaginatedResponse<Event>>('/events', {
      ...params,
      filter: `event_timestamp:gte:${startDate},event_timestamp:lte:${endDate}`,
    });
  }

  /**
   * Get events by location
   * GET /v2/events?filter=location_id:{locationId}
   */
  async getEventsByLocation(locationId: number, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    return apiClient.get<PaginatedResponse<Event>>('/events', {
      ...params,
      filter: `location_id:${locationId}`,
    });
  }

  /**
   * Get events by type
   * GET /v2/events?filter=event_type:{eventType}
   */
  async getEventsByType(eventType: string, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    return apiClient.get<PaginatedResponse<Event>>('/events', {
      ...params,
      filter: `event_type:${eventType}`,
    });
  }

  /**
   * Search events by description
   * GET /v2/events?filter=event_description:like:{keyword}
   */
  async searchEvents(keyword: string, params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    return apiClient.get<PaginatedResponse<Event>>('/events', {
      ...params,
      filter: `event_description:like:${keyword}`,
    });
  }
}

export default new EventService();
