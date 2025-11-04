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
  event_camera?: string; // Camera name
  event_location?: string; // Location name
  location_id?: number; // Location ID
  event_tag?: string; // Event tag
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
  ycl_id: number;
  ycl_code: string;
  ycl_name: string;
  ycl_type?: string;
  ycl_description?: string;
  ycl_address?: string;
  ycl_city?: string;
  ycl_province?: string;
  ycl_postal_code?: string;
  ycl_caller_id?: string;
  ycl_cameras?: string;
  ycl_company?: number;
  ycl_events_enabled?: boolean;
  ycl_entry_logging?: boolean;
  status: boolean;
  created_date: string;
  modified_date: string;
  ycl_contacts?: {
    primary?: {
      phone?: string;
      email?: string;
    };
    secondary?: {
      phone?: string;
      email?: string;
    } | null;
  } | null;
  camera_details?: Array<{
    id: number;
    name: string;
  }>;
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
  // Spring HATEOAS format (_embedded.content)
  _embedded?: {
    content?: T[];
  };

  // Direct content array
  content?: T[];

  // Pagination metadata (can be nested in 'page' object or at root level)
  page?: {
    size?: number;
    total_elements?: number;
    totalElements?: number;
    total_pages?: number;
    totalPages?: number;
    number?: number;
  };

  // Root level pagination metadata (alternative format)
  totalElements?: number;
  total_elements?: number;
  totalPages?: number;
  total_pages?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;

  // Alternative data formats
  data?: T[] | { content?: T[] };
  total?: number;

  // Allow any additional fields from API
  [key: string]: any;
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

// Visitor Log Types (Entry/Exit)
// Based on actual API response from /v2/yard-visitor-log
export interface VisitorLog {
  id: number;
  capture_type?: 'MANUAL' | 'AUTO';
  access_type?: 'ENTRY' | 'EXIT';
  operator_type?: string;
  driver?: number | null;
  driver_type?: string | null;
  external_driver_name?: string | null;
  driver_license_no?: string | null;
  driver_email?: string | null;
  visitor_phone_number?: string | null;
  visitor_company?: string | null;
  visitor_purpose?: string | null;
  license_image?: string | null;
  license_plate?: string | null;
  capture_time: number; // Unix timestamp in milliseconds
  camera?: any;
  image?: string | null;
  vehicle_make?: string | null;
  vehicle_model?: string | null;
  vehicle_color?: string | null;
  truck?: string | null;
  trailer?: string | null;
  trailer_plate?: string | null;
  vehicle_info?: string | null; // TRUCK, CAR, etc
  safety_vest?: string | null;
  damages?: string | null;
  note?: string | null;
}

export interface VisitorLogResponse extends VisitorLog {}
