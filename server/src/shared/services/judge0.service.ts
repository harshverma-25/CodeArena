import { env } from '../../config/env.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { logger } from '../../config/logger.js';

// Base64 encoding/decoding utilities
export function encodeBase64(str: string | null | undefined): string {
  if (!str) return '';
  return Buffer.from(str).toString('base64');
}

export function decodeBase64(str: string | null | undefined): string {
  if (!str) return '';
  return Buffer.from(str, 'base64').toString('utf8');
}

// Supported Judge0 languages and their standard IDs
export const JUDGE0_LANGUAGES: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
};

/**
 * Retrieve the correct Judge0 language ID or throw error.
 */
export function getJudge0LanguageId(language: string): number {
  const normalized = language.toLowerCase().trim();
  const id = JUDGE0_LANGUAGES[normalized];
  if (!id) {
    throw new ApiError(400, `Unsupported language for code execution: ${language}. Supported languages are: ${Object.keys(JUDGE0_LANGUAGES).join(', ')}`);
  }
  return id;
}

export interface IJudge0SubmissionResponse {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: number | null; // in seconds
  memory: number | null; // in KB
}

export class Judge0Service {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (env.JUDGE0_API_KEY && env.JUDGE0_API_KEY !== 'judge0_api_key_placeholder') {
      headers['X-Auth-Token'] = env.JUDGE0_API_KEY;
      headers['X-RapidAPI-Key'] = env.JUDGE0_API_KEY;
    }
    return headers;
  }

  /**
   * Submit source code to Judge0 for asynchronous compilation and execution.
   */
  async createSubmission(payload: {
    sourceCode: string;
    languageId: number;
    stdin?: string;
    expectedOutput?: string;
    cpuTimeLimit?: number;
    memoryLimit?: number;
  }): Promise<string> {
    const url = `${env.JUDGE0_URL}/submissions?base64_encoded=true&wait=false`;

    const body = JSON.stringify({
      source_code: encodeBase64(payload.sourceCode),
      language_id: payload.languageId,
      stdin: payload.stdin ? encodeBase64(payload.stdin) : '',
      expected_output: payload.expectedOutput ? encodeBase64(payload.expectedOutput) : '',
      cpu_time_limit: payload.cpuTimeLimit,
      memory_limit: payload.memoryLimit,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Judge0 Submission creation failed with status ${response.status}: ${errorText}`);
        throw new ApiError(502, `Code execution service error: ${response.statusText || response.status}`);
      }

      const data: any = await response.json();
      if (!data || !data.token) {
        throw new ApiError(502, 'Code execution service did not return a submission token');
      }

      return data.token;
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      logger.error(error, 'Error communicating with Judge0 during submission creation');
      throw new ApiError(502, `Failed to communicate with code execution service: ${error.message}`);
    }
  }

  /**
   * Retrieve the status and results of a submission from Judge0.
   */
  async getSubmission(token: string): Promise<IJudge0SubmissionResponse> {
    const url = `${env.JUDGE0_URL}/submissions/${token}?base64_encoded=true`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Judge0 getSubmission failed for token ${token} with status ${response.status}: ${errorText}`);
        throw new ApiError(502, `Code execution service retrieval error: ${response.statusText || response.status}`);
      }

      const data: any = await response.json();
      if (!data || !data.status) {
        throw new ApiError(502, 'Invalid response structure from code execution service');
      }

      return {
        token: data.token || token,
        status: {
          id: data.status.id,
          description: data.status.description,
        },
        stdout: data.stdout ? decodeBase64(data.stdout) : null,
        stderr: data.stderr ? decodeBase64(data.stderr) : null,
        compile_output: data.compile_output ? decodeBase64(data.compile_output) : null,
        time: data.time ? parseFloat(data.time) : null,
        memory: data.memory ? parseInt(data.memory, 10) : null,
      };
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      logger.error(error, `Error fetching submission status from Judge0 for token ${token}`);
      throw new ApiError(502, `Failed to communicate with code execution service: ${error.message}`);
    }
  }

  /**
   * Poll Judge0 until execution has finished (status is no longer In Queue or Processing).
   */
  async waitForResult(token: string): Promise<IJudge0SubmissionResponse> {
    let attempts = 0;
    const maxAttempts = env.JUDGE0_MAX_POLL_ATTEMPTS;
    const interval = env.JUDGE0_POLL_INTERVAL;

    while (attempts < maxAttempts) {
      const result = await this.getSubmission(token);

      // Status IDs: 1 (In Queue), 2 (Processing) mean it's still running
      if (result.status.id !== 1 && result.status.id !== 2) {
        return result;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new ApiError(408, `Code execution timed out after polling for ${maxAttempts * (interval / 1000)}s`);
  }
}

export const judge0Service = new Judge0Service();
export default judge0Service;
