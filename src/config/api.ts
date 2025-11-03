export const API_CONFIG = {
  BASE_URL: 'https://api.dev.freshfuels.ca/v2',
  TIMEOUT: 30000,
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  // Authentication
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/refresh-token',

  // Cameras
  CAMERA: '/camera',
  CAMERAS: '/cameras',

  // Events
  EVENT: '/event',
  EVENTS: '/events',
  FETCH_STORE_EVENT_RECORDS: '/fetch-store-event-records',

  // Locations
  CAMERA_LOCATION: '/camera-location',
  CAMERA_LOCATIONS: '/camera-locations',
  FETCH_STORE_PLAYBACKS: '/fetch-store-playbacks',
};
