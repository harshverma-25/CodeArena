import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { buildThumbnailPrompt, ThumbnailPromptContext } from './thumbnail-prompt.builder.js';

export class MediaService {
  private isCloudinaryConfigured: boolean = false;
  private isCloudflareAiConfigured: boolean = false;

  constructor() {
    // Configure Cloudinary with explicit credentials or URL
    if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      this.isCloudinaryConfigured = true;
    } else if (env.CLOUDINARY_URL) {
      // Parse cloudinary://key:secret@cloud_name if provided
      try {
        const parsed = new URL(env.CLOUDINARY_URL);
        cloudinary.config({
          cloud_name: parsed.hostname,
          api_key: parsed.username,
          api_secret: parsed.password,
          secure: true,
        });
        this.isCloudinaryConfigured = true;
      } catch {
        cloudinary.config({ secure: true });
        this.isCloudinaryConfigured = true;
      }
    }

    if (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_API_TOKEN) {
      this.isCloudflareAiConfigured = true;
    }
  }

  /**
   * Check configuration status
   */
  getStatus() {
    return {
      cloudinaryConfigured: this.isCloudinaryConfigured,
      cloudflareAiConfigured: this.isCloudflareAiConfigured,
      aiModel: env.CLOUDFLARE_AI_MODEL,
    };
  }

  /**
   * Upload an image (base64 string, image URL, or Buffer) to Cloudinary with auto optimization
   */
  async uploadImage(
    input: string | Buffer,
    options: { folder?: string; publicId?: string } = {}
  ): Promise<string> {
    if (!this.isCloudinaryConfigured) {
      if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
        logger.warn('Cloudinary not configured in .env. Falling back to original image URL directly.');
        return input;
      }
      throw new Error(
        'Cloudinary credentials are not configured in server .env. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
      );
    }

    const folder = options.folder || 'quizzy/thumbnails';
    const uploadOptions: any = {
      folder,
      public_id: options.publicId,
      transformation: [
        { width: 600, height: 600, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
      resource_type: 'image',
    };

    if (Buffer.isBuffer(input)) {
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error || !result) {
            logger.error({ err: error }, 'Cloudinary buffer upload failed');
            return reject(new Error(error?.message || 'Failed to upload image buffer to Cloudinary'));
          }
          resolve(result.secure_url);
        });
        stream.end(input);
      });
    }

    // Input is a URL string or data:image base64 string
    const result: UploadApiResponse = await cloudinary.uploader.upload(input, uploadOptions);
    return result.secure_url;
  }

  /**
   * Generate an image using Cloudflare Workers AI Text-to-Image API with category-specific prompt guidance
   */
  async generateSubjectImage(
    subjectName: string,
    categoryName?: string,
    options: {
      categorySlug?: string;
      description?: string;
      sampleQuestionTopics?: string[];
    } = {}
  ): Promise<Buffer> {
    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
      throw new Error(
        'Cloudflare Workers AI credentials missing in server .env. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.'
      );
    }

    const model = env.CLOUDFLARE_AI_MODEL || '@cf/stabilityai/stable-diffusion-xl-base-1.0';
    const prompt = buildThumbnailPrompt({
      subjectName,
      categoryName,
      categorySlug: options.categorySlug,
      description: options.description,
      sampleQuestionTopics: options.sampleQuestionTopics,
    });

    const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`;

    logger.info({ subjectName, categoryName, model, prompt }, 'Generating image with Cloudflare Workers AI...');

    const isMultipartModel = model.includes('flux-2') || model.includes('multipart');
    let response: Response;

    if (isMultipartModel) {
      const formData = new FormData();
      formData.append('prompt', prompt);

      response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        },
        body: formData,
      });
    } else {
      // Standard JSON models (SDXL, SD-1.5, etc.)
      response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      // If model returned 400 requiring multipart, retry with FormData transparently
      if (!response.ok && response.status === 400) {
        const cloned = response.clone();
        const errJson: any = await cloned.json().catch(() => null);
        if (errJson?.errors?.[0]?.message?.includes('multipart')) {
          logger.info({ model }, 'Model requires multipart form data, retrying with FormData...');
          const retryFormData = new FormData();
          retryFormData.append('prompt', prompt);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            },
            body: retryFormData,
          });
        }
      }
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      logger.error({ status: response.status, errText }, 'Cloudflare Workers AI generation failed');
      throw new Error(`Cloudflare AI error (${response.status}): ${errText || response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json: any = await response.json();
      if (json.result?.image) {
        return Buffer.from(json.result.image, 'base64');
      }
      if (typeof json.result === 'string') {
        return Buffer.from(json.result, 'base64');
      }
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * End-to-end: Generate image with Cloudflare Workers AI and upload directly to Cloudinary for fast CDN delivery
   */
  async generateAndUploadSubjectThumbnail(
    subjectName: string,
    categoryName?: string,
    options: {
      categorySlug?: string;
      description?: string;
      sampleQuestionTopics?: string[];
    } = {}
  ): Promise<string> {
    logger.info({ subjectName, categoryName }, 'Auto-generating thumbnail via Cloudflare AI and Cloudinary...');
    const imageBuffer = await this.generateSubjectImage(subjectName, categoryName, options);
    const sanitizedSlug = subjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.uploadImage(imageBuffer, {
      folder: 'quizzy/thumbnails',
      publicId: `thumb-${sanitizedSlug}-${Date.now()}`,
    });
  }
}

export const mediaService = new MediaService();
