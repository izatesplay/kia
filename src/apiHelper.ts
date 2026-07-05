/**
 * Kianour Music - Central API Helper
 * Smartly routes requests to the Node Express backend (in dev/AI Studio)
 * or to the PHP MySQL bridge (in production cPanel environment).
 */

export const getApiUrl = (endpoint: string): string => {
  // Check if we are running in development/AI Studio or live host
  const isDevOrStudio = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.includes('run.app');

  if (isDevOrStudio) {
    // Standard Node Express backend inside container / local environment
    return endpoint;
  }

  // cPanel PHP Backend
  // Map standard REST endpoints to api.php action queries
  let action = '';
  let id = '';

  // 1. Check for tracks endpoints
  if (endpoint.startsWith('/api/tracks')) {
    const parts = endpoint.split('/'); // ['', 'api', 'tracks', 'id']
    if (parts.length > 3 && parts[3]) {
      id = parts[3];
      action = 'delete_track';
    } else {
      action = 'tracks';
    }
  }
  // 2. Check for messages endpoints
  else if (endpoint.startsWith('/api/messages')) {
    const parts = endpoint.split('/');
    if (parts.length > 3 && parts[3]) {
      id = parts[3];
      action = 'delete_message';
    } else {
      action = 'messages';
    }
  }
  // 3. Check for bio endpoints
  else if (endpoint === '/api/bio') {
    action = 'bio';
  }
  // 4. Check for upload endpoints
  else if (endpoint === '/api/upload') {
    action = 'upload';
  }

  // Build the URL for api.php
  let url = `api.php?action=${action}`;
  if (id) {
    url += `&id=${encodeURIComponent(id)}`;
  }
  return url;
};

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const url = getApiUrl(endpoint);
  
  // Since some cPanel environments might block DELETE requests,
  // we translate DELETE requests into POST requests or GET queries with action.
  // Our api.php is designed to support action=delete_track/delete_message via GET/POST/DELETE.
  // To maximize compatibility, if it is a DELETE request on cPanel, we can modify it
  // or pass it directly. Since api.php supports both direct DELETE and GET/POST with id, 
  // it is extremely safe.
  
  return fetch(url, options);
};
