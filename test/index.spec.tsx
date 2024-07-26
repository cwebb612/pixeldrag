import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';


import Page from '../src/app/page';

describe('Page', () => {

  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });

  it('should update on image upload', async () => {
      render(<Page />);

			const insertButton = screen.getByText("Insert Image");

      expect(insertButton).toBeTruthy();
  })
});
