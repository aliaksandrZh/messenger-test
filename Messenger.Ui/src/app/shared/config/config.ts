// Placeholder runtime config until environment files / auth are introduced.
// Adjust these to match where you run the .NET API and SignalR hub locally.
export const API_BASE_URL = 'http://localhost:5099';
export const SIGNALR_HUB_URL = 'http://localhost:5101/hubs/chat';

// Placeholder current-user id (no auth yet). Used as the userId for SignalR JoinChatAsync.
export const CURRENT_USER_ID = '00000000-0000-0000-0000-000000000001';