/**
 * Transcript data from backend API
 */
export interface TranscriptData {
    id: string;
    text: string;
    speaker?: string;
    timestamp: string;
    confidence?: number;
    isFinal?: boolean;
    language?: string;
    sourceLanguage?: string;
    targetLanguage?: string;
    translatedText?: string;
}

/**
 * API response for transcript polling
 */
export interface TranscriptsSinceResponse {
    transcripts: TranscriptData[];
    count: number;
    nextSince?: string;
}
