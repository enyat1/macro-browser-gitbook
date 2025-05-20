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
        
        // Fix search input styling with jQuery (in addition to CSS)
        fixDarkSearchInput();
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
  
  // Run fixes immediately
  setTimeout(function() {
    fixSVGImages();
    fixDarkSearchInput();
  }, 100);
  
  // Run again after a delay to catch late-loading elements
  setTimeout(function() {
    fixSVGImages();
    fixDarkSearchInput();
  }, 500);
  
  // And again after full page load
  window.addEventListener('load', function() {
    fixSVGImages();
    fixDarkSearchInput();
  });
  
  // Re-run on page changes (for SPA navigation)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        fixSVGImages();
        fixDarkSearchInput();
      }
    });
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'style', 'class', 'placeholder']
  });
});

// Function to ensure dark theme search input
function fixDarkSearchInput() {
  // Direct DOM manipulation approach
  const searchInputs = document.querySelectorAll('.book-search-input input, #book-search-input input, input.book-search-input-field');
  
  searchInputs.forEach(input => {
    input.style.backgroundColor = '#141521';
    input.style.color = '#f8f8f2';
    input.style.opacity = '1';
    
    // Force inline styling
    const parent = input.closest('.book-search-input');
    if (parent) {
      parent.style.backgroundColor = '#141521';
    }
    
    // Add a specific class we can target
    input.classList.add('dark-theme-fixed');
    
    // Create and apply an inline stylesheet
    if (!document.getElementById('dark-search-fix-style')) {
      const style = document.createElement('style');
      style.id = 'dark-search-fix-style';
      style.innerHTML = `
        .book-search-input,
        .book-search-input input,
        input.dark-theme-fixed,
        .book-search-input input.dark-theme-fixed {
          background-color: #141521 !important;
          color: #f8f8f2 !important;
          opacity: 1 !important;
        }
        
        .book-search-input input::placeholder,
        input.dark-theme-fixed::placeholder {
          color: #b8b9c5 !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Apply directly after focus events
    input.addEventListener('focus', function() {
      this.style.backgroundColor = '#141521';
      this.style.color = '#f8f8f2';
    });
    
    input.addEventListener('blur', function() {
      this.style.backgroundColor = '#141521';
      this.style.color = '#f8f8f2';
    });
  });
  
  // Also try jQuery approach if available
  if (typeof jQuery !== 'undefined') {
    jQuery('.book-search-input, .book-search-input input, #book-search-input, #book-search-input input').css({
      'background-color': '#141521',
      'color': '#f8f8f2',
      'opacity': '1'
    });
  }
} 