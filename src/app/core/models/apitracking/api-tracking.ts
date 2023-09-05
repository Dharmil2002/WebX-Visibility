export interface ApiTracking {
    id?: number;
    url: string;
    method: string;
    headers?: Record<string, string>;
    request: any;
    error?: string; // Optional field to store error information
    response?: any;
    status: 'pending' | 'success' | 'failed';
}
