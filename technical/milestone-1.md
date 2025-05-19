# Milestone 1: Foundation - Base Browser & Core Privacy

This milestone covers the establishment of the core browser functionality and privacy features that form the foundation of Macro Browser.

## Objective

Create a secure, private browser core with essential privacy protections built in.

## Technical Implementation

### 1. Set up Base Browser with Electron

```typescript
// Example of main process initialization in main.ts
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    backgroundColor: '#1a1a1a',
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true
  });

  // Load application or initial page
  mainWindow.loadURL('about:blank');
}

app.whenReady().then(() => {
  createWindow();
});
```

Key components:
- **Electron Framework**: Provides the Chromium engine and Node.js runtime
- **Main Process**: Controls the application lifecycle and browser windows
- **Renderer Process**: Handles the display of web content in isolation
- **Security Configurations**: Context isolation, sandboxing, and other security measures

### 2. De-Google Chromium Configuration

Chromium components with Google services are disabled through Electron's session configuration:

```typescript
// Example of configuring session in main.ts
import { session } from 'electron';

function configureSession() {
  // Disable Google services
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const googleServiceURLs = [
      'https://clients*.google.com/*',
      'https://*.googleapis.com/*',
      // Additional Google service URLs
    ];
    
    const shouldBlock = googleServiceURLs.some(pattern => {
      return new RegExp(pattern.replace(/\*/g, '.*')).test(details.url);
    });
    
    callback({ cancel: shouldBlock });
  });
  
  // Set custom user agent to avoid fingerprinting
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 Macro Browser/1.0';
    callback({ requestHeaders: details.requestHeaders });
  });
}
```

Key aspects:
- **Service Removal**: Block connections to Google analytics, metrics, and tracking services
- **Telemetry Disabling**: Prevent sending usage statistics
- **User-Agent Customization**: Reduce fingerprinting potential
- **Safe Browsing Alternative**: Implement a privacy-respecting alternative to Google Safe Browsing

### 3. Implement Default Private Mode

```typescript
// Example of private browsing configuration
function configurePrivateBrowsing() {
  // Configure session to never persist data
  const privateConfig = {
    cache: false,
    cookies: false,
    storage: false,
    databases: false,
    serviceWorkers: false,
    permissions: false
  };
  
  session.defaultSession.setStorageAccessSync(privateConfig);
  
  // Clear data when app closes
  app.on('before-quit', () => {
    session.defaultSession.clearStorageData();
    session.defaultSession.clearCache();
  });
  
  // Initialize browser state clean each time
  app.on('ready', () => {
    session.defaultSession.clearStorageData();
  });
}
```

Key features:
- **No History Retention**: Browser does not save browsing history
- **Cookie Management**: Temporary cookies only, cleared on exit
- **Cache Control**: In-memory cache that's cleared between sessions
- **Storage Isolation**: Private storage that doesn't persist
- **State Management**: Clean browser state on startup

### 4. Integrate Ad/Tracker Blocking

```typescript
// Example of ad blocker integration
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'cross-fetch';

async function initializeAdBlocker() {
  // Load filter lists (using Easylist, uBlock Origin lists, etc.)
  const blocker = await ElectronBlocker.fromLists(
    fetch,
    [
      'https://easylist.to/easylist/easylist.txt',
      'https://easylist.to/easylist/easyprivacy.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt'
    ],
    {
      enableCompression: true,
    }
  );
  
  // Apply blocking to the default session
  blocker.enableBlockingInSession(session.defaultSession);
  
  // Update filter lists periodically
  setInterval(() => {
    blocker.update();
  }, 24 * 60 * 60 * 1000); // Update every 24 hours
}
```

Key components:
- **Filtering Engine**: Based on uBlock Origin's core technology
- **Filter Lists**: Multiple curated lists for comprehensive blocking
- **Network-Level Blocking**: Prevents requests to ad/tracking domains
- **Element Hiding**: Removes ad containers from rendered pages
- **Performance Optimization**: Efficient matching algorithms
- **Statistics Collection**: For user-facing privacy dashboard

### 5. Enforce Secure Connections

```typescript
// Example of HTTPS upgrade implementation
function enforceSecureConnections() {
  // Upgrade HTTP requests to HTTPS where possible
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    if (details.url.startsWith('http:') && !details.url.startsWith('http://localhost')) {
      const secureUrl = details.url.replace('http:', 'https:');
      callback({ redirectURL: secureUrl });
    } else {
      callback({});
    }
  });
  
  // Display warning for insecure sites
  mainWindow.webContents.on('did-start-navigation', (event, url, isInPlace) => {
    const isSecure = url.startsWith('https:') || url.startsWith('about:') || url.startsWith('chrome:');
    if (!isSecure) {
      // Show security warning in UI
      mainWindow.webContents.executeJavaScript(`
        document.dispatchEvent(new CustomEvent('insecure-connection', { 
          detail: { url: '${url}' } 
        }));
      `);
    }
  });
}
```

Key features:
- **HTTPS Upgrading**: Automatic switching from HTTP to HTTPS
- **Certificate Verification**: Enhanced SSL/TLS certificate validation
- **Insecure Site Warnings**: User alerts for non-HTTPS connections
- **Mixed Content Blocking**: Prevent insecure resources on secure pages
- **HSTS Support**: Enforce strict transport security

## Test Plan

- **Privacy Testing**: Validate that no browsing data is persisted between sessions
- **Ad Blocking Validation**: Test against known ad-serving domains
- **Network Analysis**: Verify no connections to Google services
- **Security Testing**: Ensure secure connection enforcement works correctly
- **Performance Benchmarking**: Measure impact of privacy features on browsing speed

## Dependencies

- Electron: ^25.0.0
- @cliqz/adblocker-electron: ^1.26.0
- cross-fetch: ^3.1.5

## Next Steps

After establishing this foundation, the project will proceed to [Milestone 2: Interface](milestone-2.md), which focuses on developing the user interface and implementing the AI-powered search functionality. 