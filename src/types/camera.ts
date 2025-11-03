// Camera Types
export interface Camera {
  camera_id: number;
  location_id: number;
  camera_location?: string;
  camera_company?: string;
  camera_installation?: string;
  camera_last_maintenance?: string;
  camera_stream_url?: string;
  camera_mac?: string;
  status: boolean;
  created_by?: string;
  modified_by?: string;
  created_date: string;
  modified_date: string;
}

export interface CameraCreateRequest {
  location_id: number;
  camera_location?: string;
  camera_company?: string;
  camera_installation?: string;
  camera_last_maintenance?: string;
  camera_stream_url?: string;
  camera_mac?: string;
  status?: boolean;
  created_by?: string;
  modified_by?: string;
}

export interface CameraUpdateRequest extends CameraCreateRequest {}

export interface CameraResponse extends Camera {}

// Event Types
export interface Event {
  event_id: number;
  camera_id: number;
  event_type?: string;
  event_description?: string;
  event_timestamp: string;
  event_video_url?: string;
  event_image_url?: string;
  event_metadata?: Record<string, any>;
  status: boolean;
  created_by?: string;
  modified_by?: string;
  created_date: string;
  modified_date: string;
}

export interface EventCreateRequest {
  camera_id: number;
  event_type?: string;
  event_description?: string;
  event_timestamp: string;
  event_video_url?: string;
  event_image_url?: string;
  event_metadata?: Record<string, any>;
  status?: boolean;
  created_by?: string;
  modified_by?: string;
}

export interface EventUpdateRequest extends Partial<EventCreateRequest> {}

export interface EventResponse extends Event {}

// Location Types
export interface CameraLocation {
  location_id: number;
  location_code: string;
  location_name: string;
  location_address?: string;
  location_city?: string;
  location_state?: string;
  location_zip?: string;
  location_country?: string;
  location_contact_name?: string;
  location_contact_phone?: string;
  location_contact_email?: string;
  status: boolean;
  created_by?: string;
  modified_by?: string;
  created_date: string;
  modified_date: string;
}

export interface CameraLocationCreate {
  location_code: string;
  location_name: string;
  location_address?: string;
  location_city?: string;
  location_state?: string;
  location_zip?: string;
  location_country?: string;
  location_contact_name?: string;
  location_contact_phone?: string;
  location_contact_email?: string;
  status?: boolean;
  created_by?: string;
  modified_by?: string;
}

export interface CameraLocationUpdate extends Partial<CameraLocationCreate> {}

export interface CameraLocationResponse extends CameraLocation {}

// Pagination Types
export interface PaginationParams {
  paged?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Event Record Types
export interface CameraEventRecordRequest {
  location_id: number;
  start_time: string;
  end_time: string;
  camera_id?: number;
}

export interface CameraEventRecord {
  event_id: number;
  camera_id: number;
  event_type: string;
  event_timestamp: string;
  event_video_url?: string;
  event_image_url?: string;
}

export interface CameraEventRecordResponse {
  events: CameraEventRecord[];
  total_count: number;
}

// Playback Types
export interface FetchPlaybacksRequest {
  location_id: number;
}
