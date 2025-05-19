# Extension Development Guide

This guide covers how to develop extensions for Macro Browser, focusing on privacy-respecting design and Macro-specific features.

## Extension Architecture Overview

Macro Browser supports two types of extensions:

1. **Standard Extensions** - Compatible with Chromium extensions, with some privacy-focused limitations
2. **Privacy Extensions** - Enhanced extension type with access to Macro-specific privacy APIs

![Diagram 1](/images/diagrams/developers_extension-guide_diagram_1.svg)

## Getting Started

### Setting Up Your Development Environment

```bash
# Clone the extension starter template
git clone https://github.com/macro-browser/extension-starter

# Install dependencies
cd extension-starter
npm install

# Start development server
npm run dev
```

### Directory Structure

A typical Macro Browser extension has the following structure:

```
extension/
├── manifest.json         # Extension manifest
├── background/           # Background scripts
│   └── index.js          # Main background script
├── content/              # Content scripts
│   └── content.js        # Main content script
├── popup/                # Browser action popup
│   ├── index.html        # Popup HTML
│   └── popup.js          # Popup logic
├── options/              # Options page
│   ├── index.html        # Options page HTML
│   └── options.js        # Options page logic
├── icons/                # Extension icons
│   ├── icon-16.png       # 16x16 icon
│   ├── icon-48.png       # 48x48 icon
│   └── icon-128.png      # 128x128 icon
├── _locales/             # Internationalization
│   └── en/
│       └── messages.json # English messages
└── privacy.json          # Macro-specific privacy declarations
```

### Manifest File

```json
{
  "manifest_version": 3,
  "name": "My Privacy Extension",
  "version": "1.0.0",
  "description": "A privacy-respecting extension for Macro Browser",
  "permissions": [
    "storage",
    "tabs"
  ],
  "host_permissions": [
    "https://*.example.com/*"
  ],
  "background": {
    "service_worker": "background/index.js",
    "type": "module"
  },
  "action": {
    "default_popup": "popup/index.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["https://*.example.com/*"],
      "js": ["content/content.js"]
    }
  ],
  "options_ui": {
    "page": "options/index.html",
    "open_in_tab": true
  },
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "macro_privacy": {
    "privacy_manifest_version": 1,
    "data_collection": "none",
    "network_requests": "declared",
    "privacy_practices": "certified"
  }
}
```

### Privacy Manifest (privacy.json)

```json
{
  "version": 1,
  "data_usage": {
    "collection": "none",
    "storage_location": "device_only",
    "retention_period": "session_only"
  },
  "network_requests": [
    {
      "domain": "api.example.com",
      "purpose": "API access for extension functionality",
      "data_transmitted": [
        {
          "type": "transaction_data",
          "purpose": "Verify transaction security",
          "anonymized": true
        }
      ]
    }
  ],
  "permissions_justification": {
    "storage": "Store user preferences in memory only",
    "tabs": "Access current tab URL to provide page-specific features"
  },
  "third_party_libraries": [
    {
      "name": "ethers.js",
      "version": "5.7.2",
      "purpose": "Web3 interaction",
      "privacy_policy": "https://github.com/ethers-io/ethers.js/blob/master/PRIVACY.md"
    }
  ]
}
```

## Building Standard Extensions

### Background Scripts

Background scripts run in the extension's background context.

```javascript
// background/index.js
chrome.runtime.onInstalled.addListener(() => {
  // Initialize extension
  console.log("Extension installed");
  
  // Set up default settings with privacy in mind
  chrome.storage.local.set({
    collectAnalytics: false,
    enhancedPrivacy: true,
    notificationPermission: 'ask'
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getData') {
    // Process in background to avoid exposing data in page context
    processDataSecurely(message.payload).then(result => {
      sendResponse({ success: true, data: result });
    });
    return true; // Indicates async response
  }
});

// Privacy-focused implementation
function processDataSecurely(data) {
  // Process data without sending to external servers
  return Promise.resolve({ 
    // Processed data
    result: 'processed-' + data,
    // No user identifiers
  });
}
```

### Content Scripts

Content scripts run in the context of web pages.

```javascript
// content/content.js
// Avoid accessing sensitive page data unless necessary
(function() {
  // Listen for specific events rather than monitoring everything
  document.addEventListener('your-specific-event', handleEvent);
  
  function handleEvent(event) {
    // Only collect minimal necessary data
    const safeData = sanitizeData(event.detail);
    
    // Send to background script for processing
    chrome.runtime.sendMessage(
      { type: 'getData', payload: safeData },
      (response) => {
        // Handle response
        if (response && response.success) {
          updateUI(response.data);
        }
      }
    );
  }
  
  function sanitizeData(data) {
    // Remove any sensitive or identifying information
    // before sending to background script
    return {
      // Only necessary fields
      action: data.action,
      // No PII
    };
  }
  
  function updateUI(data) {
    // Update page UI with processed data
    const element = document.querySelector('#extension-content');
    if (element) {
      element.textContent = data.result;
    }
  }
})();
```

### Popup UI

```html
<!-- popup/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Privacy Extension</title>
  <style>
    body {
      width: 300px;
      padding: 15px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .privacy-first {
      background-color: #f1f5f9;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
    }
    button {
      background-color: #0f172a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
    }
    button:hover {
      background-color: #1e293b;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }
    .switch input { 
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .3s;
      border-radius: 34px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: #0f172a;
    }
    input:checked + .slider:before {
      transform: translateX(26px);
    }
  </style>
</head>
<body>
  <h1>My Privacy Extension</h1>
  
  <div class="privacy-first">
    <p>Your privacy is our priority. All data is processed locally.</p>
  </div>
  
  <div>
    <h2>Settings</h2>
    <div>
      <label class="switch">
        <input type="checkbox" id="enhancedPrivacy" checked>
        <span class="slider"></span>
      </label>
      <span>Enhanced Privacy Mode</span>
    </div>
    <div>
      <button id="analyzeCurrentPage">Analyze Current Page</button>
    </div>
  </div>
  
  <div id="results"></div>
  
  <script src="popup.js"></script>
</body>
</html>
```

```javascript
// popup/popup.js
document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.local.get(['enhancedPrivacy'], (result) => {
    document.getElementById('enhancedPrivacy').checked = 
      result.enhancedPrivacy !== undefined ? result.enhancedPrivacy : true;
  });
  
  // Save settings when changed
  document.getElementById('enhancedPrivacy').addEventListener('change', (e) => {
    chrome.storage.local.set({ enhancedPrivacy: e.target.checked });
  });
  
  // Handle analyze button
  document.getElementById('analyzeCurrentPage').addEventListener('click', () => {
    // Get current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      
      // Display loading
      document.getElementById('results').textContent = 'Analyzing...';
      
      // Send message to content script
      chrome.tabs.sendMessage(
        currentTab.id, 
        { action: 'analyze' },
        (response) => {
          if (chrome.runtime.lastError) {
            // Handle error
            document.getElementById('results').textContent = 
              'Error: Could not connect to page';
            return;
          }
          
          if (response && response.data) {
            displayResults(response.data);
          }
        }
      );
    });
  });
  
  function displayResults(data) {
    const resultsElement = document.getElementById('results');
    
    // Clear previous results
    resultsElement.innerHTML = '';
    
    // Create results UI
    const resultsTitle = document.createElement('h3');
    resultsTitle.textContent = 'Analysis Results';
    
    const resultsList = document.createElement('ul');
    for (const key in data) {
      const item = document.createElement('li');
      item.textContent = `${key}: ${data[key]}`;
      resultsList.appendChild(item);
    }
    
    resultsElement.appendChild(resultsTitle);
    resultsElement.appendChild(resultsList);
  }
});
```

## Privacy-Focused Extension Features

### Accessing Macro-Specific Privacy APIs

```javascript
// Check if running in Macro Browser
function isMacroBrowser() {
  return typeof chrome.macroPrivacy !== 'undefined';
}

// Use Macro privacy APIs if available
async function getPrivacyContext() {
  if (isMacroBrowser()) {
    try {
      // Access Macro-specific privacy API
      return await chrome.macroPrivacy.getPrivacyContext();
    } catch (error) {
      console.error('Error accessing Macro privacy APIs:', error);
      // Fall back to default
      return { 
        isPrivacyModeEnabled: true,
        trackingProtectionLevel: 'standard'
      };
    }
  } else {
    // Default for non-Macro browsers
    return { 
      isPrivacyModeEnabled: false,
      trackingProtectionLevel: 'none'
    };
  }
}

// Example usage
async function adaptToPrivacyContext() {
  const context = await getPrivacyContext();
  
  if (context.isPrivacyModeEnabled) {
    // Adapt UI and functionality for privacy mode
    enablePrivacyFeatures();
  }
  
  if (context.trackingProtectionLevel === 'strict') {
    // Enhance protection UI
    showStrictProtectionIndicator();
  }
}
```

### Privacy-Respecting Storage Strategy

```javascript
// Privacy-respecting storage helper
const privacyStorage = {
  // Save data with expiration and no PII
  async save(key, data, expirationHours = 24) {
    // Add expiration timestamp
    const expirationTime = Date.now() + (expirationHours * 60 * 60 * 1000);
    
    // Remove any potential PII
    const safeData = this.sanitizeData(data);
    
    // Store data
    return new Promise((resolve) => {
      chrome.storage.local.set({
        [key]: {
          data: safeData,
          expiration: expirationTime
        }
      }, () => resolve(true));
    });
  },
  
  // Get data if not expired
  async get(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        const storedData = result[key];
        
        if (!storedData) {
          resolve(null);
          return;
        }
        
        // Check if expired
        if (storedData.expiration < Date.now()) {
          // Expired, remove data
          chrome.storage.local.remove([key]);
          resolve(null);
          return;
        }
        
        resolve(storedData.data);
      });
    });
  },
  
  // Remove any potential PII
  sanitizeData(data) {
    // Deep clone to avoid modifying original
    const clone = JSON.parse(JSON.stringify(data));
    
    // List of fields that might contain PII
    const piiFields = [
      'email', 'name', 'phone', 'address', 'ip', 'location',
      'ssn', 'dob', 'birthdate', 'password', 'userId'
    ];
    
    // Recursively sanitize objects
    function sanitizeObject(obj) {
      if (!obj || typeof obj !== 'object') return obj;
      
      Object.keys(obj).forEach(key => {
        // Check if key contains any PII field name
        const containsPII = piiFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        );
        
        if (containsPII) {
          // Replace PII with null
          obj[key] = null;
        } else if (typeof obj[key] === 'object') {
          // Recursively check nested objects
          obj[key] = sanitizeObject(obj[key]);
        }
      });
      
      return obj;
    }
    
    return sanitizeObject(clone);
  },
  
  // Clear all stored data
  clearAll() {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  }
};
```

### Respecting DNT and Privacy Signals

```javascript
// Detect and respect privacy signals
function detectPrivacySignals() {
  const signals = {
    doNotTrack: navigator.doNotTrack === '1' || 
                window.doNotTrack === '1',
    globalPrivacyControl: navigator.globalPrivacyControl === true
  };
  
  if (isMacroBrowser() && chrome.macroPrivacy) {
    // Get additional Macro Browser signals
    chrome.macroPrivacy.getPrivacyContext().then(context => {
      signals.macroPrivacyEnabled = context.isPrivacyModeEnabled;
      signals.trackingProtection = context.trackingProtectionLevel;
      
      applyPrivacySettings(signals);
    });
  } else {
    applyPrivacySettings(signals);
  }
}

function applyPrivacySettings(signals) {
  // If any privacy signal is enabled, use maximum privacy
  if (signals.doNotTrack || 
      signals.globalPrivacyControl || 
      signals.macroPrivacyEnabled) {
    
    // Disable any collection features
    disableAllCollection();
    
    // Enable privacy-focused UI
    updateUIForPrivacy(true);
    
    // Log privacy settings (no user data)
    console.log('Privacy mode active:', signals);
  } else {
    // Standard mode, still privacy-respecting
    updateUIForPrivacy(false);
  }
}
```

### Secure Communication

```javascript
// Secure fetch helper with privacy enhancements
async function secureFetch(url, options = {}) {
  // Check URL security
  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS URLs are allowed');
  }
  
  // Add security headers
  const secureOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty'
    }
  };
  
  // Use Macro Browser's enhanced security if available
  if (isMacroBrowser() && chrome.macroSecureComms) {
    try {
      return await chrome.macroSecureComms.secureFetch(url, secureOptions);
    } catch (error) {
      console.error('Enhanced secure fetch failed:', error);
      // Fall back to regular fetch
    }
  }
  
  // Regular secure fetch
  try {
    const response = await fetch(url, secureOptions);
    
    // Check for server security headers
    const contentSecurityPolicy = response.headers.get('Content-Security-Policy');
    if (!contentSecurityPolicy) {
      console.warn('Warning: No Content-Security-Policy header');
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

## Web3 Integration for Extensions

```javascript
// Web3 extension functionality
class Web3ExtensionController {
  constructor() {
    this.provider = null;
    this.initialized = false;
    this.securityLevel = 'standard';
  }
  
  // Initialize Web3 connection
  async initialize() {
    if (this.initialized) return;
    
    // Check for Macro Browser first
    if (isMacroBrowser() && chrome.macroWeb3) {
      // Use Macro Browser's built-in provider
      this.provider = await chrome.macroWeb3.getProvider();
      this.securityLevel = await chrome.macroWeb3.getSecurityLevel();
      this.initialized = true;
      return;
    }
    
    // Check for window.ethereum (MetaMask, etc.)
    if (window.ethereum) {
      this.provider = window.ethereum;
      this.initialized = true;
      return;
    }
    
    throw new Error('No Web3 provider found');
  }
  
  // Request account access
  async connectWallet() {
    if (!this.initialized) await this.initialize();
    
    try {
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts'
      });
      
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }
  
  // Analyze transaction for security before sending
  // Enhanced if using Macro Browser
  async analyzeTx(txData) {
    if (isMacroBrowser() && chrome.macroWeb3) {
      // Use Macro's enhanced security analysis
      return await chrome.macroWeb3.analyzeTx(txData);
    }
    
    // Basic analysis for other browsers
    return this.basicTxAnalysis(txData);
  }
  
  // Basic security checks for non-Macro browsers
  basicTxAnalysis(txData) {
    // Simple checks - would be more comprehensive in real implementation
    const warnings = [];
    
    if (txData.value && parseInt(txData.value, 16) > 0) {
      warnings.push('Transaction sends funds');
    }
    
    if (txData.data && txData.data.length > 2) {
      warnings.push('Transaction executes contract function');
    }
    
    return {
      safe: warnings.length === 0,
      warnings
    };
  }
  
  // Send transaction with security checks
  async sendTransaction(txData) {
    if (!this.initialized) await this.initialize();
    
    // Analyze transaction first
    const analysis = await this.analyzeTx(txData);
    
    // If not safe, require confirmation
    if (!analysis.safe) {
      const confirmed = confirm(
        `Warning: This transaction may have security risks:\n` +
        analysis.warnings.join('\n') + '\n\n' +
        'Do you want to proceed?'
      );
      
      if (!confirmed) {
        throw new Error('Transaction rejected by user');
      }
    }
    
    // Send transaction
    return await this.provider.request({
      method: 'eth_sendTransaction',
      params: [txData]
    });
  }
}
```

## Testing and Debugging Extensions

### Testing in Macro Browser

```bash
# Start Macro Browser with debugging enabled
macro-browser --load-extension=/path/to/extension --auto-open-devtools-for-tabs
```

### Unit Testing Extension Components

```javascript
// tests/privacy-storage.test.js
describe('Privacy Storage Tests', () => {
  beforeEach(() => {
    // Mock chrome.storage.local
    global.chrome = {
      storage: {
        local: {
          set: jest.fn((data, callback) => callback()),
          get: jest.fn((keys, callback) => callback({})),
          remove: jest.fn((keys, callback) => callback()),
          clear: jest.fn(callback => callback())
        }
      }
    };
  });
  
  test('should sanitize PII data', async () => {
    // Import the module
    const { privacyStorage } = require('../background/privacy-storage');
    
    // Test data with PII
    const testData = {
      title: 'Test Item',
      email: 'user@example.com',
      settings: {
        theme: 'dark',
        userAddress: '123 Main St'
      }
    };
    
    // Save data
    await privacyStorage.save('test-key', testData);
    
    // Check what was passed to chrome.storage.local.set
    expect(chrome.storage.local.set).toHaveBeenCalled();
    
    // Extract the data that would be saved
    const savedArgs = chrome.storage.local.set.mock.calls[0][0];
    const sanitizedData = savedArgs['test-key'].data;
    
    // Verify PII was removed
    expect(sanitizedData.title).toBe('Test Item');
    expect(sanitizedData.email).toBeNull();
    expect(sanitizedData.settings.theme).toBe('dark');
    expect(sanitizedData.settings.userAddress).toBeNull();
  });
});
```

### End-to-End Testing

```javascript
// e2e-tests/extension.spec.js
const puppeteer = require('puppeteer');

describe('Extension E2E Tests', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    // Launch browser with extension
    browser = await puppeteer.launch({
      headless: false, // Required for extension testing
      args: [
        `--disable-extensions-except=/path/to/extension`,
        `--load-extension=/path/to/extension`
      ]
    });
    
    // Get the extension ID
    const targets = await browser.targets();
    const extensionTarget = targets.find(target => 
      target.type() === 'background_page'
    );
    const extensionUrl = extensionTarget.url();
    const [, , extensionID] = extensionUrl.split('/');
    
    // Open a new page
    page = await browser.newPage();
    
    // Navigate to extension popup
    await page.goto(`chrome-extension://${extensionID}/popup/index.html`);
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  test('Extension popup loads correctly', async () => {
    // Check title
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toBe('My Privacy Extension');
    
    // Check privacy mode toggle
    const isChecked = await page.$eval(
      '#enhancedPrivacy', 
      el => el.checked
    );
    expect(isChecked).toBe(true);
  });
  
  test('Settings can be changed', async () => {
    // Toggle privacy mode
    await page.click('#enhancedPrivacy');
    
    // Verify it was toggled
    const isChecked = await page.$eval(
      '#enhancedPrivacy', 
      el => el.checked
    );
    expect(isChecked).toBe(false);
    
    // Wait for storage to update
    await page.waitForTimeout(100);
    
    // You would verify storage was updated in a real test
  });
});
```

## Publishing Your Extension

### Privacy Review Checklist

Before submitting your extension for review, ensure it follows these privacy principles:

- [ ] Collects only necessary data (or no data at all)
- [ ] All data collection is clearly documented in privacy.json
- [ ] Does not track users across websites
- [ ] Provides clear privacy controls in the UI
- [ ] Follows the principle of least privilege for permissions
- [ ] Network requests are limited to documented endpoints
- [ ] No third-party tracking or analytics
- [ ] Code is readable and well-documented
- [ ] Securely handles any sensitive data
- [ ] Respects all browser privacy settings

### Submission Process

1. Package your extension:
   ```bash
   npm run build
   ```

2. Complete the privacy declaration in privacy.json

3. Submit to the Macro Extension Store with:
   - Detailed description
   - Screenshots and demo video
   - Complete privacy information
   - Support contact information

4. Respond to any privacy review feedback

5. After approval, your extension will be published to the Macro Extension Store

## Best Practices for Privacy-Focused Extensions

1. **Minimize Data Collection**: Collect only what's absolutely necessary for functionality
2. **Process Locally**: Keep data processing within the browser whenever possible
3. **Use Memory-Only Storage**: For sensitive information, avoid persistent storage
4. **Respect Privacy Signals**: Honor DNT, GPC, and Macro-specific privacy signals
5. **Provide Clear Controls**: Give users easy access to privacy settings
6. **Secure Communications**: Use only HTTPS and secure communication methods
7. **Fallback Gracefully**: Support non-Macro browsers with appropriate fallbacks
8. **Document Privacy Practices**: Be transparent about all privacy-related functionality
9. **Regular Security Updates**: Maintain and update your extension regularly
10. **Follow Least Privilege**: Request only the permissions you absolutely need

## Resources

- [Macro Browser Extension API Documentation](https://docs.macro.io/extension-api)
- [Extension Developer Community Forum](https://community.macro.io/extensions)
- [Privacy-First Design Principles](https://docs.macro.io/privacy-principles)
- [Web3 Extension Examples](https://github.com/macro-browser/extension-examples)
