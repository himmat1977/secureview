import apiClient from '../utils/apiClient';
import {
  Camera,
  CameraResponse,
  PaginationParams,
  PaginatedResponse,
} from '../types/camera';

/**
 * Camera Service - Read-Only
 * This service provides view-only access to camera data
 */
class CameraService {
  /**
   * Get camera by ID
   * GET /v2/camera/{camera_id}
   */
  async getCamera(cameraId: number): Promise<CameraResponse> {
    return apiClient.get<CameraResponse>(`/camera/${cameraId}`);
  }

  /**
   * Get list of cameras with pagination
   * GET /v2/cameras
   */
  async getCameras(params?: PaginationParams): Promise<PaginatedResponse<Camera>> {
    return apiClient.get<PaginatedResponse<Camera>>('/cameras', params);
  }

  /**
   * Get cameras by location
   * GET /v2/cameras?filter=location_id:{locationId}
   */
  async getCamerasByLocation(locationId: number, params?: PaginationParams): Promise<PaginatedResponse<Camera>> {
    return apiClient.get<PaginatedResponse<Camera>>('/cameras', {
      ...params,
      filter: `location_id:${locationId}`,
    });
  }

  /**
   * Search cameras by keyword
   * Searches in camera location, company, and MAC address
   */
  async searchCameras(keyword: string, params?: PaginationParams): Promise<PaginatedResponse<Camera>> {
    return apiClient.get<PaginatedResponse<Camera>>('/cameras', {
      ...params,
      filter: `camera_location:like:${keyword},camera_company:like:${keyword},camera_mac:like:${keyword}`,
    });
  }
}

export default new CameraService();
