# Camera Security API Documentation - View-Only Access

**SecureView Mobile App - Read-Only API Reference**

This app provides **view-only access** to camera security data. No create, update, or delete operations are available.

---

## Authentication

All endpoints require Bearer token authentication.

**Login Endpoint:**
```
POST /v2/login
```

**Headers for All Requests:**
```
Authorization: Bearer {your_token}
Content-Type: application/json
Accept: application/json
```

---

## Camera Services (View-Only)

### 1. Get Camera by ID
Retrieves details for a specific camera.

**Endpoint:** `GET /v2/camera/{camera_id}`

**Usage:**
```typescript
import { cameraService } from './services';

const camera = await cameraService.getCamera(123);
```

**Response:**
```typescript
{
  camera_id: number;
  location_id: number;
  camera_location: string;
  camera_company: string;
  camera_stream_url: string;
  camera_mac: string;
  status: boolean;
  created_date: string;
  modified_date: string;
}
```

---

### 2. Get All Cameras
Retrieves paginated list of cameras.

**Endpoint:** `GET /v2/cameras`

**Query Parameters:**
- `paged` (boolean): Enable pagination (default: true)
- `page` (number): Page number (0-indexed)
- `size` (number): Items per page
- `sort` (string): Sort field (e.g., "camera_id,desc")
- `filter` (string): Filter criteria

**Usage:**
```typescript
// Get all cameras with pagination
const cameras = await cameraService.getCameras({
  paged: true,
  page: 0,
  size: 20,
  sort: "camera_id,desc"
});
```

---

### 3. Get Cameras by Location
Filter cameras by location ID.

**Endpoint:** `GET /v2/cameras?filter=location_id:{locationId}`

**Usage:**
```typescript
const locationCameras = await cameraService.getCamerasByLocation(1, {
  paged: true,
  page: 0,
  size: 10
});
```

---

### 4. Search Cameras
Search cameras by location, company, or MAC address.

**Endpoint:** `GET /v2/cameras?filter=camera_location:like:{keyword}`

**Usage:**
```typescript
const searchResults = await cameraService.searchCameras("front entrance");
```

---

## Event Services (View-Only)

### 1. Get Event by ID
Retrieves a specific event.

**Endpoint:** `GET /v2/event/{event_id}`

**Usage:**
```typescript
import { eventService } from './services';

const event = await eventService.getEvent(456);
```

**Response:**
```typescript
{
  event_id: number;
  camera_id: number;
  event_type: string;
  event_description: string;
  event_timestamp: string;
  event_video_url?: string;
  event_image_url?: string;
  event_metadata?: object;
  status: boolean;
  created_date: string;
}
```

---

### 2. Get All Events
Retrieves paginated list of events.

**Endpoint:** `GET /v2/events`

**Usage:**
```typescript
const events = await eventService.getEvents({
  paged: true,
  page: 0,
  size: 20,
  sort: "event_timestamp,desc"
});
```

---

### 3. Get Events by Camera
Filter events by camera ID.

**Endpoint:** `GET /v2/events?filter=camera_id:{cameraId}`

**Usage:**
```typescript
const cameraEvents = await eventService.getEventsByCamera(123, {
  paged: true,
  size: 20
});
```

---

### 4. Get Events by Date Range
Filter events by timestamp range.

**Endpoint:** `GET /v2/events?filter=event_timestamp:gte:{start},event_timestamp:lte:{end}`

**Usage:**
```typescript
const rangeEvents = await eventService.getEventsByDateRange(
  "2024-01-01T00:00:00Z",
  "2024-01-31T23:59:59Z",
  { paged: true, size: 50 }
);
```

---

### 5. Get Events by Location
Filter events by location ID.

**Endpoint:** `GET /v2/events?filter=location_id:{locationId}`

**Usage:**
```typescript
const locationEvents = await eventService.getEventsByLocation(1);
```

---

### 6. Get Events by Type
Filter events by event type.

**Endpoint:** `GET /v2/events?filter=event_type:{eventType}`

**Usage:**
```typescript
const motionEvents = await eventService.getEventsByType("motion_detected");
```

---

### 7. Search Events
Search events by description.

**Endpoint:** `GET /v2/events?filter=event_description:like:{keyword}`

**Usage:**
```typescript
const searchResults = await eventService.searchEvents("motion");
```

---

### 8. Fetch Event Records from Camera
Syncs events from camera hardware to database.

**Endpoint:** `POST /v2/fetch-store-event-records`

**Request Body:**
```typescript
{
  location_id: number;
  start_time: string;    // ISO 8601 format
  end_time: string;      // ISO 8601 format
  camera_id?: number;
}
```

**Usage:**
```typescript
const records = await eventService.fetchAndStoreEventRecords({
  location_id: 1,
  start_time: "2024-01-01T00:00:00Z",
  end_time: "2024-01-31T23:59:59Z",
  camera_id: 123
});
```

---

## Location Services (View-Only)

### 1. Get Location by ID
Retrieves a specific location.

**Endpoint:** `GET /v2/camera-location/{location_id}`

**Usage:**
```typescript
import { locationService } from './services';

const location = await locationService.getLocation(1);
```

**Response:**
```typescript
{
  location_id: number;
  location_code: string;
  location_name: string;
  location_address: string;
  location_city: string;
  location_state: string;
  location_zip: string;
  location_contact_name: string;
  location_contact_phone: string;
  location_contact_email: string;
  status: boolean;
  created_date: string;
}
```

---

### 2. Get All Locations
Retrieves paginated list of locations.

**Endpoint:** `GET /v2/camera-locations`

**Usage:**
```typescript
const locations = await locationService.getLocations({
  paged: true,
  page: 0,
  size: 20,
  sort: "location_name,asc"
});
```

---

### 3. Search Locations
Search locations by name or code.

**Endpoint:** `GET /v2/camera-locations?filter=location_name:like:{term}`

**Usage:**
```typescript
const results = await locationService.searchLocations("office");
```

---

### 4. Get Locations by City
Filter locations by city.

**Endpoint:** `GET /v2/camera-locations?filter=location_city:{city}`

**Usage:**
```typescript
const cityLocations = await locationService.getLocationsByCity("New York");
```

---

### 5. Get Locations by State
Filter locations by state.

**Endpoint:** `GET /v2/camera-locations?filter=location_state:{state}`

**Usage:**
```typescript
const stateLocations = await locationService.getLocationsByState("NY");
```

---

### 6. Fetch Playbacks from Camera
Syncs playback videos from camera hardware.

**Endpoint:** `POST /v2/fetch-store-playbacks?location_id={locationId}`

**Usage:**
```typescript
await locationService.fetchAndStorePlaybacks(1);
```

---

## Custom Hooks

### useApi Hook
For single API calls with state management.

**Usage:**
```typescript
import { useApi } from './hooks';
import { cameraService } from './services';

function CameraDetailScreen({ cameraId }) {
  const { data, loading, error, execute } = useApi(cameraService.getCamera);

  useEffect(() => {
    execute(cameraId);
  }, [cameraId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  return <CameraDetails camera={data} />;
}
```

---

### usePagination Hook
For paginated lists with infinite scroll.

**Usage:**
```typescript
import { usePagination } from './hooks';
import { eventService } from './services';

function EventListScreen() {
  const {
    items: events,
    loading,
    hasMore,
    loadMore,
    refresh,
  } = usePagination(eventService.getEvents, 20);

  return (
    <FlatList
      data={events}
      onEndReached={loadMore}
      onRefresh={refresh}
      refreshing={loading}
      renderItem={({ item }) => <EventCard event={item} />}
    />
  );
}
```

---

## Pagination Response Structure

All list endpoints return paginated responses:

```typescript
{
  content: T[];              // Array of items
  totalElements: number;     // Total count
  totalPages: number;        // Total pages
  size: number;              // Page size
  number: number;            // Current page (0-indexed)
  first: boolean;            // Is first page
  last: boolean;             // Is last page
  empty: boolean;            // Is empty
}
```

---

## Error Handling

All services throw errors with standardized format:

```typescript
try {
  const camera = await cameraService.getCamera(123);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // Show user-friendly error message
  }
}
```

---

## Filter Syntax

The API supports advanced filtering:

| Filter Type | Syntax | Example |
|------------|--------|---------|
| Equals | `field:value` | `location_id:1` |
| Like (contains) | `field:like:value` | `camera_location:like:entrance` |
| Greater than or equal | `field:gte:value` | `event_timestamp:gte:2024-01-01` |
| Less than or equal | `field:lte:value` | `event_timestamp:lte:2024-01-31` |
| Multiple filters | `field1:value1,field2:value2` | `location_id:1,status:true` |

---

## Best Practices

1. **Use Pagination** - Always use pagination for lists
2. **Cache Data** - Store frequently accessed data locally
3. **Handle Errors** - Always wrap API calls in try/catch
4. **Loading States** - Show loading indicators during API calls
5. **Offline Support** - Implement offline-first architecture
6. **Token Management** - Refresh tokens before expiry
7. **Type Safety** - Use TypeScript types for all responses

---

## Next Steps

1. Implement screens based on mockups
2. Add pull-to-refresh for all lists
3. Implement search functionality
4. Add filters and sorting options
5. Set up offline caching
6. Add real-time updates if needed
