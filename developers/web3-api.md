# Web3 API Reference

This document provides detailed reference information for developers integrating with Macro Browser's Web3 capabilities.

## Provider Object

Macro Browser injects a standard Web3 provider object (`window.ethereum`) into all pages, following the [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) specification with some Macro-specific enhancements.

```typescript
interface MacroProvider {
  // Standard EIP-1193 Properties
  isConnected(): boolean;
  chainId: string;
  selectedAddress: string | null;
  
  // Standard EIP-1193 Methods
  request(args: RequestArguments): Promise<unknown>;
  on(eventName: string, listener: (arg: any) => void): Provider;
  removeListener(eventName: string, listener: (arg: any) => void): Provider;
  
  // Macro Browser Specific
  isMacro: boolean;             // Always true, identifies Macro Browser
  isPrivate: boolean;           // Indicates if browser is in private mode (always true)
  securityLevel: 'standard' | 'enhanced'; // Current security settings
}

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}
```

## Supported JSON-RPC Methods

### Basic Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `eth_accounts` | None | `string[]` | Returns active accounts |
| `eth_requestAccounts` | None | `string[]` | Requests user permission for account access |
| `eth_chainId` | None | `string` | Returns current chain ID in hex |
| `eth_blockNumber` | None | `string` | Returns latest block number in hex |
| `eth_getBalance` | `[address, blockTag]` | `string` | Returns account balance |
| `eth_sendTransaction` | `[transactionObject]` | `string` | Sends a transaction |
| `eth_call` | `[transactionObject, blockTag]` | `string` | Executes a call without creating a transaction |
| `eth_estimateGas` | `[transactionObject]` | `string` | Estimates gas needed for transaction |
| `eth_gasPrice` | None | `string` | Returns current gas price |
| `eth_getTransactionCount` | `[address, blockTag]` | `string` | Returns account nonce |
| `eth_getCode` | `[address, blockTag]` | `string` | Returns contract code at address |
| `eth_getStorageAt` | `[address, position, blockTag]` | `string` | Returns value in contract storage |
| `eth_getTransactionByHash` | `[txHash]` | `Object` | Returns transaction details |
| `eth_getTransactionReceipt` | `[txHash]` | `Object` | Returns transaction receipt |

### Signing Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `eth_sign` | `[address, message]` | `string` | Signs a message (legacy) |
| `personal_sign` | `[message, address]` | `string` | Signs a personal message |
| `eth_signTypedData` | `[address, typedData]` | `string` | Signs typed data (legacy) |
| `eth_signTypedData_v4` | `[address, typedData]` | `string` | Signs typed data (current) |
| `eth_signTransaction` | `[transactionObject]` | `Object` | Signs without sending |

### Chain Management

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `wallet_switchEthereumChain` | `[{ chainId }]` | None | Switches to specified chain |
| `wallet_addEthereumChain` | `[chainObject]` | None | Adds new chain definition |
| `wallet_getPermissions` | None | `Object[]` | Returns current permissions |
| `wallet_requestPermissions` | `[{ eth_accounts }]` | `Object[]` | Requests permissions |

### Macro-Specific Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `macro_getVersion` | None | `string` | Returns Macro Browser version |
| `macro_getSecurityLevel` | None | `string` | Gets current security level |
| `macro_analyzeTransaction` | `[transactionObject]` | `Object` | Analyzes transaction risk |
| `macro_isVpnEnabled` | None | `boolean` | Checks if VPN is active |

## Provider Events

Developers can subscribe to events from the provider:

```javascript
window.ethereum.on('connect', (connectInfo) => {
  console.log('Connected to chain:', connectInfo.chainId);
});

window.ethereum.on('disconnect', (error) => {
  console.log('Disconnected from provider:', error);
});

window.ethereum.on('accountsChanged', (accounts) => {
  console.log('Accounts changed:', accounts);
});

window.ethereum.on('chainChanged', (chainId) => {
  console.log('Chain changed:', chainId);
  // Best practice: reload page on chain change
  window.location.reload();
});

window.ethereum.on('message', (message) => {
  console.log('Provider message:', message);
});
```

## Transaction Objects

Transaction objects have the following structure:

```typescript
interface TransactionObject {
  // Required
  from: string;      // Sender address
  
  // Optional but usually provided
  to?: string;       // Recipient address (required except for contract creation)
  value?: string;    // Amount in hex wei (default: '0x0')
  data?: string;     // Transaction data in hex (default: '0x')
  
  // Optional (can be auto-estimated)
  gas?: string;      // Gas limit in hex
  gasPrice?: string; // Gas price in hex wei
  maxFeePerGas?: string;      // EIP-1559 max fee
  maxPriorityFeePerGas?: string; // EIP-1559 priority fee
  
  // Optional (advanced)
  nonce?: string;    // Transaction nonce in hex
  chainId?: string;  // Chain ID in hex
}
```

## Chain Objects

When adding new chains, the following structure is used:

```typescript
interface ChainObject {
  chainId: string;              // Chain ID in hex format (e.g., '0x89')
  chainName: string;            // Human-readable name (e.g., 'Polygon Mainnet')
  nativeCurrency: {
    name: string;               // Currency name (e.g., 'MATIC')
    symbol: string;             // Currency symbol (e.g., 'MATIC')
    decimals: number;           // Decimal places (usually 18)
  };
  rpcUrls: string[];            // List of RPC endpoints
  blockExplorerUrls?: string[]; // List of block explorers
  iconUrls?: string[];          // List of chain icons
}
```

## Security Considerations

### Transaction Analysis

Macro Browser performs advanced transaction analysis for user safety:

```javascript
// Example of using the transaction analysis feature
async function analyzeBeforeSending(transactionObject) {
  try {
    // Get security analysis
    const analysis = await window.ethereum.request({
      method: 'macro_analyzeTransaction',
      params: [transactionObject]
    });
    
    // Check risk level
    if (analysis.riskLevel === 'high') {
      // Show warning to user
      const proceed = confirm(
        `Warning: This transaction has high risk factors:\n` +
        analysis.warnings.join('\n') + '\n\n' +
        'Do you want to proceed anyway?'
      );
      
      if (!proceed) {
        throw new Error('Transaction cancelled due to security concerns');
      }
    }
    
    // Proceed with transaction
    return await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionObject]
    });
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}
```

### Permissions

Always check for permissions before attempting operations:

```javascript
async function checkPermissions() {
  try {
    const permissions = await window.ethereum.request({
      method: 'wallet_getPermissions'
    });
    
    // Check if we have eth_accounts permission
    const hasAccountsPermission = permissions.some(
      permission => permission.parentCapability === 'eth_accounts'
    );
    
    if (!hasAccountsPermission) {
      console.log('No account permissions. Request access first.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}
```

## Error Handling

Macro Browser provides detailed error codes. Handle common errors properly:

```javascript
async function handleWeb3Operation(operation) {
  try {
    return await operation();
  } catch (error) {
    switch (error.code) {
      case 4001:
        console.log('User rejected the request');
        break;
      case 4100:
        console.log('Unauthorized - request not approved');
        break;
      case 4200:
        console.log('Unsupported method');
        break;
      case 4900:
        console.log('Disconnected from chain');
        break;
      case 4901:
        console.log('Chain not available');
        break;
      case 4902:
        console.log('Chain not added - suggest adding it');
        break;
      default:
        console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

## Usage Examples

### Connecting to a dApp

```javascript
async function connectDApp() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });
      
      // Initialize your dApp with connected account and chain
      initializeDApp(accounts[0], chainId);
      
      // Set up event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return true;
    } catch (error) {
      console.error('Error connecting to dApp:', error);
      return false;
    }
  } else {
    console.error('No Ethereum provider found');
    return false;
  }
}
```

### Contract Interaction

```javascript
async function callContractMethod(contractAddress, methodABI, params) {
  // Encode function call
  const methodSignature = web3.eth.abi.encodeFunctionSignature(methodABI);
  const encodedParams = web3.eth.abi.encodeParameters(
    methodABI.inputs.map(input => input.type),
    params
  );
  
  const data = methodSignature + encodedParams.slice(2);
  
  // Call the contract
  const result = await window.ethereum.request({
    method: 'eth_call',
    params: [{
      to: contractAddress,
      data: data
    }, 'latest']
  });
  
  // Decode result
  return web3.eth.abi.decodeParameter(
    methodABI.outputs[0].type,
    result
  );
}
```

### Transaction with Confirmation

```javascript
async function sendTransactionWithConfirmation(tx) {
  try {
    // Send transaction
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });
    
    console.log('Transaction sent:', txHash);
    
    // Poll for receipt
    let receipt = null;
    while (receipt === null) {
      try {
        receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
      } catch (e) {
        console.error('Error polling for receipt:', e);
      }
      
      if (receipt === null) {
        // Wait 2 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('Transaction confirmed:', receipt);
    return receipt;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}
```

## Compatibility Notes

### Browser Differences

Macro Browser implements the same provider API as MetaMask with some differences:

- All accounts are treated as "read-only" by default for security
- Contains extra security checks for potentially risky operations
- Provides additional methods for transaction analysis
- No support for legacy methods that have security implications

### Feature Detection

Always use feature detection instead of browser detection:

```javascript
// Check for specific method support
async function hasAnalysisSupport() {
  if (typeof window.ethereum === 'undefined') return false;
  
  try {
    // Try getting provider metadata
    const metadata = await window.ethereum.request({
      method: 'web3_clientVersion'
    });
    
    // Check for explicit macro support
    if (window.ethereum.isMacro === true) return true;
    
    // Check if client version mentions macro
    if (typeof metadata === 'string' && 
        metadata.toLowerCase().includes('macro')) {
      return true;
    }
    
    // Try calling macro-specific method
    try {
      await window.ethereum.request({
        method: 'macro_getVersion'
      });
      return true;
    } catch (e) {
      // Method doesn't exist
      return false;
    }
  } catch (error) {
    return false;
  }
}
``` 