# Privacy API Reference

This document provides developers with detailed information about the privacy-related APIs available in Macro Browser, allowing for privacy-respecting application development while maintaining compatibility with existing web standards.

## Privacy Context API

The Privacy Context API provides information about the current privacy context and allows developers to adapt their applications accordingly.

```javascript
// Access the privacy context
const privacyContext = window.macroPrivacy;
```

### Properties and Methods

```typescript
interface MacroPrivacyContext {
  // Privacy Mode Status
  isPrivacyModeEnabled: boolean;            // Whether privacy mode is active
  trackingProtectionLevel: TrackingProtectionLevel; // Current protection level
  
  // Privacy Features
  isFingerPrintingProtectionEnabled: boolean;  // Anti-fingerprinting active
  isTrackingProtectionEnabled: boolean;        // Tracker blocking active
  isAdBlockingEnabled: boolean;                // Ad blocking active
  cookiePolicy: CookiePolicy;                  // Current cookie policy
  
  // Methods
  getPrivacyReport(): Promise<PrivacyReport>;  // Get site privacy report
  requestPermission(permission: PrivacyPermission): Promise<boolean>; // Request privacy exception
}

// Types
type TrackingProtectionLevel = 'standard' | 'strict' | 'custom';
type CookiePolicy = 'accept-all' | 'block-third-party' | 'block-all' | 'ask';
type PrivacyPermission = 'storage' | 'camera' | 'microphone' | 'location' | 'notifications';

interface PrivacyReport {
  trackersBlocked: number;
  fingerPrintingAttemptsBlocked: number;
  cookiesBlocked: number;
  advertisingEntities: string[];
  analyticsEntities: string[];
  socialEntities: string[];
  contentEntities: string[];
  cryptoMiners: string[];
}
```

### Usage Example

```javascript
// Check privacy context and adapt functionality
async function initializeApp() {
  // Feature detection for Macro Browser
  if (typeof window.macroPrivacy !== 'undefined') {
    // We're in Macro Browser
    const privacyContext = window.macroPrivacy;
    
    // Adapt to privacy settings
    if (privacyContext.isPrivacyModeEnabled) {
      // Use privacy-respecting functionality
      usePrivacyRespectingAnalytics();
      
      // Get privacy report for this site
      const report = await privacyContext.getPrivacyReport();
      console.log(`Blocked ${report.trackersBlocked} trackers`);
      
      // Request permission for specific functionality if needed
      if (needsLocalStorage) {
        const granted = await privacyContext.requestPermission('storage');
        if (granted) {
          // User approved storage use
          initializeStorage();
        } else {
          // Fallback to memory-only storage
          initializeMemoryStorage();
        }
      }
    } else {
      // Standard functionality
      initializeStandardFeatures();
    }
  } else {
    // Not Macro Browser, use standard initialization
    initializeStandardFeatures();
  }
}
```

## Storage Privacy API

The Storage Privacy API provides mechanisms for privacy-respecting storage options.

### Ephemeral Storage

```typescript
interface MacroEphemeralStorage {
  // Session-only storage that doesn't persist across browser sessions
  // Similar API to localStorage but nothing is written to disk
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
  
  // Export/import functionality for user-controlled persistence
  exportData(): Promise<string>; // Returns JSON string for user to save
  importData(jsonString: string): Promise<boolean>; // Import previously exported data
}
```

### Usage Example

```javascript
// Using ephemeral storage
function saveUserPreferences(preferences) {
  if (window.macroEphemeralStorage) {
    // Use ephemeral storage in Macro Browser
    try {
      window.macroEphemeralStorage.setItem(
        'userPreferences', 
        JSON.stringify(preferences)
      );
      
      // Optionally prompt user to export if important
      if (preferencesAreImportant) {
        promptUserToExport();
      }
    } catch (e) {
      console.error('Failed to save to ephemeral storage:', e);
    }
  } else if (localStorage) {
    // Fallback to localStorage in other browsers
    try {
      localStorage.setItem(
        'userPreferences', 
        JSON.stringify(preferences)
      );
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
}

// Prompt user to export data
async function promptUserToExport() {
  if (confirm('Would you like to save your preferences for future sessions?')) {
    try {
      const data = await window.macroEphemeralStorage.exportData();
      downloadAsFile(data, 'macro-preferences.json');
    } catch (e) {
      console.error('Failed to export data:', e);
    }
  }
}

// Helper to download data as a file
function downloadAsFile(data, filename) {
  const blob = new Blob([data], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

## Anti-Fingerprinting API

The Anti-Fingerprinting API allows developers to understand and work with Macro Browser's fingerprinting protections.

```typescript
interface MacroFingerprintProtection {
  // Check if a specific API is being protected/randomized
  isProtected(api: FingerprintingAPI): boolean;
  
  // Get information about the current protection
  getProtectionInfo(): FingerprintProtectionInfo;
  
  // Request temporary access to actual values for legitimate purposes
  requestTrueValues(api: FingerprintingAPI, reason: string): Promise<boolean>;
}

type FingerprintingAPI = 
  'canvas' | 'webgl' | 'audio' | 'client-rects' | 'fonts' | 
  'hardware-info' | 'device-memory' | 'user-agent';

interface FingerprintProtectionInfo {
  protectedAPIs: FingerprintingAPI[];
  activeProtections: {
    userAgent: boolean;
    screenResolution: boolean;
    hardwareConcurrency: boolean;
    deviceMemory: boolean;
    timezone: boolean;
    language: boolean;
    plugins: boolean;
    canvas: boolean;
    webGL: boolean;
    webRTC: boolean;
    audioContext: boolean;
    fontEnumeration: boolean;
  };
}
```

### Canvas Protection Example

```javascript
// Handle canvas fingerprinting protection
async function initializeCanvasFeatures() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Draw something
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);
  
  // Check if we're in Macro Browser
  if (window.macroFingerprintProtection) {
    // Check if canvas is being protected
    const isCanvasProtected = window.macroFingerprintProtection.isProtected('canvas');
    
    if (isCanvasProtected) {
      // Canvas values will be slightly randomized
      // For legitimate use cases, request true values
      if (isLegitimateUseCase) {
        const granted = await window.macroFingerprintProtection.requestTrueValues(
          'canvas',
          'Color calibration for image editing'
        );
        
        if (granted) {
          // Now canvas values will be accurate for this page
          // until navigation or page refresh
          console.log('Using true canvas values');
        } else {
          // User declined, use alternative approach
          console.log('Using protected canvas values');
          provideAlternativeExperience();
        }
      }
    }
  }
  
  // Continue with canvas operations
  // In Macro Browser, these might be slightly modified to prevent fingerprinting
  const imageData = ctx.getImageData(0, 0, 100, 100);
  processImageData(imageData);
}
```

## Content Blocking API

The Content Blocking API provides information about blocked content and allows for privacy-respecting fallbacks.

```typescript
interface MacroContentBlocking {
  // Get information about blocked resources
  getBlockedResources(): BlockedResourceInfo[];
  
  // Check if a specific URL or domain is blocked
  isResourceBlocked(url: string): boolean;
  
  // Event listener for when resources are blocked
  onResourceBlocked(callback: (info: BlockedResourceInfo) => void): void;
  
  // Remove event listener
  removeResourceBlockedListener(
    callback: (info: BlockedResourceInfo) => void
  ): void;
}

interface BlockedResourceInfo {
  url: string;
  type: ResourceType;
  reason: BlockReason;
  category: TrackerCategory | null;
}

type ResourceType = 
  'script' | 'image' | 'stylesheet' | 'font' | 'media' | 
  'xhr' | 'fetch' | 'websocket' | 'other';

type BlockReason = 
  'tracker' | 'ad' | 'cryptominer' | 'fingerprinter' | 
  'social' | 'cookieConsent' | 'userBlocked';

type TrackerCategory = 
  'advertising' | 'analytics' | 'social' | 'content' | 
  'cryptomining' | 'fingerprinting' | 'unknown';
```

### Usage Example

```javascript
// Handle blocked resources
function initializeTrackerFallbacks() {
  if (window.macroContentBlocking) {
    // Check currently blocked resources
    const blockedResources = window.macroContentBlocking.getBlockedResources();
    
    // Log blocked trackers
    console.log(`${blockedResources.length} resources blocked`);
    
    // Check if specific analytics script is blocked
    const isGABlocked = window.macroContentBlocking.isResourceBlocked(
      'https://www.google-analytics.com/analytics.js'
    );
    
    if (isGABlocked) {
      // Use privacy-friendly analytics alternative
      initializePrivacyAnalytics();
    }
    
    // Listen for future blocked resources
    window.macroContentBlocking.onResourceBlocked(handleBlockedResource);
  }
}

function handleBlockedResource(info) {
  console.log(`Resource blocked: ${info.url}`);
  
  // Provide alternative functionality based on type
  switch (info.type) {
    case 'script':
      if (info.category === 'social') {
        // Load privacy-friendly social sharing alternative
        loadPrivacySocialAlternative();
      }
      break;
    case 'media':
      // Provide fallback media player
      provideFallbackMediaPlayer();
      break;
  }
}
```

## Secure Communication API

The Secure Communication API provides enhanced security and privacy for network communications.

```typescript
interface MacroSecureComms {
  // Make fetch requests through Macro's secure channels
  secureFetch(url: string, options?: RequestInit): Promise<Response>;
  
  // Check if a connection is secure enough for sensitive data
  isConnectionSecure(url: string): Promise<SecurityAssessment>;
  
  // Get active VPN status
  getVPNStatus(): VPNStatus;
  
  // Request higher security for specific connections
  requestEnhancedSecurity(
    domain: string, 
    reason: string
  ): Promise<boolean>;
}

interface SecurityAssessment {
  isSecure: boolean;
  protocol: string;
  certificateInfo?: {
    issuer: string;
    validUntil: Date;
    isEV: boolean;
  };
  weaknesses: string[];
  recommendedAction?: string;
}

interface VPNStatus {
  enabled: boolean;
  country?: string;
  throughEncryptedNetwork: boolean;
  latency?: number; // in milliseconds
}
```

### Usage Example

```javascript
// Use secure communications
async function fetchSensitiveData(apiUrl, authToken) {
  if (window.macroSecureComms) {
    // Check connection security first
    const securityAssessment = await window.macroSecureComms.isConnectionSecure(apiUrl);
    
    if (!securityAssessment.isSecure) {
      // Connection might not be secure enough
      console.warn(
        `Security concerns: ${securityAssessment.weaknesses.join(', ')}`
      );
      
      if (securityAssessment.recommendedAction) {
        console.warn(`Recommended action: ${securityAssessment.recommendedAction}`);
      }
      
      // Request enhanced security
      const enhancedSecurityGranted = await window.macroSecureComms.requestEnhancedSecurity(
        new URL(apiUrl).hostname,
        'Handling financial data'
      );
      
      if (!enhancedSecurityGranted) {
        // User declined enhanced security
        if (!confirm('This connection may not be secure. Continue anyway?')) {
          throw new Error('User aborted insecure operation');
        }
      }
    }
    
    // Get VPN status
    const vpnStatus = window.macroSecureComms.getVPNStatus();
    if (vpnStatus.enabled) {
      console.log('Using secure VPN connection');
    }
    
    // Use secure fetch for sensitive operations
    try {
      return await window.macroSecureComms.secureFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ operation: 'getAccountDetails' })
      });
    } catch (error) {
      console.error('Secure fetch failed:', error);
      throw error;
    }
  } else {
    // Fallback to standard fetch with security checks
    return fetchWithSecurityChecks(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ operation: 'getAccountDetails' })
    });
  }
}

// Fallback for other browsers
async function fetchWithSecurityChecks(url, options) {
  // Basic security checks
  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS connections are allowed for sensitive operations');
  }
  
  // Proceed with standard fetch
  return fetch(url, options);
}
```

## Privacy Permissions API

The Privacy Permissions API allows developers to request privacy-related permissions.

```typescript
interface MacroPrivacyPermissions {
  // Current permissions
  getPermissions(): Promise<PermissionStatus[]>;
  
  // Request permission with reason
  requestPermission(
    permission: PrivacyPermissionType,
    reason: string,
    options?: PermissionOptions
  ): Promise<PermissionStatus>;
  
  // Revoke a previously granted permission
  revokePermission(permission: PrivacyPermissionType): Promise<boolean>;
  
  // Check if a permission is granted
  hasPermission(permission: PrivacyPermissionType): Promise<boolean>;
  
  // Listen for permission changes
  onPermissionChanged(
    callback: (status: PermissionStatus) => void
  ): void;
}

type PrivacyPermissionType = 
  'persistent-storage' | 'notifications' | 'geolocation' |
  'camera' | 'microphone' | 'background-sync' | 'clipboard-read' |
  'clipboard-write' | 'payment-handler' | 'idle-detection';

interface PermissionOptions {
  duration?: 'once' | 'session' | 'persistent'; // Default: session
  explicitUserActivation?: boolean; // Require user gesture
}

interface PermissionStatus {
  permission: PrivacyPermissionType;
  state: 'granted' | 'denied' | 'prompt';
  expiresAt?: Date; // For temporary permissions
}
```

### Usage Example

```javascript
// Request necessary permissions
async function setupApp() {
  if (window.macroPrivacyPermissions) {
    // Check if we already have permissions
    const hasStoragePermission = await window.macroPrivacyPermissions.hasPermission(
      'persistent-storage'
    );
    
    if (!hasStoragePermission) {
      // Request with reason and options
      const permissionStatus = await window.macroPrivacyPermissions.requestPermission(
        'persistent-storage',
        'To save your preferences between sessions',
        { duration: 'persistent' }
      );
      
      if (permissionStatus.state === 'granted') {
        // Permission granted, initialize storage
        initializeStorage();
      } else {
        // Permission denied, use in-memory alternative
        useMemoryStorage();
      }
    } else {
      // Already has permission
      initializeStorage();
    }
    
    // Listen for permission changes
    window.macroPrivacyPermissions.onPermissionChanged(handlePermissionChange);
  } else {
    // Standard browser, use regular approach
    initializeStorage();
  }
}

function handlePermissionChange(status) {
  console.log(`Permission ${status.permission} changed to ${status.state}`);
  
  if (status.permission === 'persistent-storage' && status.state !== 'granted') {
    // Storage permission was revoked
    switchToMemoryStorage();
  }
}
```

## Privacy-Aware Analytics API

The Privacy-Aware Analytics API provides a way to collect anonymous analytics while respecting user privacy.

```typescript
interface MacroPrivacyAnalytics {
  // Send anonymous event
  sendAnonymousEvent(
    eventName: string,
    properties?: Record<string, any>
  ): Promise<boolean>;
  
  // Get allowed analytics properties
  getAllowedProperties(): string[];
  
  // Get current anonymization level
  getAnonymizationLevel(): AnonymizationLevel;
}

type AnonymizationLevel = 'strict' | 'balanced' | 'minimal';
```

### Usage Example

```javascript
// Use privacy-aware analytics
async function trackPageView() {
  if (window.macroPrivacyAnalytics) {
    // Privacy-respecting analytics in Macro Browser
    
    // Check what properties are allowed
    const allowedProps = await window.macroPrivacyAnalytics.getAllowedProperties();
    console.log('Allowed properties:', allowedProps);
    
    // Get current anonymization level
    const anonymizationLevel = await window.macroPrivacyAnalytics.getAnonymizationLevel();
    
    // Prepare properties based on allowed list
    const properties = {
      pagePath: window.location.pathname,
      referrer: document.referrer,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      // No user identifiers or precise information
    };
    
    // Filter to only allowed properties
    const filteredProps = {};
    for (const prop of allowedProps) {
      if (properties[prop] !== undefined) {
        filteredProps[prop] = properties[prop];
      }
    }
    
    // Send event through privacy-aware system
    await window.macroPrivacyAnalytics.sendAnonymousEvent(
      'page_view',
      filteredProps
    );
  } else {
    // Regular analytics for other browsers
    trackPageViewRegular();
  }
}
```

## Best Practices

### Feature Detection

Always use feature detection instead of browser detection:

```javascript
// Good: Feature detection
if (window.macroPrivacy) {
  // Use Macro Browser privacy features
} else {
  // Use fallback approach
}

// Bad: Browser detection
if (navigator.userAgent.includes('MacroBrowser')) {
  // Unreliable and brittle
}
```

### Progressive Enhancement

Design for progressive enhancement to work across all browsers:

```javascript
// Start with core functionality that works everywhere
initializeBasicFunctionality();

// Enhance with Macro-specific features when available
if (window.macroPrivacy) {
  enhanceWithPrivacyFeatures();
}

if (window.macroEphemeralStorage) {
  enhanceWithEphemeralStorage();
}

if (window.macroFingerprintProtection) {
  enhanceWithFingerprintProtection();
}
```

### Provide Alternatives

Always provide privacy-respecting alternatives:

```javascript
function setupAnalytics() {
  if (window.macroPrivacyAnalytics) {
    // Use privacy-aware analytics
    initializeMacroAnalytics();
  } else if (isPrivacyFocusedBrowser()) {
    // For other privacy browsers
    initializeMinimalAnalytics();
  } else {
    // Standard analytics with opt-out
    initializeStandardAnalyticsWithOptOut();
  }
}
```

### Respect User Choices

Always respect user choices regarding privacy:

```javascript
async function checkTrackingConsent() {
  if (window.macroPrivacy) {
    // Respect Macro Browser settings automatically
    return !window.macroPrivacy.isTrackingProtectionEnabled;
  } else {
    // For other browsers, explicitly ask
    return await getUserConsentForTracking();
  }
}
```

## API Availability

Not all APIs are available in all browsing contexts:

| API | Normal Mode | Private Mode | Note |
|-----|-------------|--------------|------|
| Privacy Context | ✅ | ✅ | Always available |
| Ephemeral Storage | ✅ | ✅ | Always available |
| Anti-Fingerprinting | ✅ | ✅ | More restrictive in Private Mode |
| Content Blocking | ✅ | ✅ | More aggressive in Private Mode |
| Secure Communication | ✅ | ✅ | More restrictive in Private Mode |
| Privacy Permissions | ✅ | ⚠️ | Limited in Private Mode |
| Privacy Analytics | ✅ | ❌ | Not available in Private Mode |

## Error Handling

Always handle errors gracefully:

```javascript
async function safelyUsePrivacyAPI() {
  try {
    if (window.macroPrivacy) {
      const report = await window.macroPrivacy.getPrivacyReport();
      processReport(report);
    }
  } catch (error) {
    // Handle errors gracefully
    console.error('Privacy API error:', error);
    // Continue with alternative functionality
    provideFallbackExperience();
  }
}
```

## Conclusion

The privacy APIs in Macro Browser enable developers to create privacy-respecting applications while maintaining compatibility with the broader web. By using these APIs properly and following the best practices, you can provide enhanced functionality specifically for Macro Browser users while ensuring a good experience for all users. 