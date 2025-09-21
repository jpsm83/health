'use server';

import * as nodemailer from "nodemailer";
import crypto from "crypto";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";

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

// Email content translations
const emailTranslations = {
  en: {
    subject: "Confirm Your Email - Women's Spot",
    greeting: "Hello",
    message: "Welcome to Women's Spot! Please confirm your email address by clicking the button below to complete your account setup.",
    confirmButton: "Confirm Email",
    ignoreMessage: "If you didn't create an account with Women's Spot, please ignore this email.",
    expiryMessage: "This confirmation link will expire in 24 hours for security reasons.",
    fallbackMessage: "If the button above doesn't work, copy and paste this link into your browser:",
    copyright: "© 2025 Women's Spot. All rights reserved.",
  },
  pt: {
    subject: "Confirme seu Email - Women's Spot",
    greeting: "Olá",
    message: "Bem-vindo ao Women's Spot! Confirme seu endereço de email clicando no botão abaixo para completar a configuração da sua conta.",
    confirmButton: "Confirmar Email",
    ignoreMessage: "Se você não criou uma conta no Women's Spot, ignore este email.",
    expiryMessage: "Este link de confirmação expirará em 24 horas por motivos de segurança.",
    fallbackMessage: "Se o botão acima não funcionar, copie e cole este link no seu navegador:",
    copyright: "© 2025 Women's Spot. Todos os direitos reservados.",
  },
  es: {
    subject: "Confirma tu Email - Women's Spot",
    greeting: "Hola",
    message: "¡Bienvenido a Women's Spot! Confirma tu dirección de email haciendo clic en el botón de abajo para completar la configuración de tu cuenta.",
    confirmButton: "Confirmar Email",
    ignoreMessage: "Si no creaste una cuenta en Women's Spot, ignora este email.",
    expiryMessage: "Este enlace de confirmación expirará en 24 horas por razones de seguridad.",
    fallbackMessage: "Si el botón de arriba no funciona, copia y pega este enlace en tu navegador:",
    copyright: "© 2025 Women's Spot. Todos los derechos reservados.",
  },
  fr: {
    subject: "Confirmez votre Email - Women's Spot",
    greeting: "Bonjour",
    message: "Bienvenue sur Women's Spot ! Veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous pour finaliser la configuration de votre compte.",
    confirmButton: "Confirmer l'Email",
    ignoreMessage: "Si vous n'avez pas créé de compte sur Women's Spot, veuillez ignorer cet e-mail.",
    expiryMessage: "Ce lien de confirmation expirera dans 24 heures pour des raisons de sécurité.",
    fallbackMessage: "Si le bouton ci-dessus ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
    copyright: "© 2025 Women's Spot. Tous droits réservés.",
  },
  de: {
    subject: "Bestätigen Sie Ihre E-Mail - Women's Spot",
    greeting: "Hallo",
    message: "Willkommen bei Women's Spot! Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken, um die Einrichtung Ihres Kontos abzuschließen.",
    confirmButton: "E-Mail bestätigen",
    ignoreMessage: "Wenn Sie kein Konto bei Women's Spot erstellt haben, ignorieren Sie bitte diese E-Mail.",
    expiryMessage: "Dieser Bestätigungslink läuft aus Sicherheitsgründen in 24 Stunden ab.",
    fallbackMessage: "Wenn die Schaltfläche oben nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:",
    copyright: "© 2025 Women's Spot. Alle Rechte vorbehalten.",
  },
  it: {
    subject: "Conferma il tuo Email - Women's Spot",
    greeting: "Ciao",
    message: "Benvenuto su Women's Spot! Conferma il tuo indirizzo email cliccando sul pulsante qui sotto per completare la configurazione del tuo account.",
    confirmButton: "Conferma Email",
    ignoreMessage: "Se non hai creato un account su Women's Spot, ignora questa email.",
    expiryMessage: "Questo link di conferma scadrà tra 24 ore per motivi di sicurezza.",
    fallbackMessage: "Se il pulsante sopra non funziona, copia e incolla questo link nel tuo browser:",
    copyright: "© 2025 Women's Spot. Tutti i diritti riservati.",
  },
  nl: {
    subject: "Bevestig uw E-mail - Women's Spot",
    greeting: "Hallo",
    message: "Welkom bij Women's Spot! Bevestig uw e-mailadres door op de knop hieronder te klikken om de instelling van uw account te voltooien.",
    confirmButton: "E-mail Bevestigen",
    ignoreMessage: "Als u geen account heeft aangemaakt bij Women's Spot, negeer dan deze e-mail.",
    expiryMessage: "Deze bevestigingslink verloopt over 24 uur om veiligheidsredenen.",
    fallbackMessage: "Als de knop hierboven niet werkt, kopieer en plak deze link in uw browser:",
    copyright: "© 2025 Women's Spot. Alle rechten voorbehouden.",
  },
  he: {
    subject: "אמת את האימייל שלך - Women's Spot",
    greeting: "שלום",
    message: "ברוכים הבאים ל-Women's Spot! אנא אמת את כתובת האימייל שלך על ידי לחיצה על הכפתור למטה כדי להשלים את הגדרת החשבון שלך.",
    confirmButton: "אמת אימייל",
    ignoreMessage: "אם לא יצרת חשבון ב-Women's Spot, אנא התעלם מהאימייל הזה.",
    expiryMessage: "קישור האימות הזה יפוג תוקף תוך 24 שעות מסיבות אבטחה.",
    fallbackMessage: "אם הכפתור למעלה לא עובד, העתק והדבק את הקישור הזה בדפדפן שלך:",
    copyright: "© 2025 Women's Spot. כל הזכויות שמורות.",
  },
  ru: {
    subject: "Подтвердите ваш Email - Women's Spot",
    greeting: "Привет",
    message: "Добро пожаловать в Women's Spot! Пожалуйста, подтвердите ваш адрес электронной почты, нажав кнопку ниже, чтобы завершить настройку вашего аккаунта.",
    confirmButton: "Подтвердить Email",
    ignoreMessage: "Если вы не создавали аккаунт в Women's Spot, проигнорируйте это письмо.",
    expiryMessage: "Эта ссылка для подтверждения истечет через 24 часа по соображениям безопасности.",
    fallbackMessage: "Если кнопка выше не работает, скопируйте и вставьте эту ссылку в ваш браузер:",
    copyright: "© 2025 Women's Spot. Все права защищены.",
  }
};

// Email confirmation template
const emailConfirmationTemplate = (confirmLink: string, username: string, locale: string = 'en') => {
  const t = emailTranslations[locale as keyof typeof emailTranslations] || emailTranslations.en;
  
  return {
    subject: t.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px; color: white;">
            <span style="margin-right: 0.5em;">🤍</span>Women's' Spot
          </h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <h2 style="color: #374151; margin-bottom: 20px;">${t.greeting} ${username}!</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            ${t.message}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" 
               style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              ${t.confirmButton}
            </a>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            ${t.ignoreMessage}
          </p>
          
          <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
            ${t.expiryMessage}
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">
            ${t.fallbackMessage}<br>
            <a href="${confirmLink}" style="color: #ec4899;">${confirmLink}</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>${t.copyright}</p>
        </div>
      </div>
    `,
    text: `
      ${t.subject}
      
      ${t.greeting} ${username}!
      
      ${t.message}
      
      ${confirmLink}
      
      ${t.ignoreMessage}
      
      ${t.expiryMessage}
      
      ${t.copyright}
    `
  };
};

export interface RequestEmailConfirmationResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function requestEmailConfirmation(
  email: string
): Promise<RequestEmailConfirmationResult> {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: "Invalid email address",
        error: "Invalid email format"
      };
    }

    await connectDb();

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: "If an account with that email exists, a confirmation email has been sent."
      };
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return {
        success: false,
        message: "Email is already verified.",
        error: "Email already verified"
      };
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update user with new verification token
    await User.findByIdAndUpdate(user._id, {
      verificationToken,
    });

    // Create confirmation link
    const confirmLink = `${
      process.env.NEXTAUTH_URL
    }/confirm-email?token=${verificationToken}`;

    // Send confirmation email
    try {
      validateEmailConfig();

      const emailContent = emailConfirmationTemplate(
        confirmLink, 
        user.username, 
        user.preferences?.language || "en"
      );

      const mailOptions = {
        from: `"Women's Spot" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      };

      await sendEmailWithTransporter(mailOptions);

      return {
        success: true,
        message: "Email confirmation sent successfully. Please check your email."
      };
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);

      // Remove the verification token if email failed
      await User.findByIdAndUpdate(user._id, {
        verificationToken: undefined,
      });

      return {
        success: false,
        message: "Failed to send confirmation email. Please try again later.",
        error: emailError instanceof Error ? emailError.message : "Email sending failed"
      };
    }
  } catch (error) {
    console.error('Request email confirmation action failed:', error);
    return {
      success: false,
      message: "Failed to process email confirmation request",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
