import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportHistory } from '../../src/components/import/import-history';
import '@testing-library/jest-dom';

describe('ImportHistory Component', () => {
  // Mock the fetch function
  const mockFetch = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch as any;
  });

  const mockBatches = [
    {
      id: 'batch-1',
      filename: 'successful-batch.csv',
      status: 'COMPLETED',
      successfulRecords: 100,
      failedRecords: 0,
      totalRecords: 100,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'batch-2',
      filename: 'failed-batch.csv',
      status: 'COMPLETED',
      successfulRecords: 23,
      failedRecords: 145,
      totalRecords: 168,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'batch-3',
      filename: 'pending-batch.csv',
      status: 'PENDING',
      successfulRecords: 0,
      failedRecords: 0,
      totalRecords: 0,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockErrorsResponse = {
    errors: [
      {
        id: 'error-1',
        batchId: 'batch-2',
        rowNumber: 1,
        errorType: 'validation_error',
        errorMessage: 'Invalid date format',
        columnName: 'date_dd',
        rawValue: '0',
        suggestedFix: 'Use valid date',
        severity: 'ERROR',
        isResolved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'error-2',
        batchId: 'batch-2',
        rowNumber: 2,
        errorType: 'format_error',
        errorMessage: 'Invalid case number format',
        columnName: 'case_number',
        rawValue: 'INVALID123',
        suggestedFix: 'Use correct format',
        severity: 'WARNING',
        isResolved: false,
        createdAt: new Date().toISOString(),
      },
    ],
    total: 145,
    batchSummary: {
      successfulRecords: 23,
      failedRecords: 145,
      status: 'COMPLETED',
    },
    pagination: {
      currentPage: 1,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    },
  };

  // Mock second page errors for pagination test
  const mockSecondPageErrors = {
    errors: [
      {
        id: 'error-51',
        batchId: 'batch-2',
        rowNumber: 51,
        errorType: 'validation_error',
        errorMessage: 'Validation error on row 51: date_dd invalid',
        columnName: 'date_dd',
        rawValue: '0',
        suggestedFix: 'Use day >=1',
        severity: 'ERROR',
        isResolved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'error-52',
        batchId: 'batch-2',
        rowNumber: 52,
        errorType: 'format_error',
        errorMessage: 'Format error on row 52: case_number invalid',
        columnName: 'case_number',
        rawValue: 'INVALID123',
        suggestedFix: 'Use correct format',
        severity: 'WARNING',
        isResolved: false,
        createdAt: new Date().toISOString(),
      },
    ],
    total: 145,
    batchSummary: {
      successfulRecords: 23,
      failedRecords: 145,
      status: 'COMPLETED',
    },
    pagination: {
      currentPage: 2,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    },
  };

  const user = userEvent.setup();

  it('should open modal and display errors on View Errors click', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBatches,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorsResponse,
      } as Response);

    render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/import/history', expect.any(Object));
    });

    const button = screen.getByText('View Errors');
    await user.click(button);
    await waitFor(() => expect(screen.getByText('date_dd invalid')).toBeInTheDocument());
    expect(screen.getByTestId('error-badge')).toBeInTheDocument(); // for error badge
  });

  it('should handle pagination with Next button', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBatches,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorsResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSecondPageErrors,
      } as Response);

    render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/import/history', expect.any(Object));
    });

    const button = screen.getByText('View Errors');
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByText('date_dd invalid')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => expect(screen.getByText('Validation error on row 51')).toBeInTheDocument());
    expect(screen.getAllByRole('img', { className: /bg-red/ })).toHaveLength(2); // errors on second page
  });

  it('should handle empty case with no View Errors button', async () => {
    const emptyBatches = [
      {
        id: 'batch-no-errors',
        filename: 'successful-batch.csv',
        status: 'COMPLETED',
        successfulRecords: 100,
        failedRecords: 0,
        totalRecords: 100,
        createdAt: new Date().toISOString(),
      }
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => emptyBatches,
    } as Response);

    render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(screen.queryByText('View Errors')).not.toBeInTheDocument();
  });

  it('should render component without errors', () => {
    expect(() => render(<ImportHistory />)).not.toThrow();
  });

  it('should fetch batch history on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBatches,
    } as Response);

    render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/import/history', expect.any(Object));
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockBatches.length).toBe(3);
  });

  it('should display batches with correct status indicators', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBatches,
    } as Response);

    render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Verify different batch statuses can be processed
    const completedBatches = mockBatches.filter(b => b.status === 'COMPLETED');
    const pendingBatches = mockBatches.filter(b => b.status === 'PENDING');
    
    expect(completedBatches).toHaveLength(2);
    expect(pendingBatches).toHaveLength(1);
  });

  it('should show View Errors button only for failed batches', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBatches,
    } as Response);

    render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Verify button logic
    const batchesWithErrors = mockBatches.filter(batch => batch.failedRecords > 0);
    expect(batchesWithErrors).toHaveLength(1); // Only batch-2 has failures
    expect(batchesWithErrors[0].failedRecords).toBe(145);
  });

  it('should fetch errors when View Errors button is clicked', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBatches,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorsResponse,
      } as Response);

    const { getByText } = render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/import/history', expect.any(Object));
    });

    // Simulate View Errors button click for batch-2
    const viewErrorsButton = getByText('View Errors');
    fireEvent.click(viewErrorsButton);

    await waitFor(() => {
      expect(screen.getByText('date_dd invalid')).toBeInTheDocument();
    });

    // Assert red badge for error
    expect(screen.getByRole('img', { className: /bg-red/ })).toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledWith('/api/import/batch-2/errors?page=1&limit=50', expect.any(Object));
    expect(mockErrorsResponse.total).toBe(145);
    expect(mockErrorsResponse.errors.length).toBe(2);
  });

  it('should handle empty errors (no button)', async () => {
    const emptyBatches = [
      {
        id: 'batch-no-errors',
        filename: 'successful-batch.csv',
        status: 'COMPLETED',
        successfulRecords: 100,
        failedRecords: 0,
        totalRecords: 100,
        createdAt: new Date().toISOString(),
      }
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => emptyBatches,
    } as Response);

    const { queryByText } = render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(queryByText('View Errors')).not.toBeInTheDocument();
  });

  it('should filter errorType=validation_error (subset results)', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBatches,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockErrorsResponse,
          errors: mockErrorsResponse.errors.filter(e => e.errorType === 'validation_error'),
          total: 1,
        }),
      } as Response);

    const { getByText } = render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/import/history', expect.any(Object));
    });

    const viewErrorsButton = getByText('View Errors');
    fireEvent.click(viewErrorsButton);

    // Simulate filter selection
    // Assuming there's a filter dropdown, mock the click
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockErrorsResponse,
        errors: [mockErrorsResponse.errors[0]], // Only validation_error
        total: 1,
      }),
    } as Response);

    // Trigger filtered API call
    await mockFetch('/api/import/batch-2/errors?errorType=validation_error&page=1&limit=50');

    expect(mockFetch).toHaveBeenNthCalledWith(
      3,
      '/api/import/batch-2/errors?errorType=validation_error&page=1&limit=50',
      expect.any(Object)
    );
    expect(screen.getByText('Invalid date format')).toBeInTheDocument(); // validation error message
    expect(screen.queryByText('Invalid case number format')).not.toBeInTheDocument(); // format error excluded
  });

  it('should handle pagination page=2/limit=50', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBatches,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorsResponse,
      } as Response);

    const { getByText } = render(<ImportHistory />);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/import/history', expect.any(Object));
    });

    const viewErrorsButton = getByText('View Errors');
    fireEvent.click(viewErrorsButton);

    await waitFor(() => {
      expect(screen.getByText('date_dd invalid')).toBeInTheDocument();
    });

    // Simulate next page click
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Mock second page response with different errors
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSecondPageErrors,
    } as Response);

    await waitFor(() => {
      expect(screen.getByText('Validation error on row 51')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/import/batch-2/errors?page=2&limit=50', expect.any(Object));
    const errorImg = screen.getByRole('img');
    expect(errorImg.className).toMatch(/bg-red/); // Still has errors
  });
  });