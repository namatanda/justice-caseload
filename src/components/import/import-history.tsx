"use client";
import logger from '@/lib/logger';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DatabaseErrorAlert } from '@/components/ui/database-error-alert';
import { DatabaseStatusIndicator } from '@/components/ui/database-status-indicator';
import {
  History,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

interface ImportBatch {
  id: string;
  filename: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  createdAt: string;
  completedAt?: string;
  createdBy: {
    name: string;
    email: string;
  };
}

export function ImportHistory() {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    details?: string;
    code?: string;
    timestamp: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);

  // Error viewing states
  const [selectedBatch, setSelectedBatch] = useState<ImportBatch | null>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const [errorFetchError, setErrorFetchError] = useState<string | null>(null);
  const [currentErrorPage, setCurrentErrorPage] = useState(1);
  const [totalErrors, setTotalErrors] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchHistory = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20',
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/import/history?${params}`);
      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to fetch import history');
        return;
      }

      if (reset) {
        setBatches(result.data);
      } else {
        setBatches(prev => [...prev, ...result.data]);
      }

      setHasMore(result.data.length === 20);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch import history';
      setError({
        message: errorMessage,
        details: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      logger.import.error('History fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchErrors = async (batchId: string, pageNum = 1, reset = false) => {
    try {
      setErrorLoading(true);
      setErrorFetchError(null);
      setCurrentErrorPage(pageNum);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '50',
      });

      const response = await fetch(`/api/import/${batchId}/errors?${params}`);
      const result = await response.json();

      if (!result.success) {
        setErrorFetchError(result.error || 'Failed to fetch errors');
        return;
      }

      if (reset) {
        setErrors(result.data.errors);
      } else {
        setErrors(prev => [...prev, ...result.data.errors]);
      }

      setTotalErrors(result.data.total);
      setSelectedBatch(result.data.batchSummary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch errors';
      setErrorFetchError(errorMessage);
      logger.import.error('Errors fetch error', err);
    } finally {
      setErrorLoading(false);
    }
  };

  const handleViewErrors = async (batch: ImportBatch) => {
    setSelectedBatch(batch);
    setCurrentErrorPage(1);
    await fetchErrors(batch.id, 1, true);
    setShowErrorModal(true);
  };

  const handleErrorPageChange = (newPage: number) => {
    if (selectedBatch) {
      fetchErrors(selectedBatch.id, newPage, true);
    }
  };

  // Optional: Generate summary
  const generateErrorSummary = () => {
    if (!errors.length) return '';

    const errorCounts = errors.reduce((acc: Record<string, number>, error: any) => {
      const type = error.errorType || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = errors.length;
    const sorted = Object.entries(errorCounts).sort(([,a], [,b]) => Number(b) - Number(a));
    const topIssues = sorted.slice(0, 2).map(([type, count]) => `${type} (${Math.round((Number(count) / total) * 100)}%)`).join(', ');

    return `${total} failures found - Top issues: ${topIssues}`;
  };

  const errorSummary = generateErrorSummary();

  // Handle close modal
  const handleCloseModal = () => {
    setShowErrorModal(false);
    setErrors([]);
    setTotalErrors(0);
    setErrorFetchError(null);
    setCurrentErrorPage(1);
  };

  const totalPages = Math.ceil(totalErrors / 50);

  // Badge variant for severity
  const getSeverityVariant = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getErrorTypeVariant = (errorType: string) => {
    // Customize based on error type if needed
    return 'default' as const;
  };

  // Reset error page when filter changes or search
  useEffect(() => {
    if (statusFilter !== 'all' || searchTerm) {
      setCurrentErrorPage(1);
    }
  }, [statusFilter, searchTerm]);

  // Reset modal when batch changes
  useEffect(() => {
    if (!showErrorModal) {
      setSelectedBatch(null);
      setErrors([]);
      setTotalErrors(0);
      setErrorFetchError(null);
      setCurrentErrorPage(1);
    }
  }, [showErrorModal]);

  useEffect(() => {
    fetchHistory(1, true);
  }, [statusFilter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchHistory(1, true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'PROCESSING':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'PROCESSING':
        return 'default';
      case 'COMPLETED':
        return 'default';
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '-';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString();
    } catch (error) {
      logger.import.error('Date formatting error', error);
      return 'Invalid Date';
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename or batch ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Error Alert */}
      {error && (
        <DatabaseErrorAlert
          error={error}
          onRetry={handleRefresh}
          onDismiss={() => setError(null)}
        />
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Import History
            </CardTitle>
            <DatabaseStatusIndicator showLabel={false} />
          </div>
        </CardHeader>
        <CardContent>
          {filteredBatches.length === 0 && !loading ? (
            <div className="text-center py-8 text-muted-foreground">
              No import history found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Filename</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-mono text-xs">
                        {batch.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="max-w-48 truncate" title={batch.filename}>
                        {batch.filename}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(batch.status)}
                          <Badge variant={getStatusColor(batch.status) as any}>
                            {batch.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Total: {batch.totalRecords}</div>
                          <div className="text-xs text-muted-foreground">
                            Success: {batch.successfulRecords} | Failed: {batch.failedRecords}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {batch.totalRecords > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${(batch.successfulRecords / batch.totalRecords) * 100}%`
                                }}
                              />
                            </div>
                            <span className="text-xs">
                              {Math.round((batch.successfulRecords / batch.totalRecords) * 100)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(batch.createdAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {batch.completedAt ? formatDate(batch.completedAt) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{batch.createdBy.name}</div>
                          <div className="text-muted-foreground">{batch.createdBy.email}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Load More */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading import history...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {batches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {batches.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Imports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {batches.filter(b => b.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {batches.filter(b => b.status === 'FAILED').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {batches.reduce((sum, b) => sum + b.successfulRecords, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Records Imported</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}