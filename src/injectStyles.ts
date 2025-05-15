/**
 * This utility injects critical styles directly into the DOM at runtime
 * to ensure they're applied even when there are style conflicts or specificity issues
 */

export function injectCriticalStyles() {
  // Create a style element
  const styleEl = document.createElement('style');
  
  // Set the CSS content with strong specificity selectors
  styleEl.textContent = `
    /* High specificity selectors for content container */
    html body .content-container,
    html body div.content-container,
    html body [class*="content-container"],
    html body #content-wrapper {
      padding: 48px 32px !important;
      box-sizing: border-box !important;
      width: 100% !important;
      max-width: 800px !important;
      margin-left: auto !important;
      margin-right: auto !important;
      display: block !important;
    }
    
    /* Target the content text container */
    html body .content-container > div,
    html body .text-container,
    html body div[ref="contentRef"] {
      width: 100% !important;
      max-width: 700px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      display: block !important;
    }
    
    /* Target paragraphs with ultra-high specificity */
    html body .content-container .content-text,
    html body p.content-text,
    html body div.text-container > p,
    html body [class*="content-text"] {
      max-width: 65ch !important;
      margin: 0 auto 1.5em !important;
      padding: 0 !important;
      width: 100% !important;
      box-sizing: border-box !important;
      display: block !important;
    }
    
    /* Fix any overflow issues */
    html body .content-container,
    html body .text-container,
    html body .content-text {
      overflow: visible !important;
    }
  `;
  
  // Add the style element to the head
  document.head.appendChild(styleEl);
  
  // Log confirmation
  console.log('Critical content padding styles injected');
  
  // We can also directly modify DOM elements if needed
  setTimeout(() => {
    const contentContainers = document.querySelectorAll('.content-container');
    contentContainers.forEach(container => {
      if (container instanceof HTMLElement) {
        container.style.padding = '48px 32px';
        container.style.boxSizing = 'border-box';
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.maxWidth = '800px';
        console.log('Applied direct style to content container');
      }
    });
  }, 500);
}

export default injectCriticalStyles;
