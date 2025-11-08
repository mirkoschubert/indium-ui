/**
 * Button Component Tests
 *
 * Unit tests for the Button component.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders with default props', () => {
    const { container } = render(Button, {
      props: {
        children: () => 'Click me'
      }
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.textContent).toBe('Click me');
  });

  it('applies variant classes correctly', () => {
    const { container } = render(Button, {
      props: {
        variant: 'secondary',
        children: () => 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('button-secondary')).toBe(true);
  });

  it('applies size classes correctly', () => {
    const { container } = render(Button, {
      props: {
        size: 'lg',
        children: () => 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('button-lg')).toBe(true);
  });

  it('disables button when disabled prop is true', () => {
    const { container } = render(Button, {
      props: {
        disabled: true,
        children: () => 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('shows loading spinner when loading', () => {
    const { container } = render(Button, {
      props: {
        loading: true,
        children: () => 'Button'
      }
    });

    const button = container.querySelector('button');
    const spinner = container.querySelector('.button-spinner');

    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(spinner).toBeTruthy();
  });

  it('applies fullWidth class when fullWidth is true', () => {
    const { container } = render(Button, {
      props: {
        fullWidth: true,
        children: () => 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('button-full')).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(Button, {
      props: {
        class: 'custom-class',
        children: () => 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('custom-class')).toBe(true);
  });

  it('sets button type correctly', () => {
    const { container } = render(Button, {
      props: {
        type: 'submit',
        children: () => 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.type).toBe('submit');
  });
});
