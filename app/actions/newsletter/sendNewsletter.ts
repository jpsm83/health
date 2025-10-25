'use server';

import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import * as nodemailer from "nodemailer";

// Shared email utilities
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error(
      "Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables."
    );
  }
};

const sendEmailWithTransporter = async (mailOptions: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  const transporter = createTransporter();
  const info = await transporter.sendMail(mailOptions);
  return { success: true, data: { messageId: info.messageId } };
};

export interface SendNewsletterResult {
  success: boolean;
  message: string;
  error?: string;
  sentCount?: number;
}

export default async function sendNewsletterAction(): Promise<SendNewsletterResult> {
  try {
    await connectDb();

    // Get all subscribers
    const subscribers = await Subscriber.find().select('email unsubscribeToken');

    if (subscribers.length === 0) {
      return {
        success: false,
        message: "No subscribers found to send newsletter to.",
        error: "NO_SUBSCRIBERS"
      };
    }

    validateEmailConfig();

    let sentCount = 0;
    const errors: string[] = [];

    // Send newsletter to each subscriber
    for (const subscriber of subscribers) {
      try {
        const unsubscribeLink = `${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
        
        const emailContent = {
          subject: "Women's Spot Newsletter - Health & Wellness Update",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(to right, #7537fa, #ff006a); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px; color: white;">
                  <span style="margin-right: 0.5em;">🤍</span>Women&apos;s Spot Newsletter
                </h1>
              </div>
              <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                <h2 style="color: #374151; margin-bottom: 20px;">Hello from Women&apos;s Spot!</h2>
                <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                  Welcome to our weekly health and wellness newsletter! We're excited to share the latest insights, tips, and articles to help you live your best life.
                </p>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f43f5e;">
                  <h3 style="color: #374151; margin-bottom: 15px;">This Week's Featured Articles:</h3>
                  <ul style="color: #6b7280; line-height: 1.6;">
                    <li>5 Simple Morning Routines for Better Energy</li>
                    <li>Understanding Your Hormonal Health</li>
                    <li>Healthy Meal Prep Ideas for Busy Women&apos;s</li>
                    <li>The Importance of Mental Health Self-Care</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXTAUTH_URL}" style="background: linear-gradient(to right, #7537fa, #ff006a); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                    Read Latest Articles
                  </a>
                </div>

                <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                  Thank you for being part of our community! We're committed to providing you with valuable, evidence-based content to support your health and wellness journey.
                </p>

                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    <strong>Quick Tip:</strong> Did you know that staying hydrated can boost your energy levels by up to 25%? Try starting your day with a glass of water before your morning coffee!
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                <p>© 2025 Women&apos;s Spot. All rights reserved.</p>
                <p style="margin-top: 10px;">
                  If you no longer wish to receive our newsletter, you can 
                  <a href="${unsubscribeLink}" style="color: #f43f5e; text-decoration: underline;">unsubscribe here</a>.
                </p>
              </div>
            </div>
          `,
          text: `Women's Spot Newsletter - Health & Wellness Update\n\nHello from Women's Spot!\n\nWelcome to our weekly health and wellness newsletter! We're excited to share the latest insights, tips, and articles to help you live your best life.\n\nThis Week's Featured Articles:\n- 5 Simple Morning Routines for Better Energy\n- Understanding Your Hormonal Health\n- Healthy Meal Prep Ideas for Busy Women's\n- The Importance of Mental Health Self-Care\n\nRead our latest articles: ${process.env.NEXTAUTH_URL}\n\nThank you for being part of our community! We're committed to providing you with valuable, evidence-based content to support your health and wellness journey.\n\nQuick Tip: Did you know that staying hydrated can boost your energy levels by up to 25%? Try starting your day with a glass of water before your morning coffee!\n\n© 2025 Women's Spot. All rights reserved.\n\nIf you no longer wish to receive our newsletter, you can unsubscribe here: ${unsubscribeLink}`
        };

        const mailOptions = {
          from: `"Women's Spot" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        };

        await sendEmailWithTransporter(mailOptions);
        sentCount++;
        
      } catch (emailError) {
        console.error(`Failed to send newsletter to ${subscriber.email}:`, emailError);
        errors.push(`${subscriber.email}: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
      }
    }

    if (sentCount === 0) {
      return {
        success: false,
        message: "Failed to send newsletter to any subscribers.",
        error: "SEND_FAILED",
        sentCount: 0
      };
    }

    return {
      success: true,
      message: `Newsletter sent successfully to ${sentCount} subscribers${errors.length > 0 ? ` (${errors.length} failed)` : ''}.`,
      sentCount
    };

  } catch (error) {
    console.error("Send newsletter error:", error);
    return {
      success: false,
      message: "Something went wrong while sending newsletter.",
      error: "NEWSLETTER_SEND_FAILED"
    };
  }
}
