// lib/tabUtils.ts - Utilities for managing tabs and cross-tab communication
import { Platform } from 'react-native';

/**
 * Attempts to close the current browser tab
 * @param fallbackUrl Optional fallback URL to navigate to if tab closing fails
 * @returns {boolean} Whether the tab was successfully closed
 */
export const closeCurrentTab = (fallbackUrl?: string): boolean => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }
  
  try {
    // Try to close the tab
    window.close();
    
    // Check if the tab was closed (window.closed will be true in a closed window)
    // This check runs after a short delay because window.close() is asynchronous
    setTimeout(() => {
      if (!window.closed && fallbackUrl) {
        // If the tab wasn't closed and a fallback URL was provided, navigate to it
        window.location.href = fallbackUrl;
      }
    }, 300);
    
    return true;
  } catch (err) {
    console.error('Error closing tab:', err);
    
    // Navigate to fallback URL if provided
    if (fallbackUrl) {
      window.location.href = fallbackUrl;
    }
    
    return false;
  }
};

/**
 * Opens a URL in the same tab or in a new tab
 * @param url The URL to open
 * @param openInNewTab Whether to open in a new tab
 */
export const openUrl = (url: string, openInNewTab: boolean = false): void => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }
  
  try {
    if (openInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  } catch (err) {
    console.error('Error opening URL:', err);
  }
};

/**
 * Sends a message to the opener window (if one exists)
 * @param message The message to send
 * @returns {boolean} Whether the message was sent successfully
 */
export const sendMessageToOpener = (message: any): boolean => {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.opener) {
    return false;
  }
  
  try {
    // Send message to the opener window
    window.opener.postMessage(message, '*');
    return true;
  } catch (err) {
    console.error('Error sending message to opener:', err);
    return false;
  }
};

/**
 * Checks if the current window was opened by another window
 * @returns {boolean} Whether the current window has an opener
 */
export const hasOpener = (): boolean => {
  return Platform.OS === 'web' && typeof window !== 'undefined' && !!window.opener;
};

/**
 * Sets up a listener for cross-tab messages
 * @param messageType The type of message to listen for
 * @param callback The callback to invoke when a message is received
 * @returns A cleanup function to remove the listener
 */
export const listenForTabMessages = (
  messageType: string, 
  callback: (data: any) => void
): () => void => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return () => {};
  }
  
  const handleMessage = (event: MessageEvent) => {
    // Validate the message origin (for security)
    if (event.origin !== window.location.origin) {
      return;
    }
    
    // Check if this is the type of message we're listening for
    if (event.data && event.data.type === messageType) {
      callback(event.data);
    }
  };
  
  // Add the event listener
  window.addEventListener('message', handleMessage);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}; 