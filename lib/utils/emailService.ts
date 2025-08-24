import * as nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Email content translations
const emailTranslations = {
  en: {
    subject: "Password Reset Request - Women Spot",
    greeting: "Hello",
    message: "You recently requested to reset your password for your Women Spot account. Click the button below to reset it.",
    resetButton: "Reset Password",
    ignoreMessage: "If you didn't request a password reset, please ignore this email or contact support if you have concerns.",
    expiryMessage: "This password reset link will expire in 1 hour for security reasons.",
    fallbackMessage: "If the button above doesn't work, copy and paste this link into your browser:",
    copyright: "© 2025 Women Spot. All rights reserved."
  },
  pt: {
    subject: "Solicitação de Redefinição de Senha - Women Spot",
    greeting: "Olá",
    message: "Você solicitou recentemente a redefinição de sua senha para sua conta Women Spot. Clique no botão abaixo para redefini-la.",
    resetButton: "Redefinir Senha",
    ignoreMessage: "Se você não solicitou uma redefinição de senha, ignore este email ou entre em contato com o suporte se tiver dúvidas.",
    expiryMessage: "Este link de redefinição de senha expirará em 1 hora por motivos de segurança.",
    fallbackMessage: "Se o botão acima não funcionar, copie e cole este link no seu navegador:",
    copyright: "© 2025 Women Spot. Todos os direitos reservados."
  },
  es: {
    subject: "Solicitud de Restablecimiento de Contraseña - Women Spot",
    greeting: "Hola",
    message: "Recientemente solicitaste restablecer tu contraseña para tu cuenta Women Spot. Haz clic en el botón de abajo para restablecerla.",
    resetButton: "Restablecer Contraseña",
    ignoreMessage: "Si no solicitaste un restablecimiento de contraseña, ignora este correo o contacta al soporte si tienes inquietudes.",
    expiryMessage: "Este enlace de restablecimiento de contraseña expirará en 1 hora por razones de seguridad.",
    fallbackMessage: "Si el botón de arriba no funciona, copia y pega este enlace en tu navegador:",
    copyright: "© 2025 Women Spot. Todos los derechos reservados."
  },
  fr: {
    subject: "Demande de Réinitialisation de Mot de Passe - Women Spot",
    greeting: "Bonjour",
    message: "Vous avez récemment demandé à réinitialiser votre mot de passe pour votre compte Women Spot. Cliquez sur le bouton ci-dessous pour le réinitialiser.",
    resetButton: "Réinitialiser le Mot de Passe",
    ignoreMessage: "Si vous n'avez pas demandé de réinitialisation de mot de passe, ignorez cet e-mail ou contactez le support si vous avez des préoccupations.",
    expiryMessage: "Ce lien de réinitialisation de mot de passe expirera dans 1 heure pour des raisons de sécurité.",
    fallbackMessage: "Si le bouton ci-dessus ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
    copyright: "© 2025 Women Spot. Tous droits réservés."
  },
  de: {
    subject: "Passwort-Reset-Anfrage - Women Spot",
    greeting: "Hallo",
    message: "Sie haben kürzlich angefordert, Ihr Passwort für Ihr Women Spot-Konto zurückzusetzen. Klicken Sie auf die Schaltfläche unten, um es zurückzusetzen.",
    resetButton: "Passwort zurücksetzen",
    ignoreMessage: "Wenn Sie keinen Passwort-Reset angefordert haben, ignorieren Sie diese E-Mail oder kontaktieren Sie den Support, wenn Sie Bedenken haben.",
    expiryMessage: "Dieser Passwort-Reset-Link läuft aus Sicherheitsgründen in 1 Stunde ab.",
    fallbackMessage: "Wenn die Schaltfläche oben nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:",
    copyright: "© 2025 Women Spot. Alle Rechte vorbehalten."
  },
  it: {
    subject: "Richiesta di Reset Password - Women Spot",
    greeting: "Ciao",
    message: "Hai recentemente richiesto di reimpostare la password per il tuo account Women Spot. Clicca sul pulsante qui sotto per reimpostarla.",
    resetButton: "Reimposta Password",
    ignoreMessage: "Se non hai richiesto un reset della password, ignora questa email o contatta il supporto se hai dubbi.",
    expiryMessage: "Questo link per il reset della password scadrà tra 1 ora per motivi di sicurezza.",
    fallbackMessage: "Se il pulsante sopra non funziona, copia e incolla questo link nel tuo browser:",
    copyright: "© 2025 Women Spot. Tutti i diritti riservati."
  },
  nl: {
    subject: "Wachtwoord Reset Verzoek - Women Spot",
    greeting: "Hallo",
    message: "U heeft onlangs verzocht om uw wachtwoord voor uw Women Spot-account opnieuw in te stellen. Klik op de knop hieronder om het opnieuw in te stellen.",
    resetButton: "Wachtwoord Opnieuw Instellen",
    ignoreMessage: "Als u geen wachtwoord reset heeft aangevraagd, negeer dan deze e-mail of neem contact op met ondersteuning als u vragen heeft.",
    expiryMessage: "Deze wachtwoord reset link verloopt over 1 uur om veiligheidsredenen.",
    fallbackMessage: "Als de knop hierboven niet werkt, kopieer en plak deze link in uw browser:",
    copyright: "© 2025 Women Spot. Alle rechten voorbehouden."
  },
  he: {
    subject: "בקשת איפוס סיסמה - Women Spot",
    greeting: "שלום",
    message: "ביקשת לאחרונה לאפס את הסיסמה שלך עבור חשבון Women Spot שלך. לחץ על הכפתור למטה כדי לאפס אותה.",
    resetButton: "אפס סיסמה",
    ignoreMessage: "אם לא ביקשת איפוס סיסמה, אנא התעלם מהאימייל הזה או פנה לתמיכה אם יש לך חששות.",
    expiryMessage: "קישור איפוס הסיסמה הזה יפוג תוקף תוך שעה מסיבות אבטחה.",
    fallbackMessage: "אם הכפתור למעלה לא עובד, העתק והדבק את הקישור הזה בדפדפן שלך:",
    copyright: "© 2025 Women Spot. כל הזכויות שמורות."
  },
  ru: {
    subject: "Запрос на сброс пароля - Women Spot",
    greeting: "Привет",
    message: "Вы недавно запросили сброс пароля для вашего аккаунта Women Spot. Нажмите кнопку ниже, чтобы сбросить его.",
    resetButton: "Сбросить пароль",
    ignoreMessage: "Если вы не запрашивали сброс пароля, проигнорируйте это письмо или обратитесь в службу поддержки, если у вас есть вопросы.",
    expiryMessage: "Эта ссылка для сброса пароля истечет через 1 час по соображениям безопасности.",
    fallbackMessage: "Если кнопка выше не работает, скопируйте и вставьте эту ссылку в ваш браузер:",
    copyright: "© 2025 Women Spot. Все права защищены."
  }
};

// Email templates with internationalization
const emailTemplates = {
  passwordReset: (resetLink: string, username: string, locale: string = 'en') => {
    const t = emailTranslations[locale as keyof typeof emailTranslations] || emailTranslations.en;
    
    return {
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px; color: white;">
              <span style="margin-right: 0.5em;">🤍</span>Women Spot
            </h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #374151; margin-bottom: 20px;">${t.greeting} ${username}!</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              ${t.message}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                ${t.resetButton}
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
              <a href="${resetLink}" style="color: #ec4899;">${resetLink}</a>
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
        
        ${resetLink}
        
        ${t.ignoreMessage}
        
        ${t.expiryMessage}
        
        ${t.copyright}
      `
    };
  }
};

// Send email function
export const sendEmail = async (
  to: string,
  template: keyof typeof emailTemplates,
  data: { resetLink: string; username: string; locale?: string }
) => {
  try {
    console.log("Email service: Starting email send process");
    console.log("Email service: Environment check:", {
      hasUser: !!process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD,
      user: process.env.EMAIL_USER,
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        "Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables."
      );
    }

    console.log("Email service: Creating email content");
    const emailContent = emailTemplates[template](
      data.resetLink,
      data.username,
      data.locale || 'en'
    );

    const mailOptions = {
      from: `"Women Spot" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    console.log("Email service: Sending email to:", to);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email service: Failed to send email:", error);
    throw new Error(
      `Failed to send email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Specific function for password reset emails
export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  resetLink: string,
  locale: string = 'en'
) => {
  return sendEmail(email, 'passwordReset', { resetLink, username, locale });
};
