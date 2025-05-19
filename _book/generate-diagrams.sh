#!/bin/bash

# Create the necessary directories
mkdir -p diagrams
mkdir -p images/diagrams

# Create and convert network architecture diagrams
echo 'Creating network architecture diagrams...'
npx mmdc -i diagrams/network-architecture-diagram-1.mmd -o images/diagrams/network-architecture-diagram-1.svg -c mermaid.config.json -w 1000 -H 800
npx mmdc -i diagrams/network-architecture-diagram-2.mmd -o images/diagrams/network-architecture-diagram-2.svg -c mermaid.config.json -w 1000 -H 800
npx mmdc -i diagrams/network-architecture-diagram-3.mmd -o images/diagrams/network-architecture-diagram-3.svg -c mermaid.config.json -w 1000 -H 800
npx mmdc -i diagrams/network-architecture-diagram-4.mmd -o images/diagrams/network-architecture-diagram-4.svg -c mermaid.config.json -w 1000 -H 800

# Create and convert browser engine diagrams
echo 'Creating browser engine diagrams...'
npx mmdc -i diagrams/browser-engine-diagram-1.mmd -o images/diagrams/browser-engine-diagram-1.svg -c mermaid.config.json -w 1000 -H 800

# Create and convert integration guide diagrams
echo 'Creating integration guide diagrams...'
npx mmdc -i diagrams/integration-guide-diagram-1.mmd -o images/diagrams/integration-guide-diagram-1.svg -c mermaid.config.json -w 1000 -H 800

# Create and convert privacy layer diagrams
echo 'Creating privacy layer diagrams...'
npx mmdc -i diagrams/privacy-layer-diagram-1.mmd -o images/diagrams/privacy-layer-diagram-1.svg -c mermaid.config.json -w 1000 -H 800
npx mmdc -i diagrams/privacy-layer-diagram-2.mmd -o images/diagrams/privacy-layer-diagram-2.svg -c mermaid.config.json -w 1000 -H 800

# Create and convert performance guide diagrams
echo 'Creating performance guide diagrams...'
npx mmdc -i diagrams/performance-guide-diagram-1.mmd -o images/diagrams/performance-guide-diagram-1.svg -c mermaid.config.json -w 1000 -H 800

# Create and convert technical overview diagrams
echo 'Creating technical overview diagrams...'
npx mmdc -i diagrams/readme-diagram-1.mmd -o images/diagrams/readme-diagram-1.svg -c mermaid.config.json -w 1000 -H 800
npx mmdc -i diagrams/readme-diagram-2.mmd -o images/diagrams/readme-diagram-2.svg -c mermaid.config.json -w 1000 -H 800

# Create and convert extension guide diagrams
echo 'Creating extension guide diagrams...'
npx mmdc -i diagrams/extension-guide-diagram-1.mmd -o images/diagrams/extension-guide-diagram-1.svg -c mermaid.config.json -w 1000 -H 800

echo 'All diagrams generated successfully!' 