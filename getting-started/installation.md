# Installing Macro Browser

This guide will walk you through the process of installing Macro Browser on your system.

## Download

Visit the [official Macro Browser website](https://macrobrowser.com/download) to download the latest version for your operating system.

## Installation Instructions

### Windows

1. Locate the downloaded file (typically `MacroBrowser-Setup-x.x.x.exe`)
2. Double-click the installer file
3. Follow the on-screen instructions
4. When prompted, choose your preferred installation location
5. Wait for the installation to complete
6. Launch Macro Browser from the desktop shortcut or start menu

### macOS

1. Locate the downloaded file (typically `MacroBrowser-x.x.x.dmg`)
2. Double-click the DMG file to open it
3. Drag the Macro Browser icon to the Applications folder
4. Close the installer window
5. Open Finder, navigate to Applications, and launch Macro Browser
6. If prompted about an app from an "unidentified developer," right-click on the app and select "Open"

### Linux

#### Debian/Ubuntu (DEB package)

```bash
sudo dpkg -i macrobrowser_x.x.x_amd64.deb
sudo apt-get install -f
```

#### Fedora/RHEL (RPM package)

```bash
sudo rpm -i macrobrowser-x.x.x.x86_64.rpm
```

#### AppImage

1. Make the AppImage executable:
   ```bash
   chmod +x MacroBrowser-x.x.x.AppImage
   ```
2. Run the AppImage:
   ```bash
   ./MacroBrowser-x.x.x.AppImage
   ```

## Verifying Installation

After installation, launch Macro Browser. You should see the welcome screen and the browser interface. The default page will guide you through connecting your wallet and setting up your secure browsing environment.

## Troubleshooting

If you encounter any issues during installation:

1. Ensure your system meets the [minimum requirements](README.md#system-requirements)
2. Try redownloading the installer if the file appears to be corrupted
3. Temporarily disable your antivirus software (some may flag new applications)
4. Visit our [FAQ](../faq.md) for common installation issues
5. Contact support at support@macrobrowser.com

## Updating

Macro Browser will automatically check for updates. When an update is available, you'll be notified and can choose to install it immediately or later. 