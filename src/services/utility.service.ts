import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as bcryptjs from 'bcryptjs';
import slugify from 'slugify';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { Response } from 'express';

@Injectable()
export class UtilityService {
  constructor(private readonly configService: ConfigService) {}
  public allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'audio/mpeg',
    'audio/wav',
    'audio/aac',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'text/html',
    'text/css',
    'application/javascript',
    'text/markdown',
    'application/eps',
    'application/rtf',
    //
  ];

  public generateInvoice() {
    const prefix = 'INV';
    const date = dayjs().format('YYYYMMDD');
    const random = Math.floor(Math.random() * 1000000);
    const invoiceNumber = `${prefix}${date}-${random}`;
    return invoiceNumber;
  }

  public generateId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return `${dayjs().unix()}${result}`;
  }

  public generateSlugId() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  public validatePassword(password: string): string | null {
    // Regular expressions for password validation
    const minLength = 8;
    // const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

    // Check for minimum length
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }

    // Check for uppercase letter
    // if (!upperCaseRegex.test(password)) {
    //   return 'Password must contain at least one uppercase letter';
    // }

    // Check for lowercase letter
    if (!lowerCaseRegex.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    // Check for digit
    if (!digitRegex.test(password)) {
      return 'Password must contain at least one digit';
    }

    // Check for special character
    if (!specialCharRegex.test(password)) {
      return 'Password must contain at least one special character ($@$!%*?&)';
    }

    return null;
  }

  public hashPassword(password: string): string {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);
    return hash;
  }

  public comparePassword(password: string, hashed: string): boolean {
    return bcryptjs.compareSync(password, hashed);
  }

  public globalResponse<T>({ statusCode = 200, message = null, data = null, res = null }: { res?: Response; data?: T; message?: string; statusCode?: number }) {
    if (statusCode >= 400) {
      throw new HttpException({ statusCode, message, data }, statusCode);
    }
    if (res) {
      return res.status(statusCode).json({ statusCode, message, data });
    }
    return { statusCode, message, data };
  }

  public skip(page: number, totalPage: number) {
    return (page - 1) * totalPage;
  }

  public slugify(text: string) {
    const cleanedText = text.replace(/[^a-zA-Z0-9 ]/g, '-');
    return slugify(cleanedText, { lower: true, strict: true }).replaceAll('_', '-');
  }

  public async resizeImage(buffer: Buffer, options: sharp.ResizeOptions = { width: 1920, height: 1080, fit: 'cover' }) {
    const { width, height } = await sharp(buffer).metadata();
    if (width <= options.width && height <= options.height) return buffer;
    return await sharp(buffer).resize(options).toBuffer();
  }

  public getExtension(mimeType: string) {
    return mime.extension(mimeType);
  }

  public storeImageToRoot(buffer: Buffer, path: string) {
    fs.writeFileSync(path, buffer);
  }

  public fromMinuteToText(minute: number): string {
    const hour = Math.floor(minute / 60);
    const minuteLeft = minute % 60;
    return `${hour}h ${minuteLeft}m`;
  }

  public calculateDateDifference(startDate: Date, endDate?: Date): string {
    if (startDate) {
      const start = new Date(startDate.toString());
      const end = endDate ? new Date(endDate.toString()) : new Date();

      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();

      if (months < 0) {
        years--;
        months += 12;
      }

      return `${years} yrs ${months} mos`;
    }
    return '';
  }
}
