/**
 * This utility automatically swaps to the wrapper version of ContentDisplay 
 * if the padding isn't applied correctly after a few seconds
 */

export function monitorAndFixPadding() {
  // Check after a short delay to let initial rendering complete
  setTimeout(() => {
    const contentContainers = document.querySelectorAll('.content-container');
    
    contentContainers.forEach(container => {
      if (container instanceof HTMLElement) {
        // Check if padding is applied correctly
        const computedStyle = window.getComputedStyle(container);
        const paddingLeft = parseInt(computedStyle.paddingLeft || '0', 10);
        const paddingRight = parseInt(computedStyle.paddingRight || '0', 10);
        
        if (paddingLeft < 30 || paddingRight < 30) {
          console.log('Padding not applied correctly, applying emergency fix');
          
          // Apply direct style overrides
          container.style.padding = '48px 32px';
          container.style.boxSizing = 'border-box';
          container.style.width = '100%';
          container.style.maxWidth = '800px';
          container.style.margin = '0 auto';
          container.style.display = 'block';
          
          // Also try to wrap the container with a div that has padding
          try {
            const parent = container.parentElement;
            if (parent) {
              const wrapper = document.createElement('div');
              wrapper.className = 'emergency-padding-wrapper';
              wrapper.style.padding = '48px 32px';
              wrapper.style.boxSizing = 'border-box';
              wrapper.style.width = '100%';
              wrapper.style.maxWidth = '800px';
              wrapper.style.margin = '0 auto';
              
              // Replace the container with our wrapper + container
              parent.replaceChild(wrapper, container);
              wrapper.appendChild(container);
              
              console.log('Emergency wrapper added');
            }
          } catch (error) {
            console.error('Error applying emergency wrapper', error);
          }
        } else {
          console.log('Padding correctly applied:', paddingLeft, paddingRight);
        }
      }
    });
  }, 1000); // Check after 1 second
}

export default monitorAndFixPadding;
