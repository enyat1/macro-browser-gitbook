# P2P VPN

Macro Browser includes a built-in peer-to-peer VPN that provides enhanced privacy and security without the drawbacks of traditional VPN services.

![P2P VPN](/images/features/p2p-vpn.svg)

## What is a P2P VPN?

Unlike traditional VPNs that route your traffic through centralized servers, a peer-to-peer VPN creates a decentralized network of peers that relay traffic between them. This approach has several advantages:

- **No Central Servers**: No single point of failure or logging
- **Distributed Network**: Traffic is routed through multiple peers
- **Enhanced Privacy**: No single entity can monitor all traffic
- **Reduced Bottlenecks**: Avoids congestion at central servers

## How Macro Browser's P2P VPN Works

1. **Network Establishment**: When you enable the VPN, Macro Browser connects to a decentralized network of peers
2. **Traffic Encryption**: All your browser traffic is encrypted before leaving your device
3. **Peer Routing**: Traffic is routed through multiple peers in the network
4. **Destination Delivery**: The final peer in the chain delivers your request to its destination
5. **Return Path**: Responses follow a similar path back to your device

## Technical Implementation

Macro Browser's P2P VPN is built on WireGuard, a modern and efficient VPN protocol, with a custom peer-to-peer overlay network:

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│  Your Device  │◄────►│  Peer Network  │◄────►│  Destination  │
└───────────────┘      └───────────────┘      └───────────────┘
     ▲                        ▲
     │                        │
┌───────────────┐      ┌───────────────┐
│ Crypto Payment│      │ Peer Discovery│
│    System     │      │    Service    │
└───────────────┘      └───────────────┘
```

- **Protocol**: WireGuard with custom extensions for P2P connections
- **Encryption**: State-of-the-art encryption for all traffic
- **Peer Discovery**: Decentralized mechanism to find and connect to peers
- **Relay Selection**: Intelligent selection of peers for optimal performance
- **Network Hopping**: Periodic changing of route to enhance privacy

## Key Features

### 1. One-Click Activation

The VPN can be enabled or disabled with a single click from the browser toolbar. When activated, a secure tunnel is established, and all browser traffic is routed through the P2P network.

### 2. No Logging Policy

Unlike many traditional VPNs, Macro Browser's P2P VPN operates with a strict no-logging policy:

- No browsing activity logs
- No connection time logs
- No IP address logs
- No bandwidth usage logs

### 3. Micro-Payment System

The P2P network is sustained through an innovative micro-payment system using cryptocurrency:

- Users can earn crypto by sharing bandwidth as peers
- Small, automatic payments for using the network
- Transparent fee structure
- Optional participation

### 4. Smart Routing

The VPN intelligently routes traffic based on several factors:

- Network performance
- Geographic proximity
- Peer reliability
- Connection quality

### 5. Bypass Options

Users can configure certain sites or services to bypass the VPN:

- Whitelist trusted sites
- Local network access
- Banking sites
- Streaming services

## Privacy Benefits

- **ISP Blindness**: Your internet service provider cannot see your browsing activity
- **IP Masking**: Websites cannot determine your real IP address
- **Traffic Encryption**: All data is encrypted, preventing eavesdropping
- **Geo-Restriction Bypass**: Access content regardless of geographic restrictions
- **Public Wi-Fi Protection**: Secure browsing even on untrusted networks

## Configuration Options

The P2P VPN can be customized through the browser's privacy settings:

- **Connection Mode**: Balance between speed and privacy
- **Trusted Networks**: Networks where VPN is not automatically enabled
- **Exit Regions**: Preferred geographic regions for exit nodes
- **Bandwidth Limits**: Control how much bandwidth to share as a peer
- **Payment Settings**: Configure crypto micro-payment preferences

## Performance Considerations

While the P2P VPN provides significant privacy benefits, it may affect browsing performance:

- **Slight Latency Increase**: Due to traffic routing through multiple peers
- **Variable Speeds**: Dependent on available peers and their connection quality
- **Initial Connection Time**: Establishing the P2P network may take a few seconds

Macro Browser includes performance optimization features to minimize these impacts. 