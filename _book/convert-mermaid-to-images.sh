#!/bin/bash

echo "Converting Mermaid blocks to static image references..."

# Make sure directories exist
mkdir -p diagrams
mkdir -p images/diagrams

# Process each markdown file excluding node_modules
find . -path "./node_modules" -prune -o -name "*.md" -type f | while read -r file; do
  basename=$(basename "$file" .md)
  dirname=$(dirname "$file")
  cleaned_dirname=$(echo "$dirname" | sed 's/^\.\///')
  
  # Skip if no mermaid blocks
  mermaid_count=$(grep -c "^\`\`\`mermaid" "$file")
  if [ "$mermaid_count" -eq 0 ]; then
    continue
  fi
  
  echo "Processing $file ($mermaid_count mermaid blocks)"
  
  # Create a temporary file for the modified content
  temp_file=$(mktemp)
  
  # Initialize counter for this file
  counter=1
  
  # Process each mermaid block in the file
  line_num=1
  in_mermaid_block=0
  mermaid_start_line=0
  mermaid_content=""
  
  while IFS= read -r line; do
    if [[ "$in_mermaid_block" -eq 0 && "$line" == "\`\`\`mermaid" ]]; then
      # Beginning of mermaid block
      in_mermaid_block=1
      mermaid_start_line=$line_num
      mermaid_content=""
    elif [[ "$in_mermaid_block" -eq 1 && "$line" == "\`\`\`" ]]; then
      # End of mermaid block
      in_mermaid_block=0
      
      # Generate unique name for the diagram
      diagram_file="diagrams/${cleaned_dirname}_${basename}_diagram_${counter}.mmd"
      mkdir -p "$(dirname "$diagram_file")"
      
      # Save mermaid content to file
      echo "$mermaid_content" > "$diagram_file"
      
      # Generate SVG
      image_file="images/diagrams/${cleaned_dirname}_${basename}_diagram_${counter}.svg"
      mkdir -p "$(dirname "$image_file")"
      
      echo "Generating $image_file"
      npx mmdc -i "$diagram_file" -o "$image_file" -c mermaid.config.json -w 1000 -H 800
      
      # Replace mermaid block with image reference
      image_path="/images/diagrams/${cleaned_dirname}_${basename}_diagram_${counter}.svg"
      echo "![Diagram $counter]($image_path)" >> "$temp_file"
      
      counter=$((counter + 1))
    elif [[ "$in_mermaid_block" -eq 1 ]]; then
      # Inside mermaid block, collect content
      mermaid_content="${mermaid_content}${line}
"
    else
      # Outside mermaid block, copy line as is
      echo "$line" >> "$temp_file"
    fi
    
    line_num=$((line_num + 1))
  done < "$file"
  
  # Replace original file with modified content
  if [ "$counter" -gt 1 ]; then
    mv "$temp_file" "$file"
    echo "Updated $file with $((counter - 1)) static image references"
  else
    rm "$temp_file"
  fi
done

echo "Conversion complete." 