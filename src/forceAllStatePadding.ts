/**
 * This utility specifically targets ALL states of the content container
 * to ensure consistent padding regardless of what is being displayed
 */

export function applyPaddingToAllStates() {
  // Apply initial styles
  applyStyles();
  
  // Also set up a mutation observer to apply styles when DOM changes
  const observer = new MutationObserver(() => {
    applyStyles();
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  
  console.log('Content state padding observer enabled');
  
  return () => {
    // Return cleanup function
    observer.disconnect();
  };
}

function applyStyles() {
  // Find all content containers
  const containers = document.querySelectorAll('.content-container');
  containers.forEach(container => {
    if (container instanceof HTMLElement) {
      // Force padding on the container itself
      container.style.padding = '48px 32px';
      container.style.boxSizing = 'border-box';
      container.style.width = '100%';
      container.style.maxWidth = '800px';
      container.style.margin = '0 auto';
      container.style.display = 'block';
      
      // Apply to children based on their roles
      const children = container.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        
        // Check what type of content this is
        if (child.classList.contains('flex')) {
          // Loading state
          child.style.width = '100%';
          child.style.maxWidth = '700px';
          child.style.margin = '0 auto';
          child.style.padding = '24px';
        } else if (child.classList.contains('text-center')) {
          // Error or empty state
          child.style.width = '100%';
          child.style.maxWidth = '700px';
          child.style.margin = '0 auto';
          child.style.padding = '24px';
        } else {
          // Content state
          child.style.width = '100%';
          child.style.maxWidth = '700px';
          child.style.margin = '0 auto';
          child.style.padding = '0';
        }
      }
    }
  });
}

export default applyPaddingToAllStates;
