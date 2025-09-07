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
    copyright: "© 2025 Women Spot. All rights reserved.",
    // Email confirmation translations
    confirmSubject: "Confirm Your Email - Women Spot",
    confirmMessage: "Welcome to Women Spot! Please confirm your email address by clicking the button below to complete your account setup.",
    confirmButton: "Confirm Email",
    confirmIgnoreMessage: "If you didn't create an account with Women Spot, please ignore this email.",
    confirmExpiryMessage: "This confirmation link will expire in 24 hours for security reasons.",
    // Comment report translations
    reportSubject: "Comment Report Notification - Women Spot",
    reportMessage: "Your comment has been reported by another user and is currently under review by our moderation team.",
    reportReason: "Report Reason",
    reportAction: "What happens next?",
    reportActionText: "Our moderation team will review your comment and the report. If the comment violates our community guidelines, it may be removed. If it's found to be appropriate, it will remain visible.",
    reportAppeal: "If you believe this report was made in error, you can contact our support team.",
    reportContact: "Contact Support",
    reportThankYou: "Thank you for being part of our community and helping us maintain a safe environment for everyone."
  },
  pt: {
    subject: "Solicitação de Redefinição de Senha - Women Spot",
    greeting: "Olá",
    message: "Você solicitou recentemente a redefinição de sua senha para sua conta Women Spot. Clique no botão abaixo para redefini-la.",
    resetButton: "Redefinir Senha",
    ignoreMessage: "Se você não solicitou uma redefinição de senha, ignore este email ou entre em contato com o suporte se tiver dúvidas.",
    expiryMessage: "Este link de redefinição de senha expirará em 1 hora por motivos de segurança.",
    fallbackMessage: "Se o botão acima não funcionar, copie e cole este link no seu navegador:",
    copyright: "© 2025 Women Spot. Todos os direitos reservados.",
    // Email confirmation translations
    confirmSubject: "Confirme seu Email - Women Spot",
    confirmMessage: "Bem-vindo ao Women Spot! Confirme seu endereço de email clicando no botão abaixo para completar a configuração da sua conta.",
    confirmButton: "Confirmar Email",
    confirmIgnoreMessage: "Se você não criou uma conta no Women Spot, ignore este email.",
    confirmExpiryMessage: "Este link de confirmação expirará em 24 horas por motivos de segurança.",
    // Comment report translations
    reportSubject: "Notificação de Denúncia de Comentário - Women Spot",
    reportMessage: "Seu comentário foi denunciado por outro usuário e está atualmente sob revisão pela nossa equipe de moderação.",
    reportReason: "Motivo da Denúncia",
    reportAction: "O que acontece agora?",
    reportActionText: "Nossa equipe de moderação revisará seu comentário e a denúncia. Se o comentário violar nossas diretrizes da comunidade, ele pode ser removido. Se for considerado apropriado, permanecerá visível.",
    reportAppeal: "Se você acredita que esta denúncia foi feita por engano, pode entrar em contato com nossa equipe de suporte.",
    reportContact: "Contatar Suporte",
    reportThankYou: "Obrigado por fazer parte da nossa comunidade e nos ajudar a manter um ambiente seguro para todos."
  },
  es: {
    subject: "Solicitud de Restablecimiento de Contraseña - Women Spot",
    greeting: "Hola",
    message: "Recientemente solicitaste restablecer tu contraseña para tu cuenta Women Spot. Haz clic en el botón de abajo para restablecerla.",
    resetButton: "Restablecer Contraseña",
    ignoreMessage: "Si no solicitaste un restablecimiento de contraseña, ignora este correo o contacta al soporte si tienes inquietudes.",
    expiryMessage: "Este enlace de restablecimiento de contraseña expirará en 1 hora por razones de seguridad.",
    fallbackMessage: "Si el botón de arriba no funciona, copia y pega este enlace en tu navegador:",
    copyright: "© 2025 Women Spot. Todos los derechos reservados.",
    // Email confirmation translations
    confirmSubject: "Confirma tu Email - Women Spot",
    confirmMessage: "¡Bienvenido a Women Spot! Confirma tu dirección de email haciendo clic en el botón de abajo para completar la configuración de tu cuenta.",
    confirmButton: "Confirmar Email",
    confirmIgnoreMessage: "Si no creaste una cuenta en Women Spot, ignora este email.",
    confirmExpiryMessage: "Este enlace de confirmación expirará en 24 horas por razones de seguridad.",
    // Comment report translations
    reportSubject: "Notificación de Reporte de Comentario - Women Spot",
    reportMessage: "Tu comentario ha sido reportado por otro usuario y está actualmente bajo revisión por nuestro equipo de moderación.",
    reportReason: "Motivo del Reporte",
    reportAction: "¿Qué sucede ahora?",
    reportActionText: "Nuestro equipo de moderación revisará tu comentario y el reporte. Si el comentario viola nuestras pautas de la comunidad, puede ser removido. Si se considera apropiado, permanecerá visible.",
    reportAppeal: "Si crees que este reporte fue hecho por error, puedes contactar a nuestro equipo de soporte.",
    reportContact: "Contactar Soporte",
    reportThankYou: "Gracias por ser parte de nuestra comunidad y ayudarnos a mantener un ambiente seguro para todos."
  },
  fr: {
    subject: "Demande de Réinitialisation de Mot de Passe - Women Spot",
    greeting: "Bonjour",
    message: "Vous avez récemment demandé à réinitialiser votre mot de passe pour votre compte Women Spot. Cliquez sur le bouton ci-dessous pour le réinitialiser.",
    resetButton: "Réinitialiser le Mot de Passe",
    ignoreMessage: "Si vous n'avez pas demandé de réinitialisation de mot de passe, ignorez cet e-mail ou contactez le support si vous avez des préoccupations.",
    expiryMessage: "Ce lien de réinitialisation de mot de passe expirera dans 1 heure pour des raisons de sécurité.",
    fallbackMessage: "Si le bouton ci-dessus ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
    copyright: "© 2025 Women Spot. Tous droits réservés.",
    // Email confirmation translations
    confirmSubject: "Confirmez votre Email - Women Spot",
    confirmMessage: "Bienvenue sur Women Spot ! Veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous pour finaliser la configuration de votre compte.",
    confirmButton: "Confirmer l'Email",
    confirmIgnoreMessage: "Si vous n'avez pas créé de compte sur Women Spot, veuillez ignorer cet e-mail.",
    confirmExpiryMessage: "Ce lien de confirmation expirera dans 24 heures pour des raisons de sécurité.",
    // Comment report translations
    reportSubject: "Notification de Signalement de Commentaire - Women Spot",
    reportMessage: "Votre commentaire a été signalé par un autre utilisateur et est actuellement en cours d'examen par notre équipe de modération.",
    reportReason: "Motif du Signalement",
    reportAction: "Que se passe-t-il maintenant ?",
    reportActionText: "Notre équipe de modération examinera votre commentaire et le signalement. Si le commentaire viole nos directives communautaires, il peut être supprimé. S'il est jugé approprié, il restera visible.",
    reportAppeal: "Si vous pensez que ce signalement a été fait par erreur, vous pouvez contacter notre équipe de support.",
    reportContact: "Contacter le Support",
    reportThankYou: "Merci de faire partie de notre communauté et de nous aider à maintenir un environnement sûr pour tous."
  },
  de: {
    subject: "Passwort-Reset-Anfrage - Women Spot",
    greeting: "Hallo",
    message: "Sie haben kürzlich angefordert, Ihr Passwort für Ihr Women Spot-Konto zurückzusetzen. Klicken Sie auf die Schaltfläche unten, um es zurückzusetzen.",
    resetButton: "Passwort zurücksetzen",
    ignoreMessage: "Wenn Sie keinen Passwort-Reset angefordert haben, ignorieren Sie diese E-Mail oder kontaktieren Sie den Support, wenn Sie Bedenken haben.",
    expiryMessage: "Dieser Passwort-Reset-Link läuft aus Sicherheitsgründen in 1 Stunde ab.",
    fallbackMessage: "Wenn die Schaltfläche oben nicht funktioniert, kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:",
    copyright: "© 2025 Women Spot. Alle Rechte vorbehalten.",
    // Email confirmation translations
    confirmSubject: "Bestätigen Sie Ihre E-Mail - Women Spot",
    confirmMessage: "Willkommen bei Women Spot! Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken, um die Einrichtung Ihres Kontos abzuschließen.",
    confirmButton: "E-Mail bestätigen",
    confirmIgnoreMessage: "Wenn Sie kein Konto bei Women Spot erstellt haben, ignorieren Sie bitte diese E-Mail.",
    confirmExpiryMessage: "Dieser Bestätigungslink läuft aus Sicherheitsgründen in 24 Stunden ab.",
    // Comment report translations
    reportSubject: "Kommentar-Meldung Benachrichtigung - Women Spot",
    reportMessage: "Ihr Kommentar wurde von einem anderen Benutzer gemeldet und wird derzeit von unserem Moderations-Team überprüft.",
    reportReason: "Meldungsgrund",
    reportAction: "Was passiert als nächstes?",
    reportActionText: "Unser Moderations-Team wird Ihren Kommentar und die Meldung überprüfen. Wenn der Kommentar unsere Community-Richtlinien verletzt, kann er entfernt werden. Wenn er als angemessen befunden wird, bleibt er sichtbar.",
    reportAppeal: "Wenn Sie glauben, dass diese Meldung fälschlicherweise gemacht wurde, können Sie unser Support-Team kontaktieren.",
    reportContact: "Support Kontaktieren",
    reportThankYou: "Vielen Dank, dass Sie Teil unserer Community sind und uns helfen, eine sichere Umgebung für alle zu schaffen."
  },
  it: {
    subject: "Richiesta di Reset Password - Women Spot",
    greeting: "Ciao",
    message: "Hai recentemente richiesto di reimpostare la password per il tuo account Women Spot. Clicca sul pulsante qui sotto per reimpostarla.",
    resetButton: "Reimposta Password",
    ignoreMessage: "Se non hai richiesto un reset della password, ignora questa email o contatta il supporto se hai dubbi.",
    expiryMessage: "Questo link per il reset della password scadrà tra 1 ora per motivi di sicurezza.",
    fallbackMessage: "Se il pulsante sopra non funziona, copia e incolla questo link nel tuo browser:",
    copyright: "© 2025 Women Spot. Tutti i diritti riservati.",
    // Email confirmation translations
    confirmSubject: "Conferma il tuo Email - Women Spot",
    confirmMessage: "Benvenuto su Women Spot! Conferma il tuo indirizzo email cliccando sul pulsante qui sotto per completare la configurazione del tuo account.",
    confirmButton: "Conferma Email",
    confirmIgnoreMessage: "Se non hai creato un account su Women Spot, ignora questa email.",
    confirmExpiryMessage: "Questo link di conferma scadrà tra 24 ore per motivi di sicurezza.",
    // Comment report translations
    reportSubject: "Notifica Segnalazione Commento - Women Spot",
    reportMessage: "Il tuo commento è stato segnalato da un altro utente ed è attualmente in revisione dal nostro team di moderazione.",
    reportReason: "Motivo della Segnalazione",
    reportAction: "Cosa succede ora?",
    reportActionText: "Il nostro team di moderazione esaminerà il tuo commento e la segnalazione. Se il commento viola le nostre linee guida della community, potrebbe essere rimosso. Se è ritenuto appropriato, rimarrà visibile.",
    reportAppeal: "Se ritieni che questa segnalazione sia stata fatta per errore, puoi contattare il nostro team di supporto.",
    reportContact: "Contatta il Supporto",
    reportThankYou: "Grazie per far parte della nostra community e aiutarci a mantenere un ambiente sicuro per tutti."
  },
  nl: {
    subject: "Wachtwoord Reset Verzoek - Women Spot",
    greeting: "Hallo",
    message: "U heeft onlangs verzocht om uw wachtwoord voor uw Women Spot-account opnieuw in te stellen. Klik op de knop hieronder om het opnieuw in te stellen.",
    resetButton: "Wachtwoord Opnieuw Instellen",
    ignoreMessage: "Als u geen wachtwoord reset heeft aangevraagd, negeer dan deze e-mail of neem contact op met ondersteuning als u vragen heeft.",
    expiryMessage: "Deze wachtwoord reset link verloopt over 1 uur om veiligheidsredenen.",
    fallbackMessage: "Als de knop hierboven niet werkt, kopieer en plak deze link in uw browser:",
    copyright: "© 2025 Women Spot. Alle rechten voorbehouden.",
    // Email confirmation translations
    confirmSubject: "Bevestig uw E-mail - Women Spot",
    confirmMessage: "Welkom bij Women Spot! Bevestig uw e-mailadres door op de knop hieronder te klikken om de instelling van uw account te voltooien.",
    confirmButton: "E-mail Bevestigen",
    confirmIgnoreMessage: "Als u geen account heeft aangemaakt bij Women Spot, negeer dan deze e-mail.",
    confirmExpiryMessage: "Deze bevestigingslink verloopt over 24 uur om veiligheidsredenen.",
    // Comment report translations
    reportSubject: "Commentaar Rapportage Melding - Women Spot",
    reportMessage: "Uw commentaar is gerapporteerd door een andere gebruiker en wordt momenteel beoordeeld door ons moderatieteam.",
    reportReason: "Rapportage Reden",
    reportAction: "Wat gebeurt er nu?",
    reportActionText: "Ons moderatieteam zal uw commentaar en de rapportage beoordelen. Als het commentaar onze communityrichtlijnen schendt, kan het worden verwijderd. Als het geschikt wordt geacht, blijft het zichtbaar.",
    reportAppeal: "Als u denkt dat deze rapportage ten onrechte is gemaakt, kunt u contact opnemen met ons supportteam.",
    reportContact: "Contact Support",
    reportThankYou: "Bedankt voor het deel uitmaken van onze community en ons helpen een veilige omgeving voor iedereen te behouden."
  },
  he: {
    subject: "בקשת איפוס סיסמה - Women Spot",
    greeting: "שלום",
    message: "ביקשת לאחרונה לאפס את הסיסמה שלך עבור חשבון Women Spot שלך. לחץ על הכפתור למטה כדי לאפס אותה.",
    resetButton: "אפס סיסמה",
    ignoreMessage: "אם לא ביקשת איפוס סיסמה, אנא התעלם מהאימייל הזה או פנה לתמיכה אם יש לך חששות.",
    expiryMessage: "קישור איפוס הסיסמה הזה יפוג תוקף תוך שעה מסיבות אבטחה.",
    fallbackMessage: "אם הכפתור למעלה לא עובד, העתק והדבק את הקישור הזה בדפדפן שלך:",
    copyright: "© 2025 Women Spot. כל הזכויות שמורות.",
    // Email confirmation translations
    confirmSubject: "אמת את האימייל שלך - Women Spot",
    confirmMessage: "ברוכים הבאים ל-Women Spot! אנא אמת את כתובת האימייל שלך על ידי לחיצה על הכפתור למטה כדי להשלים את הגדרת החשבון שלך.",
    confirmButton: "אמת אימייל",
    confirmIgnoreMessage: "אם לא יצרת חשבון ב-Women Spot, אנא התעלם מהאימייל הזה.",
    confirmExpiryMessage: "קישור האימות הזה יפוג תוקף תוך 24 שעות מסיבות אבטחה.",
    // Comment report translations
    reportSubject: "התראה על דיווח תגובה - Women Spot",
    reportMessage: "התגובה שלך דווחה על ידי משתמש אחר ונמצאת כעת בבדיקה על ידי צוות המודרציה שלנו.",
    reportReason: "סיבת הדיווח",
    reportAction: "מה קורה עכשיו?",
    reportActionText: "צוות המודרציה שלנו יבדוק את התגובה שלך ואת הדיווח. אם התגובה מפרה את הנחיות הקהילה שלנו, היא עלולה להימחק. אם היא נחשבת מתאימה, היא תישאר גלויה.",
    reportAppeal: "אם אתה חושב שהדיווח הזה נעשה בטעות, אתה יכול ליצור קשר עם צוות התמיכה שלנו.",
    reportContact: "צור קשר עם התמיכה",
    reportThankYou: "תודה על היותך חלק מהקהילה שלנו ועל עזרתך לשמור על סביבה בטוחה לכולם."
  },
  ru: {
    subject: "Запрос на сброс пароля - Women Spot",
    greeting: "Привет",
    message: "Вы недавно запросили сброс пароля для вашего аккаунта Women Spot. Нажмите кнопку ниже, чтобы сбросить его.",
    resetButton: "Сбросить пароль",
    ignoreMessage: "Если вы не запрашивали сброс пароля, проигнорируйте это письмо или обратитесь в службу поддержки, если у вас есть вопросы.",
    expiryMessage: "Эта ссылка для сброса пароля истечет через 1 час по соображениям безопасности.",
    fallbackMessage: "Если кнопка выше не работает, скопируйте и вставьте эту ссылку в ваш браузер:",
    copyright: "© 2025 Women Spot. Все права защищены.",
    // Email confirmation translations
    confirmSubject: "Подтвердите ваш Email - Women Spot",
    confirmMessage: "Добро пожаловать в Women Spot! Пожалуйста, подтвердите ваш адрес электронной почты, нажав кнопку ниже, чтобы завершить настройку вашего аккаунта.",
    confirmButton: "Подтвердить Email",
    confirmIgnoreMessage: "Если вы не создавали аккаунт в Women Spot, проигнорируйте это письмо.",
    confirmExpiryMessage: "Эта ссылка для подтверждения истечет через 24 часа по соображениям безопасности.",
    // Comment report translations
    reportSubject: "Уведомление о жалобе на комментарий - Women Spot",
    reportMessage: "Ваш комментарий был пожалован другим пользователем и в настоящее время рассматривается нашей командой модерации.",
    reportReason: "Причина жалобы",
    reportAction: "Что происходит дальше?",
    reportActionText: "Наша команда модерации рассмотрит ваш комментарий и жалобу. Если комментарий нарушает наши правила сообщества, он может быть удален. Если он признан подходящим, он останется видимым.",
    reportAppeal: "Если вы считаете, что эта жалоба была подана по ошибке, вы можете связаться с нашей службой поддержки.",
    reportContact: "Связаться с поддержкой",
    reportThankYou: "Спасибо за то, что вы являетесь частью нашего сообщества и помогаете нам поддерживать безопасную среду для всех."
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
  },
  
  emailConfirmation: (confirmLink: string, username: string, locale: string = 'en') => {
    const t = emailTranslations[locale as keyof typeof emailTranslations] || emailTranslations.en;
    
    return {
      subject: t.confirmSubject,
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
              ${t.confirmMessage}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmLink}" 
                 style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                ${t.confirmButton}
              </a>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              ${t.confirmIgnoreMessage}
            </p>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              ${t.confirmExpiryMessage}
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
        ${t.confirmSubject}
        
        ${t.greeting} ${username}!
        
        ${t.confirmMessage}
        
        ${confirmLink}
        
        ${t.confirmIgnoreMessage}
        
        ${t.confirmExpiryMessage}
        
        ${t.copyright}
      `
    };
  },
  commentReport: (commentText: string, reason: string, articleTitle: string, username: string, locale: string = 'en') => {
    const t = emailTranslations[locale as keyof typeof emailTranslations] || emailTranslations.en;
    
    return {
      subject: t.reportSubject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${t.reportSubject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #ec4899; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: white;">
                <span style="margin-right: 0.5em;">🤍</span>Women Spot
              </h1>
            </div>
            
            <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <h2 style="color: #374151; margin-bottom: 20px;">${t.greeting} ${username}!</h2>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                ${t.reportMessage}
              </p>
              
              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
                <h3 style="color: #374151; margin-top: 0; margin-bottom: 15px;">Article: ${articleTitle}</h3>
                <p style="color: #6b7280; margin-bottom: 10px; font-weight: 600;">Your Comment:</p>
                <p style="color: #374151; font-style: italic; background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #ec4899; margin-bottom: 15px;">
                  "${commentText}"
                </p>
                <p style="color: #6b7280; margin-bottom: 5px; font-weight: 600;">${t.reportReason}:</p>
                <p style="color: #ec4899; font-weight: bold; margin: 0;">${reason}</p>
              </div>
              
              <h3 style="color: #374151; margin-bottom: 15px;">${t.reportAction}</h3>
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                ${t.reportActionText}
              </p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                ${t.reportAppeal}
              </p>
              
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                ${t.reportThankYou}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0;">
                ${t.copyright}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ${t.reportSubject}
        
        ${t.greeting} ${username}!
        
        ${t.reportMessage}
        
        Article: ${articleTitle}
        Your Comment: "${commentText}"
        ${t.reportReason}: ${reason}
        
        ${t.reportAction}
        ${t.reportActionText}
        
        ${t.reportAppeal}
        
        ${t.reportThankYou}
        
        ${t.copyright}
      `
    };
  }
};

// Send email function
export const sendEmail = async (
  to: string,
  template: keyof typeof emailTemplates,
  data: { 
    resetLink?: string; 
    confirmLink?: string; 
    username: string; 
    locale?: string;
    commentText?: string;
    reason?: string;
    articleTitle?: string;
  }
) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        "Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables."
      );
    }

    let emailContent;
    
    if (template === 'commentReport') {
      // commentReport template has different parameters
      if (!data.commentText || !data.reason || !data.articleTitle) {
        throw new Error("commentText, reason, and articleTitle are required for comment report emails");
      }
      emailContent = emailTemplates[template](
        data.commentText,
        data.reason,
        data.articleTitle,
        data.username,
        data.locale || 'en'
      );
    } else {
      // Other templates need a link
      const link = data.resetLink || data.confirmLink;
      if (!link) {
        throw new Error("Either resetLink or confirmLink must be provided");
      }
      emailContent = emailTemplates[template](
        link,
        data.username,
        data.locale || 'en'
      );
    }

    const mailOptions = {
      from: `"Women Spot" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const info = await transporter.sendMail(mailOptions);

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
  try {
    console.log("Email service: Starting password reset email send process");
    return await sendEmail(email, 'passwordReset', { resetLink, username, locale });
  } catch (error) {
    console.error("Email service: Failed to send password reset email:", error);
    throw error;
  }
};

// Specific function for email confirmation emails
export const sendEmailConfirmation = async (
  email: string,
  username: string,
  confirmLink: string,
  locale: string = 'en'
) => {
  try {
    console.log("Email service: Starting email confirmation send process");
    return await sendEmail(email, 'emailConfirmation', { confirmLink, username, locale });
  } catch (error) {
    console.error("Email service: Failed to send email confirmation:", error);
    throw error;
  }
};

// Specific function for comment report emails
export const sendCommentReportEmail = async (
  email: string,
  username: string,
  commentText: string,
  reason: string,
  articleTitle: string,
  locale: string = 'en'
) => {
  try {
    console.log("Email service: Starting comment report email send process");
    
    return await sendEmail(email, 'commentReport', {
      username,
      commentText,
      reason,
      articleTitle,
      locale
    });
  } catch (error) {
    console.error("Email service: Failed to send comment report email:", error);
    throw new Error(
      `Failed to send comment report email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
