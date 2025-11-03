import apiClient from '../utils/apiClient';
import {
  CameraLocation,
  CameraLocationResponse,
  PaginationParams,
  PaginatedResponse,
} from '../types/camera';

/**
 * Location Service - Read-Only
 * This service provides view-only access to camera locations
 */
class LocationService {
  /**
   * Get location by ID
   * GET /v2/camera-location/{location_id}
   */
  async getLocation(locationId: number): Promise<CameraLocationResponse> {
    return apiClient.get<CameraLocationResponse>(`/camera-location/${locationId}`);
  }

  /**
   * Get list of locations with pagination
   * GET /v2/camera-locations
   */
  async getLocations(params?: PaginationParams): Promise<PaginatedResponse<CameraLocation>> {
    return apiClient.get<PaginatedResponse<CameraLocation>>('/camera-locations', params);
  }

  /**
   * Fetch and store playbacks for a location from camera system
   * POST /v2/fetch-store-playbacks
   * Note: This fetches playback videos from the camera hardware and syncs to the database
   */
  async fetchAndStorePlaybacks(locationId: number): Promise<void> {
    return apiClient.post<void>('/fetch-store-playbacks', undefined, { location_id: locationId });
  }

  /**
   * Search locations by name or code
   * GET /v2/camera-locations?filter=location_name:like:{term},location_code:like:{term}
   */
  async searchLocations(searchTerm: string, params?: PaginationParams): Promise<PaginatedResponse<CameraLocation>> {
    return apiClient.get<PaginatedResponse<CameraLocation>>('/camera-locations', {
      ...params,
      filter: `location_name:like:${searchTerm},location_code:like:${searchTerm}`,
    });
  }

  /**
   * Get locations by city
   * GET /v2/camera-locations?filter=location_city:{city}
   */
  async getLocationsByCity(city: string, params?: PaginationParams): Promise<PaginatedResponse<CameraLocation>> {
    return apiClient.get<PaginatedResponse<CameraLocation>>('/camera-locations', {
      ...params,
      filter: `location_city:${city}`,
    });
  }

  /**
   * Get locations by state
   * GET /v2/camera-locations?filter=location_state:{state}
   */
  async getLocationsByState(state: string, params?: PaginationParams): Promise<PaginatedResponse<CameraLocation>> {
    return apiClient.get<PaginatedResponse<CameraLocation>>('/camera-locations', {
      ...params,
      filter: `location_state:${state}`,
    });
  }
}

export default new LocationService();
