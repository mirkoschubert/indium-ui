/**
 * Button Component Tests
 *
 * Unit tests for the Button component.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders with default props', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Click me</span>`,
    }));

    const { getByRole } = render(Button, { props: { children } });

    const button = getByRole('button');
    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe('Click me');
  });

  it('applies variant classes correctly', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Button</span>`,
    }));

    const { getByRole } = render(Button, {
      props: {
        variant: 'secondary',
        children
      }
    });

    const button = getByRole('button');
    expect(button.classList.contains('button-secondary')).toBe(true);
  });

  it('applies size classes correctly', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Button</span>`,
    }));

    const { getByRole } = render(Button, {
      props: {
        size: 'lg',
        children
      }
    });

    const button = getByRole('button');
    expect(button.classList.contains('button-lg')).toBe(true);
  });

  it('disables button when disabled prop is true', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Button</span>`,
    }));

    const { getByRole } = render(Button, {
      props: {
        disabled: true,
        children
      }
    });

    const button = getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('shows loading spinner when loading', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Button</span>`,
    }));

    const { getByRole, container } = render(Button, {
      props: {
        loading: true,
        children
      }
    });

    const button = getByRole('button');
    const spinner = container.querySelector('.button-spinner');

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(spinner).toBeTruthy();
  });

  it('applies fullWidth class when fullWidth is true', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Button</span>`,
    }));

    const { getByRole } = render(Button, {
      props: {
        fullWidth: true,
        children
      }
    });

    const button = getByRole('button');
    expect(button.classList.contains('button-full')).toBe(true);
  });

  it('applies custom className', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Button</span>`,
    }));

    const { getByRole } = render(Button, {
      props: {
        class: 'custom-class',
        children
      }
    });

    const button = getByRole('button');
    expect(button.classList.contains('custom-class')).toBe(true);
  });

  it('sets button type correctly', () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Button</span>`,
    }));

    const { getByRole } = render(Button, {
      props: {
        type: 'submit',
        children
      }
    });

    const button = getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });
});
