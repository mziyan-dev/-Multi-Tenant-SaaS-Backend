import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465, // Default 465 for secure
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: number) {
    await this.sendMail(email, 'Your OTP Code', `Your OTP is: ${otp}`);
  }

  // Is function ko 'async' banayein aur 'await' use karein
  async sendMail(email: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"My App" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        text,
      });
      console.log('Email sent: ', info.messageId); // Check karne ke liye log
      return info;
    } catch (error) {
      console.error('Email Error: ', error);
      throw error;
    }
  }
}
