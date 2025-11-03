# Camera Security API Setup - Complete

All Camera Security API services have been successfully created and are ready to use!

## Created Files

### 1. Type Definitions
**[src/types/camera.ts](src/types/camera.ts)**
- `Camera` - Camera entity type
- `CameraCreateRequest` / `CameraUpdateRequest` - Request types
- `Event` - Event entity type
- `EventCreateRequest` / `EventUpdateRequest` - Request types
- `CameraLocation` - Location entity type
- `CameraLocationCreate` / `CameraLocationUpdate` - Request types
- `PaginatedResponse<T>` - Generic pagination response
- `PaginationParams` - Pagination query parameters
- Event record and playback types

### 2. API Services

**[src/services/cameraService.ts](src/services/cameraService.ts)**
```typescript
// Available methods:
- createCamera(data)
- getCamera(cameraId)
- updateCamera(cameraId, data)
- deleteCamera(cameraId)
- getCameras(params)
- getCamerasByLocation(locationId, params)
```

**[src/services/eventService.ts](src/services/eventService.ts)**
```typescript
// Available methods:
- createEvent(data)
- getEvent(eventId)
- updateEvent(eventId, data)
- deleteEvent(eventId)
- getEvents(params)
- getEventsByCamera(cameraId, params)
- fetchAndStoreEventRecords(data)
- getEventsByDateRange(startDate, endDate, params)
- getEventsByLocation(locationId, params)
```

**[src/services/locationService.ts](src/services/locationService.ts)**
```typescript
// Available methods:
- createLocation(data)
- getLocation(locationId)
- updateLocation(locationId, data)
- deleteLocation(locationId)
- getLocations(params)
- fetchAndStorePlaybacks(locationId)
- searchLocations(searchTerm, params)
```

### 3. API Client & Utilities

**[src/utils/apiClient.ts](src/utils/apiClient.ts)**
- Generic HTTP client with authentication
- Automatic token injection from AsyncStorage
- Handles GET, POST, PUT, DELETE
- Error handling and response parsing

**[src/utils/errorHandler.ts](src/utils/errorHandler.ts)**
- `ApiError` interface
- `NetworkError` class
- `handleApiError(error)` - Error normalization
- `getErrorMessage(error)` - Extract user-friendly messages

### 4. Custom Hooks

**[src/hooks/useApi.ts](src/hooks/useApi.ts)**
Hook for single API calls with state management:
```typescript
const { data, loading, error, execute, reset } = useApi(apiFunction);
```

**[src/hooks/usePagination.ts](src/hooks/usePagination.ts)**
Hook for paginated lists with infinite scroll:
```typescript
const {
  items,
  page,
  hasMore,
  loadMore,
  refresh,
  loading,
  error
} = usePagination(fetchFunction, pageSize);
```

### 5. Configuration

**[src/config/api.ts](src/config/api.ts)** - Updated with all endpoints
**[src/services/index.ts](src/services/index.ts)** - Service exports

---

## Quick Usage Examples

### Example 1: Fetch Cameras for a Location
```typescript
import { cameraService } from './services';

// In your component
const fetchCameras = async () => {
  try {
    const response = await cameraService.getCamerasByLocation(1, {
      paged: true,
      page: 0,
      size: 20
    });
    console.log('Cameras:', response.content);
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
  }
};
```

### Example 2: Using Hooks for Event List
```typescript
import { usePagination } from './hooks';
import { eventService } from './services';

function EventsScreen() {
  const {
    items: events,
    loading,
    hasMore,
    loadMore,
    refresh
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

### Example 3: Create Event
```typescript
import { eventService } from './services';

const createNewEvent = async () => {
  try {
    const event = await eventService.createEvent({
      camera_id: 123,
      event_type: 'motion_detected',
      event_timestamp: new Date().toISOString(),
      event_description: 'Motion detected at front door'
    });
    console.log('Event created:', event);
  } catch (error) {
    console.error('Failed to create event:', error);
  }
};
```

---

## API Endpoints Coverage

### Cameras
- ✅ POST `/v2/camera` - Create camera
- ✅ GET `/v2/camera/{id}` - Get camera
- ✅ PUT `/v2/camera/{id}` - Update camera
- ✅ DELETE `/v2/camera/{id}` - Delete camera
- ✅ GET `/v2/cameras` - List cameras

### Events
- ✅ POST `/v2/event` - Create event
- ✅ GET `/v2/event/{id}` - Get event
- ✅ PUT `/v2/event/{id}` - Update event
- ✅ DELETE `/v2/event/{id}` - Delete event
- ✅ GET `/v2/events` - List events
- ✅ POST `/v2/fetch-store-event-records` - Fetch event records

### Locations
- ✅ POST `/v2/camera-location` - Create location
- ✅ GET `/v2/camera-location/{id}` - Get location
- ✅ PUT `/v2/camera-location/{id}` - Update location
- ✅ DELETE `/v2/camera-location/{id}` - Delete location
- ✅ GET `/v2/camera-locations` - List locations
- ✅ POST `/v2/fetch-store-playbacks` - Fetch playbacks

---

## Next Steps

1. **Review** [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed usage
2. **Implement screens** using the mockups in [mockups/](mockups/) folder
3. **Test API calls** with your authentication token
4. **Add state management** (Redux/Context) if needed
5. **Implement offline support** with AsyncStorage caching

---

## Available Mockups to Implement

Based on your mockups folder:
- ✅ `loginscreen.png` - Already implemented
- 📋 `live.png` - Live camera view
- 📋 `locations.png` - Locations list
- 📋 `events.png` - Events list
- 📋 `entryexit.png` - Entry/Exit logs
- 📋 `actions.png` - Actions/Settings

Which screen would you like to implement next?
