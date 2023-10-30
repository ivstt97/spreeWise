declare module 'tesseract.js' {
  export function createWorker(): TesseractWorker;

  interface TesseractWorker {
    load(): Promise<void>;
    loadLanguage(language: string): Promise<void>;
    initialize(language: string): Promise<void>;
    recognize(image: any): Promise<{ data: { text: string } }>;
    terminate(): Promise<void>;
  }
}
