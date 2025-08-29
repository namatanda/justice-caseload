declare module 'csv-parser' {
  import { Transform } from 'stream';

  interface CsvParserOptions {
    separator?: string;
    newline?: string;
    strict?: boolean;
    skipEmptyLines?: boolean;
    skipLinesWithError?: boolean;
    maxRowBytes?: number;
    headers?: string[] | boolean;
    mapHeaders?: (args: { header: string; index: number }) => string;
    mapValues?: (args: { header: string; index: number; value: string }) => string;
  }

  function csvParser(options?: CsvParserOptions): Transform;
  function csvParser(headers?: string[] | boolean): Transform;

  export = csvParser;
}