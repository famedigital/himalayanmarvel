/**
 * Color conversion utilities for html2canvas compatibility
 * Handles lab(), oklch(), and other modern color formats that html2canvas cannot parse
 */

/**
 * Converts CSS color values to formats html2canvas can parse
 * Handles lab(), oklch(), and other modern color formats
 */
export function sanitizeColorForCanvas(color: string): string {
  if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
    return 'transparent';
  }

  // Already safe formats - hex colors
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
    return color;
  }

  // Already safe formats - rgb/rgba without lab/oklch
  if (/^rgba?\(/.test(color) && !color.includes('lab(') && !color.includes('oklch(')) {
    return color;
  }

  // Named colors that are safe
  const safeNamedColors = [
    'transparent', 'black', 'white', 'red', 'green', 'blue',
    'yellow', 'cyan', 'magenta', 'gray', 'grey', 'orange', 'purple',
    'brown', 'pink', 'lime', 'navy', 'teal', 'olive', 'maroon',
    'aqua', 'fuchsia', 'silver', 'gold'
  ];
  if (safeNamedColors.includes(color.toLowerCase())) {
    return color;
  }

  // Use browser to convert lab/oklch to RGB
  // We create a temporary element, apply the color, and read the computed value
  const temp = document.createElement('div');
  temp.style.color = color;
  temp.style.display = 'none';
  document.body.appendChild(temp);

  try {
    const computed = window.getComputedStyle(temp).color;
    // The computed value should be in rgb() or rgba() format which html2canvas supports
    return computed;
  } catch {
    // Fallback for any errors
    return '#000000';
  } finally {
    document.body.removeChild(temp);
  }
}

/**
 * Sanitizes all color properties on an element and its children
 * Recursively processes all color-related CSS properties
 */
export function sanitizeElementColors(element: HTMLElement): void {
  const colorProps = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    'columnRuleColor',
    'caretColor',
  ];

  // Sanitize inline styles on current element
  colorProps.forEach(prop => {
    const value = element.style.getPropertyValue(prop);
    if (value) {
      const sanitized = sanitizeColorForCanvas(value);
      element.style.setProperty(prop, sanitized, 'important');
    }
  });

  // Recursively sanitize children
  for (const child of element.children) {
    sanitizeElementColors(child as HTMLElement);
  }
}

/**
 * Sanitizes CSS custom properties (CSS variables) that contain colors
 * Useful for elements that use var() in their styles
 */
export function sanitizeCssVariables(element: HTMLElement): void {
  const colorVarNames = [
    'color', 'background', 'foreground', 'border',
    'primary', 'secondary', 'accent', 'muted', 'destructive'
  ];

  // Get computed styles to find CSS variable usage
  const computed = window.getComputedStyle(element);

  colorVarNames.forEach(varName => {
    // Check for common CSS variable patterns
    const patterns = [
      `--${varName}`,
      `--${varName}-foreground`,
      `--${varName}-background`
    ];

    patterns.forEach(pattern => {
      const value = computed.getPropertyValue(pattern);
      if (value) {
        element.style.setProperty(pattern, sanitizeColorForCanvas(value), 'important');
      }
    });
  });
}
