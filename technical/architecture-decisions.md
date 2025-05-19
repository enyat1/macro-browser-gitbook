# Architecture Decisions

This document captures the key architectural decisions made during the development of Macro Browser, providing context, rationale, and consequences for each decision.

## ADR Format

Each architecture decision record (ADR) follows this format:

- **Decision**: The architectural decision that was made
- **Context**: Background information and forces that influenced the decision
- **Options Considered**: Alternative approaches that were evaluated
- **Decision Outcome**: The selected approach and its justification
- **Consequences**: Positive and negative implications of the decision

## Browser Engine Selection

### Decision

Use Electron with Chromium as the browser engine foundation.

### Context

- Need for a modern, standards-compliant browser engine
- Cross-platform compatibility requirements
- Development speed and resource constraints
- Need for native-like performance
- Ability to modify for privacy enhancements

### Options Considered

1. **Build custom engine from scratch**
   - Complete control over all aspects
   - Enormous development effort
   - High risk of compatibility issues
   - Unsustainable maintenance burden

2. **Fork Firefox/Gecko**
   - Already privacy-focused
   - Smaller market share than Chromium
   - More complex embedding API
   - Higher resource requirements for development

3. **Use Electron/Chromium**
   - Well-documented, widely used
   - Easier to modify and extend
   - Large ecosystem of tools and libraries
   - Cross-platform by default
   - Consistent with many user expectations

4. **WebKit-based approach**
   - Apple's engine with good performance
   - Limited extensibility
   - Platform limitations on non-Apple systems

### Decision Outcome

Electron with Chromium was selected because it provides:
- Mature, widely-tested browser engine
- Easy cross-platform compatibility
- Familiar development model
- Strong performance characteristics
- Good balance of control vs. development effort

### Consequences

- **Positive**: Faster development cycle, broad compatibility
- **Positive**: Leverage existing Chromium security infrastructure
- **Negative**: Need to actively remove Google-specific services
- **Negative**: Larger memory footprint than some alternatives

## Privacy Model

### Decision

Implement "Privacy by Default" with no persistent browsing data.

### Context

- User privacy is a core value
- Traditional browsers store extensive data by default
- Private browsing modes are typically opt-in
- Need to balance privacy with usability

### Options Considered

1. **Traditional model with optional private mode**
   - Familiar to users
   - Requires explicit action for privacy
   - Risk of accidental data leakage

2. **Privacy by default with opt-in persistence**
   - Maximum privacy protection
   - Potential user confusion
   - Some features more difficult to implement

3. **Hybrid model with selective persistence**
   - Balance of privacy and convenience
   - Complex implementation
   - Potential privacy leaks through saved data

### Decision Outcome

"Privacy by Default" was selected because it:
- Aligns with core values
- Provides strongest privacy protection
- Creates a distinctive product
- Prevents accidental data exposure

### Consequences

- **Positive**: Strong privacy guarantees
- **Positive**: Differentiating feature in the market
- **Negative**: Some convenience features more difficult to implement
- **Negative**: Potential user education challenges

## P2P VPN Architecture

### Decision

Implement a peer-to-peer VPN based on WireGuard with custom extensions.

### Context

- Traditional VPNs have central servers that could log data
- Need for enhanced privacy beyond standard browser features
- Desire for a distributed system resistant to single points of failure
- Performance considerations for daily browsing

### Options Considered

1. **Traditional centralized VPN**
   - Established technology
   - Requires trust in VPN provider
   - Single point of failure
   - Simpler implementation

2. **Tor-like onion routing**
   - Very strong anonymity
   - Significant performance impact
   - Complex implementation
   - Not ideal for all browsing tasks

3. **Custom P2P VPN**
   - No central logging entity
   - More resilient architecture
   - Performance can be optimized
   - Challenges with NAT traversal and peer discovery

4. **Local proxy with encrypted DNS only**
   - Minimal performance impact
   - Limited privacy benefits
   - Simpler implementation
   - Not as comprehensive

### Decision Outcome

Custom P2P VPN was selected because it:
- Provides strong privacy without central servers
- Offers reasonable performance with optimization
- Creates a resilient network architecture
- Aligns with decentralization principles

### Consequences

- **Positive**: No central entity has access to browsing data
- **Positive**: Resilient to central point of failure
- **Negative**: More complex implementation
- **Negative**: Requires addressing peer discovery and NAT traversal challenges

## Web3 Integration Approach

### Decision

Adopt a provider-based architecture with support for external wallets and built-in wallet connector.

### Context

- Need for seamless integration with blockchain networks
- Users often have existing wallets they prefer
- Security considerations for key management
- Desire to avoid reinventing wallet technology

### Options Considered

1. **Built-in wallet only**
   - Complete control over user experience
   - Forces users to manage another wallet
   - Significant security responsibility
   - Limited by browser development resources

2. **External wallet support only**
   - Leverages established wallet security
   - Users can use their preferred wallets
   - Less control over user experience
   - Potential compatibility issues

3. **Hybrid approach with wallet connector**
   - Flexibility for users with existing wallets
   - Consistent interface regardless of wallet
   - Balanced development effort
   - Enhanced security through delegation

### Decision Outcome

The hybrid approach with wallet connector was selected because it:
- Provides the best balance of security and usability
- Respects user choice of wallets
- Reduces security burden on the browser
- Creates a consistent experience

### Consequences

- **Positive**: Users can use their preferred wallets
- **Positive**: Reduced security scope for the browser
- **Negative**: More complex integration testing required
- **Negative**: Some inconsistency in wallet-specific features

## AI Search Implementation

### Decision

Implement a privacy-preserving AI search using a combination of local processing and anonymized API calls.

### Context

- Desire for intelligent search capabilities
- Strong privacy requirements
- Limited on-device AI capabilities
- Need for fallback options

### Options Considered

1. **Fully cloud-based AI processing**
   - Most powerful AI capabilities
   - Privacy concerns with query data
   - Requires constant network connectivity
   - Potentially higher latency

2. **On-device AI only**
   - Maximum privacy protection
   - Limited by device capabilities
   - Larger application size
   - Less powerful features

3. **Hybrid approach with anonymization**
   - Balance of capability and privacy
   - More complex implementation
   - Flexible based on query type
   - Can evolve as on-device AI improves

### Decision Outcome

The hybrid approach with anonymization was selected because it:
- Provides AI capabilities while respecting privacy
- Allows for graceful degradation when needed
- Balances performance and features
- Creates path for future improvements

### Consequences

- **Positive**: AI features without compromising privacy
- **Positive**: Flexibility in processing location
- **Negative**: More complex query routing logic
- **Negative**: Some features require network connectivity

## Multi-Process Architecture

### Decision

Adopt a multi-process architecture with strict isolation between components.

### Context

- Security requirements for handling untrusted web content
- Stability considerations to prevent single component crashes affecting the whole browser
- Performance needs for modern web applications
- Memory usage considerations

### Options Considered

1. **Single-process architecture**
   - Simpler implementation
   - Lower memory overhead
   - Poor isolation
   - Stability risks

2. **Process-per-tab model**
   - Strong isolation between tabs
   - High memory usage
   - Well-established approach
   - Good stability characteristics

3. **Hybrid model with selective process allocation**
   - Balance of resource usage and isolation
   - More complex process management
   - Potentially confusing behavior
   - Difficult to explain to users

### Decision Outcome

The process-per-tab model was selected because it:
- Provides strongest security isolation
- Prevents crashes from affecting the entire browser
- Aligns with modern browser architecture
- Simplifies the mental model

### Consequences

- **Positive**: Strong security and stability
- **Positive**: Alignment with modern browser expectations
- **Negative**: Higher memory usage
- **Negative**: More complex process communication 