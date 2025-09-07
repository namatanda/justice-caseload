"use client";
import logger from '@/lib/logger';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/import/file-upload';
import { ImportHistory } from '@/components/import/import-history';
import { ProgressTracker } from '@/components/import/progress-tracker';
import { ValidationResults } from '@/components/import/validation-results';
import { DatabaseStatusIndicator } from '@/components/ui/database-status-indicator';
import { SystemStatusIndicator } from '@/components/ui/system-status-indicator';
import { Upload, History, BarChart3, CheckCircle } from 'lucide-react';

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleImportStart = (batchId: string) => {
    logger.import.info('Import started with batch ID', { batchId });
    setCurrentBatchId(batchId);
    setActiveTab('progress');
  };

  const handleValidationComplete = (results: any, file?: File) => {
    setValidationResults(results);
    if (file) {
      setOriginalFile(file);
    }
    setActiveTab('validation');
  };

  const handleImportComplete = () => {
    // Show success confirmation briefly before switching to history
    setSuccessMessage('✅ Data successfully imported and verified in database!');
    setShowSuccessConfirmation(true);

    // Auto-hide success message and switch to history after 3 seconds
    setTimeout(() => {
      setShowSuccessConfirmation(false);
      setCurrentBatchId(null);
      setValidationResults(null);
      setOriginalFile(null);
      setActiveTab('history');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Data Import Center</h1>
              <p className="text-muted-foreground">
                Upload CSV files and manage data imports for the Justice Caseload system
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <DatabaseStatusIndicator showLabel={true} />
                <SystemStatusIndicator />
              </div>
            </div>
          </div>
        </div>

        {/* Success Confirmation */}
        {showSuccessConfirmation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">
                  Import Successful!
                </h3>
                <p className="text-green-700">{successMessage}</p>
                <p className="text-sm text-green-600 mt-1">
                  Your data is now available in the database and ready for use.
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2" disabled={!currentBatchId}>
              <BarChart3 className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center gap-2" disabled={!validationResults}>
              <CheckCircle className="h-4 w-4" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>File Upload</CardTitle>
                  <CardDescription>
                    Upload CSV files containing case data. Files will be validated and processed automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onImportStart={handleImportStart}
                    onValidationComplete={handleValidationComplete}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Import Progress</CardTitle>
                  <CardDescription>
                    Monitor the progress of your data import in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentBatchId ? (
                    <ProgressTracker
                      batchId={currentBatchId}
                      onComplete={handleImportComplete}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No active import in progress
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validation">
              <Card>
                <CardHeader>
                  <CardTitle>Validation Results</CardTitle>
                  <CardDescription>
                    Review validation results and error details for your uploaded file.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {validationResults ? (
                    <ValidationResults 
                      results={validationResults} 
                      onImportStart={handleImportStart}
                      originalFile={originalFile || undefined}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No validation results available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Import History</CardTitle>
                  <CardDescription>
                    View all previous data imports and their status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImportHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}