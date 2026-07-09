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
  
  // Check if we are in production / cPanel environment
  const isDevOrStudio = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.includes('run.app');

  let finalOptions = options ? { ...options } : {};

  // If we are in cPanel production and the method is DELETE, convert it to POST
  // since cPanel firewalls often block DELETE requests but allow POST with URL params
  if (!isDevOrStudio && finalOptions.method === 'DELETE') {
    finalOptions.method = 'POST';
  }
  
  return fetch(url, finalOptions);
};
