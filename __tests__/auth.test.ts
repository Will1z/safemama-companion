import { NextRequest } from 'next/server';
import { checkApiKey } from '@/lib/auth';

// Mock environment variable
const originalEnv = process.env.SAFEMAMA_API_KEY;

describe('checkApiKey', () => {
  beforeEach(() => {
    // Set test API key
    process.env.SAFEMAMA_API_KEY = 'test-key';
  });

  afterEach(() => {
    // Restore original environment
    process.env.SAFEMAMA_API_KEY = originalEnv;
  });

  it('should return true if header x-api-key matches process.env.SAFEMAMA_API_KEY', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-api-key': 'test-key'
      }
    });

    const result = checkApiKey(request);
    expect(result).toBe(true);
  });

  it('should return false if header x-api-key is missing', () => {
    const request = new NextRequest('http://localhost:3000/api/test');

    const result = checkApiKey(request);
    expect(result).toBe(false);
  });

  it('should return false if header x-api-key does not match', () => {
    const request = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'x-api-key': 'wrong-key'
      }
    });

    const result = checkApiKey(request);
    expect(result).toBe(false);
  });

  it('should return true if SAFEMAMA_API_KEY is not set (dev mode)', () => {
    // Temporarily unset the API key
    delete process.env.SAFEMAMA_API_KEY;

    const request = new NextRequest('http://localhost:3000/api/test');

    const result = checkApiKey(request);
    expect(result).toBe(true);

    // Restore for other tests
    process.env.SAFEMAMA_API_KEY = 'test-key';
  });
});
