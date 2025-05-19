// Custom JavaScript for Macro Browser Documentation

require(['gitbook', 'jQuery'], function(gitbook, $) {
    // Add custom logo to the sidebar
    gitbook.events.bind('start', function(e, config) {
        // Add logo to sidebar
        $('.book-summary').prepend(
            $('<div class="book-logo">')
                .append($('<a>')
                    .attr('href', '/')
                    .append($('<img>')
                        .attr('src', '/styles/images/logo.svg')
                        .attr('alt', 'Macro Browser Documentation')
                    )
                )
        );
    });

    // Additional customizations can be added here
    gitbook.events.bind('page.change', function() {
        // Apply custom styling to specific elements after page changes
        
        // Add custom class to tables
        $('.markdown-section table').addClass('macro-table');
        
        // Add custom styling to the main content area
        $('.page-inner').addClass('macro-content');
        
        // Enhance code blocks with copy button
        $('.markdown-section pre').each(function() {
            // Skip if already processed
            if ($(this).hasClass('macro-code-processed')) return;
            
            // Add custom class
            $(this).addClass('macro-code-processed');
            
            // Add copy button
            var $copyBtn = $('<button class="copy-btn">Copy</button>');
            $(this).append($copyBtn);
            
            // Copy functionality
            $copyBtn.click(function() {
                var code = $(this).siblings('code').text();
                var $temp = $('<textarea>');
                $('body').append($temp);
                $temp.val(code).select();
                document.execCommand('copy');
                $temp.remove();
                
                // Show copied message
                $(this).text('Copied!');
                var $btn = $(this);
                setTimeout(function() {
                    $btn.text('Copy');
                }, 2000);
            });
        });
    });
});

// Macro Browser Documentation JavaScript

// Wait for page load
document.addEventListener('DOMContentLoaded', function() {
  
  // More aggressive fix for SVG images alignment and display
  function fixSVGImages() {
    const images = document.querySelectorAll('.markdown-section img');
    
    images.forEach(img => {
      const src = img.getAttribute('src');
      
      // First fix image paths if needed
      if (src && src.startsWith('/') && !img.complete) {
        try {
          const newSrc = src.substring(1);
          img.setAttribute('src', newSrc);
        } catch (e) {
          console.log('Error fixing image path:', e);
        }
      }
      
      // Apply special styling to feature images
      if (src && (
          src.endsWith('.svg') || 
          src.includes('/features/') || 
          src.includes('features/')
        )) {
        img.style.display = 'block';
        img.style.margin = '2em auto';
        img.style.maxWidth = '700px';
        img.style.width = '90%';
        img.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
        
        // Center the image container
        if (img.parentNode && img.parentNode.tagName !== 'BODY') {
          img.parentNode.style.textAlign = 'center';
          // Add margin to parent to avoid text overlap
          img.parentNode.style.marginBottom = '2em';
        }
      }
    });
  }
  
  // ULTIMATE search input fix with all possible approaches
  function fixSearchInput() {
    // Find all inputs with attribute and class selectors
    const selectors = [
      '.book-search-input input',
      'input[type="text"].book-search-input-field',
      '.book-search input',
      'input[placeholder="Type to search"]',
      'input[type="text"]'
    ];
    
    // Combined selectors for efficiency
    const searchInputs = document.querySelectorAll(selectors.join(', '));
    
    searchInputs.forEach(input => {
      // Check if this is likely a search input by its context
      const isSearchLike = 
        (input.getAttribute('placeholder') && input.getAttribute('placeholder').toLowerCase().includes('search')) ||
        (input.getAttribute('placeholder') && input.getAttribute('placeholder').toLowerCase().includes('type to')) ||
        (input.classList && (input.classList.contains('book-search-input') || input.classList.contains('book-search'))) ||
        (input.parentElement && input.parentElement.classList && 
          (input.parentElement.classList.contains('book-search-input') || 
           input.parentElement.classList.contains('book-search')));
      
      if (isSearchLike || selectors.some(s => input.matches(s))) {
        // Apply direct inline style with !important
        input.setAttribute('style', 
          'color: #f8f8f2 !important; ' +
          'background-color: #141521 !important; ' + 
          'opacity: 1 !important; ' +
          'border-color: #2a2c3d !important;'
        );
        
        // Add a data attribute to mark as fixed
        input.setAttribute('data-search-fixed', 'true');
        
        // Add our custom class
        input.classList.add('dark-theme-search');
        
        // Direct property setting
        input.style.setProperty('color', '#f8f8f2', 'important');
        input.style.setProperty('background-color', '#141521', 'important');
        input.style.setProperty('opacity', '1', 'important');
        
        // Add event listeners to maintain style on interaction
        input.addEventListener('focus', function() {
          this.style.setProperty('color', '#f8f8f2', 'important');
          this.style.setProperty('background-color', '#141521', 'important');
        });
        
        input.addEventListener('blur', function() {
          this.style.setProperty('color', '#f8f8f2', 'important');
          this.style.setProperty('background-color', '#141521', 'important');
        });
        
        // Try to affect parent container too
        if (input.parentElement) {
          input.parentElement.style.backgroundColor = '#141521';
        }
      }
    });
    
    // Last resort: inject a stylesheet with high specificity
    const existingStyle = document.getElementById('emergency-search-fix');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'emergency-search-fix';
      style.textContent = `
        input[type="text"], 
        .book-search-input input,
        input.book-search-input,
        .book-search input,
        body input[placeholder="Type to search"],
        input[data-search-fixed="true"] {
          color: #f8f8f2 !important;
          background-color: #141521 !important;
          opacity: 1 !important;
        }
        
        input[type="text"]::placeholder,
        .book-search-input input::placeholder,
        input.book-search-input::placeholder,
        .book-search input::placeholder,
        input[placeholder="Type to search"]::placeholder,
        input[data-search-fixed="true"]::placeholder {
          color: #b8b9c5 !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Run fixes immediately
  fixSVGImages();
  fixSearchInput();
  
  // Run again after 100ms
  setTimeout(function() {
    fixSVGImages();
    fixSearchInput();
  }, 100);
  
  // And after 500ms
  setTimeout(function() {
    fixSVGImages();
    fixSearchInput();
  }, 500);
  
  // And again after 1s
  setTimeout(function() {
    fixSVGImages();
    fixSearchInput();
  }, 1000);
  
  // And periodically every 2s
  setInterval(function() {
    fixSVGImages();
    fixSearchInput();
  }, 2000);
  
  // Run on page load 
  window.addEventListener('load', function() {
    fixSVGImages();
    fixSearchInput();
  });
  
  // Re-run on page changes (for SPA navigation)
  const observer = new MutationObserver(function(mutations) {
    let shouldFix = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        shouldFix = true;
      }
    });
    
    if (shouldFix) {
      fixSVGImages();
      fixSearchInput();
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'style', 'class', 'placeholder']
  });
}); 