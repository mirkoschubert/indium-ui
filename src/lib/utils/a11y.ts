/**
 * Accessibility Utilities
 *
 * Helper functions for improving accessibility in components.
 */

/**
 * Generates a unique ID for accessibility purposes
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateId(prefix = 'indium'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announces a message to screen readers via aria-live region
 * @param message - The message to announce
 * @param priority - 'polite' (default) or 'assertive'
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.classList.add('sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is made
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Traps focus within a container element (useful for modals)
 * @param container - The container element to trap focus within
 * @returns Cleanup function to remove listeners
 */
export function trapFocus(container: HTMLElement): () => void {
  if (typeof document === 'undefined') return () => {};

  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element
  firstElement?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Restores focus to a previously focused element
 * @param element - The element to restore focus to
 */
export function restoreFocus(element: HTMLElement | null): void {
  if (!element) return;

  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    element.focus();
  });
}

/**
 * Gets all focusable elements within a container
 * @param container - The container to search within
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
}

/**
 * Checks if an element is currently visible
 * @param element - The element to check
 * @returns True if the element is visible
 */
export function isVisible(element: HTMLElement): boolean {
  if (!element) return false;

  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Handles escape key press to close components
 * @param callback - Function to call when escape is pressed
 * @returns Cleanup function to remove listener
 */
export function onEscape(callback: () => void): () => void {
  if (typeof document === 'undefined') return () => {};

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Prevents body scroll (useful for modals)
 * @returns Cleanup function to restore scroll
 */
export function preventBodyScroll(): () => void {
  if (typeof document === 'undefined') return () => {};

  const originalStyle = window.getComputedStyle(document.body).overflow;
  document.body.style.overflow = 'hidden';

  return () => {
    document.body.style.overflow = originalStyle;
  };
}

/**
 * Checks if reduced motion is preferred by the user
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
