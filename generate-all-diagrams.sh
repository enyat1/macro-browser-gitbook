#!/bin/bash

# Create directories if they don't exist
mkdir -p diagrams
mkdir -p images/diagrams

# Function to extract and convert Mermaid diagrams
process_file() {
  local file=$1
  local basename=$(basename "$file" .md)
  local dirname=$(dirname "$file")
  local counter=1

  # Extract Mermaid blocks and generate diagrams
  grep -n "^```mermaid" "$file" | while read -r line; do
    line_num=$(echo "$line" | cut -d: -f1)
    start_line=$((line_num + 1))
    
    # Find the end of the Mermaid block
    end_line=$(tail -n +$start_line "$file" | grep -n "^```" | head -1 | cut -d: -f1)
    end_line=$((start_line + end_line - 1))
    
    # Extract Mermaid content
    diagram_file="diagrams/${basename}-diagram-${counter}.mmd"
    sed -n "${start_line},${end_line}p" "$file" > "$diagram_file"
    
    # Generate SVG
    output_file="images/diagrams/${basename}-diagram-${counter}.svg"
    npx mmdc -i "$diagram_file" -o "$output_file" -c mermaid.config.json -w 1000 -H 800
    
    echo "Generated $output_file from $file (lines $start_line-$end_line)"
    counter=$((counter + 1))
  done
}

# Process files with Mermaid diagrams
process_file "technical/network-architecture.md"
process_file "technical/browser-engine.md"
process_file "developers/integration-guide.md"
process_file "technical/privacy-layer.md"
process_file "developers/performance-guide.md"
process_file "technical/README.md"
process_file "developers/extension-guide.md"

echo "All diagrams generated successfully!" 