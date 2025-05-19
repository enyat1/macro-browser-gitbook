# Web3 Integration

The Web3 Integration layer enables Macro Browser to interact seamlessly with blockchain networks and decentralized applications (dApps). This component bridges the traditional web browsing experience with the decentralized web ecosystem.

## Architecture Overview

![Web3 Integration Architecture](/images/diagrams/web3-integration.svg)

## Key Components

### Wallet Connector

Facilitates connections with cryptocurrency wallets:

- **External Wallet Support**: Integration with popular wallets (MetaMask, Coinbase Wallet, etc.)
- **WalletConnect Support**: Connection to mobile wallets via QR code
- **Hardware Wallet Integration**: Support for Ledger, Trezor, and other hardware wallets
- **Multi-Wallet Management**: Connect and manage multiple wallets simultaneously
- **Connection Status Monitoring**: Track wallet connection state

### Provider Bridge

Implements the Web3 provider interface for dApp connectivity:

- **EIP-1193 Compliance**: Standard Ethereum provider API implementation
- **Method Handling**: Processing of Ethereum JSON-RPC methods
- **Event Propagation**: Wallet and chain-related events (connect, disconnect, chainChanged, etc.)
- **Request Filtering**: Security filtering of provider requests
- **Cross-Origin Isolation**: Domain-specific provider instances

### Transaction Manager

Handles blockchain transactions securely:

- **Transaction Creation**: Help construct valid blockchain transactions
- **Gas Estimation**: Accurate gas fee estimations
- **Transaction Signing**: Secure signing process with user confirmation
- **Transaction Broadcasting**: Sending signed transactions to the network
- **Transaction Monitoring**: Track transaction status and confirmations
- **Receipt Validation**: Verify transaction completion and effects

### Network Manager

Supports multiple blockchain networks:

- **Network Switching**: Easy switching between different networks
- **Chain Validation**: Ensure proper chain ID and network configuration
- **Custom Network Support**: Adding and managing custom RPC endpoints
- **Network Status Monitoring**: Track network availability and conditions
- **EIP-3085 Support**: Adding new networks via `wallet_addEthereumChain`
- **EIP-3326 Support**: Switching networks via `wallet_switchEthereumChain`

### Security Monitor

Provides security features for Web3 interactions:

- **Phishing Protection**: Detection of known scam sites and malicious dApps
- **Contract Verification**: Verification of smart contract source code when available
- **Permission Management**: Granular control over dApp permissions
- **Transaction Analysis**: Pre-execution analysis of transaction effects
- **Spending Limits**: Optional spending limits for transactions

## Technical Implementation

### Wallet Connection Flow

![Wallet Connection Flow](/images/diagrams/wallet-connection-flow.svg)

### Web3 Provider Implementation

```typescript
// Example of a simplified Web3 provider implementation
class MacroWeb3Provider {
  private connectedAccounts: string[] = [];
  private currentChainId: string = '0x1'; // Ethereum Mainnet by default
  private wallet: IWallet;
  private domain: string;
  
  constructor(wallet: IWallet, domain: string) {
    this.wallet = wallet;
    this.domain = domain;
  }
  
  // Main JSON-RPC request handler (EIP-1193)
  async request(args: { method: string; params?: unknown[] }): Promise<unknown> {
    // Security checks
    if (!this.isMethodAllowed(args.method, this.domain)) {
      throw new Error(`Method ${args.method} not allowed for ${this.domain}`);
    }
    
    // Handle specific methods locally if needed
    switch (args.method) {
      case 'eth_accounts':
        return this.connectedAccounts;
        
      case 'eth_chainId':
        return this.currentChainId;
        
      case 'eth_requestAccounts':
        // Trigger wallet connection UI if needed
        if (this.connectedAccounts.length === 0) {
          await this.connectWallet();
        }
        return this.connectedAccounts;
        
      // For most methods, pass through to wallet
      default:
        // For transaction requests, show confirmation UI
        if (['eth_sendTransaction', 'eth_signTransaction'].includes(args.method)) {
          await this.showTransactionConfirmation(args.method, args.params);
        }
        
        // Forward request to wallet
        return await this.wallet.request(args);
    }
  }
  
  // Support for legacy web3
  sendAsync(payload: any, callback: (error: Error | null, result?: any) => void): void {
    this.request(payload)
      .then(result => callback(null, { jsonrpc: '2.0', id: payload.id, result }))
      .catch(error => callback(error));
  }
  
  // EIP-1193 events
  on(eventName: string, listener: (...args: any[]) => void): void {
    // Implementation of event handling
  }
}
```

### Transaction Security

```typescript
// Example of transaction security analysis
async function analyzeTransaction(transaction: TransactionRequest): Promise<SecurityAnalysis> {
  const analysis: SecurityAnalysis = {
    riskLevel: 'low',
    warnings: [],
    recommendations: []
  };
  
  // Check destination address against known scams
  if (isKnownScamAddress(transaction.to)) {
    analysis.riskLevel = 'high';
    analysis.warnings.push('Destination address is associated with known scams');
  }
  
  // Check for unusual gas price
  const currentGasPrice = await getCurrentGasPrice();
  if (transaction.gasPrice && transaction.gasPrice > currentGasPrice * 2) {
    analysis.riskLevel = Math.max(analysis.riskLevel === 'low' ? 'medium' : analysis.riskLevel);
    analysis.warnings.push('Gas price is significantly higher than current network average');
  }
  
  // Check if contract is verified
  if (await isContract(transaction.to)) {
    const isVerified = await isContractVerified(transaction.to);
    if (!isVerified) {
      analysis.recommendations.push('Contract source code is not verified. Proceed with caution.');
    }
    
    // Simulate transaction to analyze effects
    try {
      const simulationResult = await simulateTransaction(transaction);
      if (simulationResult.tokenTransfers.length > 0) {
        analysis.recommendations.push(`This transaction will transfer: ${formatTokenTransfers(simulationResult.tokenTransfers)}`);
      }
    } catch (error) {
      analysis.warnings.push('Transaction simulation failed. This may indicate potential issues.');
    }
  }
  
  return analysis;
}
```

## Integration with dApps

Macro Browser's Web3 integration enables seamless interaction with decentralized applications:

- **Automatic Provider Injection**: Web3 provider automatically injected into dApp pages
- **Permission System**: dApps request permission to connect to user's wallet
- **Transaction Approval Flow**: Clear UI for transaction approval
- **Network Compatibility**: Support for multiple blockchain networks
- **Chain Switching**: Allow dApps to request network changes

## User Interface

The Web3 integration includes several user interface components:

- **Wallet Connection Button**: Easily accessible in the browser toolbar
- **Connected Account Display**: Shows currently connected wallet and account
- **Transaction Approval Dialog**: Clear presentation of transaction details
- **Network Selector**: Dropdown for changing the active blockchain network
- **Asset Overview**: Summary of wallet balances (optional)

## Privacy Considerations

The Web3 integration is designed with privacy in mind:

- **Domain Isolation**: Each domain gets its own isolated provider instance
- **Minimal Data Sharing**: Only necessary data is shared with dApps
- **No Persistent Storage**: Wallet connection data not stored permanently
- **Transparent Permissions**: Clear display of what each dApp can access
- **Optional Connections**: Users can choose which dApps can connect to their wallet

## Future Enhancements

Planned improvements for the Web3 integration:

- **Enhanced Transaction Simulation**: More detailed preview of transaction effects
- **NFT Support**: Improved handling of non-fungible tokens
- **Multi-Chain Operations**: Streamlined cross-chain transactions
- **Layer 2 Optimizations**: Better support for Layer 2 scaling solutions
- **Wallet SDK**: Developer tools for wallet and dApp developers 