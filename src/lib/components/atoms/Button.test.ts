/**
 * Button Component Tests
 *
 * Unit tests for the Button component.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ButtonTest from './ButtonTest.test.svelte';

describe('Button', () => {
  it('renders with default props', () => {
    const { container } = render(ButtonTest, {
      props: {
        text: 'Click me'
      }
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Click me');
  });

  it('applies variant classes correctly', () => {
    const { container } = render(ButtonTest, {
      props: {
        variant: 'secondary',
        text: 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('button-secondary')).toBe(true);
  });

  it('applies size classes correctly', () => {
    const { container } = render(ButtonTest, {
      props: {
        size: 'lg',
        text: 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('button-lg')).toBe(true);
  });

  it('disables button when disabled prop is true', () => {
    const { container } = render(ButtonTest, {
      props: {
        disabled: true,
        text: 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('shows loading spinner when loading', () => {
    const { container } = render(ButtonTest, {
      props: {
        loading: true,
        text: 'Button'
      }
    });

    const button = container.querySelector('button');
    const spinner = container.querySelector('.button-spinner');

    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(spinner).toBeTruthy();
  });

  it('applies fullWidth class when fullWidth is true', () => {
    const { container } = render(ButtonTest, {
      props: {
        fullWidth: true,
        text: 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('button-full')).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(ButtonTest, {
      props: {
        class: 'custom-class',
        text: 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.classList.contains('custom-class')).toBe(true);
  });

  it('sets button type correctly', () => {
    const { container } = render(ButtonTest, {
      props: {
        type: 'submit',
        text: 'Button'
      }
    });

    const button = container.querySelector('button');
    expect(button?.type).toBe('submit');
  });
});
