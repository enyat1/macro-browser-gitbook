#!/bin/bash

echo "Searching for remaining Mermaid code blocks in documentation..."

# Find all markdown files
find . -name "*.md" -type f | while read -r file; do
  # Count mermaid blocks in the file
  mermaid_count=$(grep -c "^\`\`\`mermaid" "$file")
  
  if [ "$mermaid_count" -gt 0 ]; then
    echo "Found $mermaid_count mermaid blocks in $file"
  fi
done

echo "Search complete." 