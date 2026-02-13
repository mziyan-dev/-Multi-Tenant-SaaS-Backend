import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(email: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"My App" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        text,
      });

      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email Error:', error);
      throw error;
    }
  }

  async sendOtp(email: string, otp: number) {
    return this.sendMail(email, 'Your OTP Code', `Your OTP is: ${otp}`);
  }

  async sendCredentials(email: string, name: string, password: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"My App" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your Account Credentials",
        html: `
          <h3>Welcome ${name}!</h3>
          <p>Your account has been verified successfully.</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Password:</b> ${password}</p>
        `,
      });

      console.log("Credentials Email Sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Credentials Email Error:", error);
      throw error;
    }
  }
}
