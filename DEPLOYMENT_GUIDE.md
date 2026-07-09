# Weather App - Deployment & Testing Guide

## Summary of Fixes Applied

### 1. **Docker Configuration Issues** ✅
- **Problem**: 503 Service Unavailable error when deploying backend
- **Root Cause**: Incorrect defaults in docker-entrypoint.sh for local docker-compose
- **Fix**: 
  - Updated `docker-entrypoint.sh` to use `server` (docker-compose service name) as default backend host
  - Changed default BASE_PREFIX from `/reshma` to empty (for local deployment)
  - Added proper X-Forwarded headers to nginx proxy configuration

### 2. **Frontend-Backend Connection** ✅
- **Problem**: Frontend couldn't connect to backend API
- **Root Cause**: Nginx proxy configuration had hardcoded placeholders
- **Fixes**:
  - Updated `client/nginx.conf` with better proxy setup
  - Added missing proxy headers (X-Forwarded-For, X-Forwarded-Proto)
  - Fixed API endpoint routing in nginx

### 3. **Backend Configuration** ✅
- **Problem**: Duplicate entry points and confusing package.json setup
- **Fixes**:
  - Removed confusing "main" field from package.json
  - Cleaned up package.json structure
  - Verified correct entry point: `controllers/index.js`
  - Added test scripts to package.json

### 4. **Testing Setup** ✅
- **Backend Tests**: 11 tests passing ✅
  - Express server health check
  - API endpoints validation
  - CORS headers verification
  - Weather controller error handling
  
- **Frontend Tests**: 12 tests passing ✅
  - Home component rendering
  - Search functionality
  - Error handling
  - API service mocking
  - User interactions (Enter key, button click)

## Local Development Setup

### Prerequisites
- Node.js v20+ installed
- npm v10+
- Docker & Docker Compose (for containerized deployment)

### Installation & Testing

#### Backend Setup
```bash
cd server/weather-server
npm install
npm test           # Run all tests
npm run dev       # Run with auto-reload (requires .env file)
npm start         # Run production server
```

#### Frontend Setup
```bash
cd client
npm install
npm test          # Run all tests (non-interactive)
npm start         # Run dev server
npm run build     # Create production build
```

## Environment Configuration

### Backend (.env file)
Create `server/weather-server/.env`:
```
PORT=4000
HOST=0.0.0.0
OPENWEATHER_API_KEY=a1de432e2caf7acb40565f970d4484a6
```

## Docker Deployment

### Using Docker Compose (Recommended for local testing)

```bash
# Build all images
docker-compose build

# Run all services
docker-compose up

# Stop services
docker-compose down
```

**Expected behavior:**
- Backend API runs at: http://localhost:4000/api/v1
- Swagger UI available at: http://localhost:4000/api-docs
- Frontend available at: http://localhost (proxied through nginx)

### Configuration for Different Environments

#### Local Docker Compose (default)
- BACKEND_HOST: `server` (docker-compose service name)
- BASE_PREFIX: `` (empty for root path)

#### AWS ALB Shared Deployment
Set environment variables when building:
```bash
BACKEND_HOST=backend-service-dns-name.com
BASE_PREFIX=/reshma
docker-compose build
```

## API Endpoints

### Current Weather
```
GET /api/v1/weather/current?city=London
```

Response:
```json
{
  "city": "London",
  "temperature": 15,
  "feels_like": 13,
  "humidity": 80,
  "description": "cloudy",
  "icon": "04d",
  "wind_speed": 10
}
```

### 5-Day Forecast
```
GET /api/v1/weather/forecast?city=London
```

### Health Check
```
GET /health
```

### Swagger Documentation
```
GET /api-docs
```

## Testing

### Backend Tests (Jest)
- **Test Files**: `controllers/*.test.js`
- **Coverage**: 68.25% overall
- **Command**: `npm test`

### Frontend Tests (React Testing Library)
- **Test Files**: `src/**/*.test.js`
- **Command**: `npm test -- --watchAll=false`
- **All tests passing**: ✅ 12 tests

## Troubleshooting

### 503 Service Unavailable
1. Verify backend is running: `docker-compose logs server`
2. Check .env file has OPENWEATHER_API_KEY
3. Verify nginx proxy configuration points to correct backend host
4. Check network connectivity between containers

### Frontend Not Loading
1. Verify nginx container is running: `docker-compose logs client`
2. Check nginx config placeholders are replaced correctly
3. Ensure React build exists: `ls client/build/index.html`

### API Connection Issues
1. Check frontend logs in browser console
2. Verify API base URL is correct (should be `/api/v1`)
3. Test API directly: `curl http://localhost:4000/api/v1/weather/current?city=London`

## Production Deployment Checklist

- [ ] Set OPENWEATHER_API_KEY environment variable
- [ ] Configure BACKEND_HOST for your environment
- [ ] Run all tests: `npm test` (both frontend and backend)
- [ ] Build frontend: `npm run build`
- [ ] Test Docker build: `docker-compose build`
- [ ] Test Docker run: `docker-compose up` for 30 seconds
- [ ] Verify /health endpoint responds with 200 OK
- [ ] Test /api/v1/weather/current?city=London endpoint
- [ ] Verify frontend loads and can make API calls
- [ ] Check Swagger docs at /api-docs

## Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP (Port 80)
       ▼
┌──────────────┐
│   Nginx      │
│ (React SPA)  │
└──────┬───────┘
       │ /api/* → proxy
       ▼
┌──────────────┐
│   Express    │
│   Backend    │ (Port 4000)
└──────┬───────┘
       │ HTTP
       ▼
┌──────────────────┐
│ OpenWeather API  │
│ (External)       │
└──────────────────┘
```

## Key Files Modified

1. **docker-entrypoint.sh** - Fixed docker-compose defaults
2. **client/nginx.conf** - Updated proxy configuration
3. **server/weather-server/package.json** - Added test scripts
4. **controllers/*.test.js** - Added comprehensive tests
5. **client/src/**/*.test.js** - Added frontend tests

## Next Steps

1. Deploy using Docker Compose locally to verify all fixes
2. Test all endpoints with provided curl commands
3. Deploy to AWS ECS/ALB when ready
4. Monitor logs for any remaining issues
5. Set up CI/CD pipeline (optional)

## Support & Questions

For issues with specific components:
- Backend errors: Check `docker-compose logs server`
- Frontend errors: Check browser console and `docker-compose logs client`
- Nginx errors: Check `docker-compose logs client` (nginx section)
