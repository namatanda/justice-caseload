"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Download, Eye, Upload } from 'lucide-react';
import { useState } from 'react';

interface ValidationResultsProps {
  results: {
    success: boolean;
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    recordCount: number;
    previewData: any[];
    checksum?: string;
  };
  onImportStart?: (batchId: string) => void;
  originalFile?: File;
}

interface ValidationError {
  type: 'file' | 'structure' | 'data' | 'schema';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  field?: string;
  rowNumber?: number;
  rawValue?: any;
}

export function ValidationResults({ results, onImportStart, originalFile }: ValidationResultsProps) {
  const hasErrors = results.errors && results.errors.length > 0;
  const hasWarnings = results.warnings && results.warnings.length > 0;
  const [isImporting, setIsImporting] = useState(false);

  const downloadErrors = () => {
    const csvContent = [
      ['Row Number', 'Error Type', 'Field', 'Error Message', 'Suggestion', 'Raw Value'].join(','),
      ...results.errors.map(error => [
        error.rowNumber || '',
        error.type || '',
        error.field || '',
        `"${(error.message || '').replace(/"/g, '""')}"`,
        `"${(error.suggestion || '').replace(/"/g, '""')}"`,
        `"${(error.rawValue ? JSON.stringify(error.rawValue) : '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validation-errors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPreview = () => {
    if (!results.previewData || results.previewData.length === 0) return;

    const headers = Object.keys(results.previewData[0]);
    const csvContent = [
      headers.join(','),
      ...results.previewData.map(row =>
        headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-preview.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!onImportStart || !originalFile) {
      alert('Original file not available. Please go back to the Upload tab to complete the import process.');
      return;
    }

    // Create confirmation message
    let confirmMessage = `🚀 Ready to Import ${results.recordCount} rows of data?\n\nThis action will:\n• Upload CSV to database\n• Process case activities\n• Create court/judge records\n\n`;

    if (hasErrors) {
      confirmMessage += `⚠️ WARNING: ${results.errors.length} validation error(s) found.\nSome data may not import correctly.\n\n`;
    }

    confirmMessage += `⚠️ This cannot be easily undone. Continue?`;

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append('file', originalFile);

      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        alert(`Import failed: ${result.error}\n\nDetails: ${result.details || 'Unknown error'}`);
        return;
      }

      // Call the import start callback to switch to progress tracking
      console.log('Calling onImportStart with batch ID:', result.batchId);
      onImportStart(result.batchId);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import file';
      alert(`Import failed: ${errorMessage}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {results.valid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Validation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {results.recordCount}
              </div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.previewData?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Valid Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {results.errors?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {results.warnings?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
          </div>

          <div className="flex gap-2">
            {results.previewData && results.previewData.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPreview}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Preview
              </Button>
            )}
            {hasErrors && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadErrors}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Errors
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {results.previewData && results.previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Data Preview (First 10 Rows)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(results.previewData[0]).map(header => (
                      <TableHead key={header} className="text-xs">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.previewData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <TableCell key={cellIndex} className="text-xs max-w-32 truncate">
                          {value?.toString() || ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors */}
      {hasErrors && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Validation Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {error.rowNumber && (
                            <Badge variant="destructive" className="text-xs">
                              Row {error.rowNumber}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {error.type}
                          </Badge>
                          {error.field && (
                            <span className="text-xs text-muted-foreground">
                              Field: {error.field}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium">{error.message}</p>
                        {error.suggestion && (
                          <p className="text-sm text-muted-foreground mt-1">
                            💡 {error.suggestion}
                          </p>
                        )}
                        {error.rawValue && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer text-muted-foreground">
                              View raw value
                            </summary>
                            <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto">
                              {JSON.stringify(error.rawValue, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Validation Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {results.warnings.map((warning, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {warning.type}
                      </Badge>
                      {warning.field && (
                        <span className="text-xs text-muted-foreground">
                          Field: {warning.field}
                        </span>
                      )}
                      {warning.rowNumber && (
                        <Badge variant="outline" className="text-xs">
                          Row {warning.rowNumber}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{warning.message}</p>
                    {warning.suggestion && (
                      <p className="text-sm text-muted-foreground mt-1">
                        💡 {warning.suggestion}
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Status & Import Action */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {results.valid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-600">File is valid and ready for import</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-600">File has validation errors</span>
                </>
              )}
            </div>
            <Badge variant={results.valid ? "default" : "destructive"}>
              {results.valid ? "Ready to Import" : "Needs Correction"}
            </Badge>
          </div>

          {/* Import Button */}
          {results.valid && (
            <div className="border-t pt-6 bg-gradient-to-r from-green-50 to-blue-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
              <div className="text-center">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Import!</h3>
                  <p className="text-sm text-gray-600">
                    Your file has been validated and is ready for database import.
                  </p>
                </div>

                <Button
                  onClick={handleImport}
                  disabled={isImporting || !originalFile}
                  size="lg"
                  className={`w-full text-white font-bold py-6 px-8 text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none ${hasErrors
                      ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
                    }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        IMPORTING DATA... Please wait
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6" />
                        🚀 START IMPORT ({results.recordCount} rows)
                        {hasErrors ? (
                          <AlertTriangle className="h-6 w-6" />
                        ) : (
                          <CheckCircle className="h-6 w-6" />
                        )}
                      </>
                    )}
                  </div>
                </Button>

                {!originalFile && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Original file not available. Please go back to Upload tab.
                  </p>
                )}
              </div>

              {hasErrors && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Validation Issues Found</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Found {results.errors.length} validation error(s). You can still proceed with the import, but some data may not be processed correctly.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}