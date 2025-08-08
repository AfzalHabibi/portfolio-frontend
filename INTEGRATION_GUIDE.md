# Portfolio Frontend - Backend Integration Guide

This frontend has been integrated with the backend API. Here's what has been implemented:

## Features Implemented

### Authentication System
- JWT-based authentication
- Login/logout functionality
- Protected admin routes
- Automatic token management

### API Integration
- Axios HTTP client with interceptors
- Automatic error handling
- Base URL configuration via environment variables

### Redux Store Updates
- Async thunks for API calls
- Proper loading states
- Error handling
- Removed hardcoded data

### CRUD Operations for Projects
- Fetch all projects from backend
- Create new projects with file uploads
- Update existing projects
- Delete projects with file cleanup
- Individual project fetching

### Site Settings Management
- Fetch site settings from backend
- Update site settings
- Fallback to default settings if backend unavailable

### File Upload Support
- Main image upload for projects
- Multiple additional images
- Video file uploads
- Form data handling with multipart/form-data

## Key Files Created/Updated

### Services
- `src/services/api.ts` - Axios configuration
- `src/services/authService.ts` - Authentication API calls
- `src/services/projectService.ts` - Project CRUD operations
- `src/services/siteSettingsService.ts` - Site settings management

### Redux Slices
- `src/store/slices/authSlice.ts` - Authentication state management
- `src/store/slices/projectSlice.ts` - Updated with async thunks
- `src/store/slices/settingsSlice.ts` - Updated with async thunks

### Custom Hooks
- `src/hooks/useApi.ts` - Easy-to-use hooks for API operations

### Admin Pages
- `src/pages/admin/Login.tsx` - Admin login page
- `src/pages/admin/Dashboard.tsx` - Admin dashboard
- `src/pages/admin/Projects.tsx` - Project management with full CRUD

### Updated Public Pages
- All public pages now use real backend data
- Loading states integrated
- Error handling implemented

## Environment Configuration

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

## Backend Requirements

Make sure your backend is running on `http://localhost:5000` with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (JSON)
- `POST /api/projects/with-files` - Create project with files
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Site Settings
- `GET /api/site-settings` - Get site settings
- `PUT /api/site-settings` - Update site settings

## Usage

### Starting the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Access the application:
- Public portfolio: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

### Admin Access

1. Navigate to `/admin/login`
2. Enter your credentials (register first if needed via backend)
3. Access dashboard and project management

### Project Management

From the admin panel, you can:
- View all projects
- Create new projects with file uploads
- Edit existing projects
- Delete projects
- Upload main images, additional images, and videos

## Error Handling

- Network errors are automatically handled
- 401 responses redirect to login
- Error messages are displayed in the UI
- Loading states prevent multiple submissions

## File Uploads

The system supports:
- Main project image (required)
- Additional project images (optional)
- Project videos (optional)
- Automatic file URL generation from backend

## Security Features

- JWT tokens stored in localStorage
- Automatic token injection in requests
- Protected routes for admin functionality
- Logout on token expiration

## Data Flow

1. **Authentication**: Login stores JWT token
2. **Data Loading**: Hooks automatically fetch data on component mount
3. **CRUD Operations**: All operations go through Redux thunks
4. **Error Handling**: Errors are captured and displayed to users
5. **Loading States**: UI shows loading indicators during API calls

## Notes

- The frontend falls back to default settings if backend is unavailable
- All hardcoded data has been removed
- File uploads use FormData for multipart requests
- MongoDB ObjectIds are converted to 'id' field for frontend consistency
