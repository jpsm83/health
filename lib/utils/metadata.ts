import { Metadata } from 'next';

// Language mapping for proper hreflang values
export const languageMap: Record<string, string> = {
  'en': 'en-US',
  'pt': 'pt-BR', 
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'it': 'it-IT',
  'nl': 'nl-NL',
  'he': 'he-IL',
  'ru': 'ru-RU'
};

// Supported locales
export const supportedLocales = ['en', 'pt', 'es', 'fr', 'de', 'it', 'nl', 'he', 'ru'];

// Generate language alternates for a given route
export function generateLanguageAlternates(route: string): Record<string, string> {
  const languageAlternates: Record<string, string> = {};
  
  supportedLocales.forEach(lang => {
    const properLangCode = languageMap[lang] || lang;
    languageAlternates[properLangCode] = `/${lang}${route}`;
  });
  
  return languageAlternates;
}

// Base metadata configuration
export const baseMetadata = {
  authors: [{ name: 'Health App Team' }],
  creator: 'Health App',
  publisher: 'Health App',
  siteName: 'Health App',
  images: [
    {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Health App',
    },
  ],
};

// Generate metadata for public pages (indexable) with language support
export async function generatePublicMetadata(
  locale: string,
  route: string,
  titleKey: string,
  descriptionKey: string,
  keywordsKey?: string
): Promise<Metadata> {
  // For now, let's use hardcoded translations until we fix the dynamic loading
  const translations: Record<string, Record<string, Record<string, string>>> = {
    'en': {
      'home': {
        'title': 'Health App - Your Comprehensive Health and Wellness Platform',
        'description': 'Discover articles, tips, and resources to improve your health and well-being. Access comprehensive health content in multiple languages.',
        'keywords': 'health, wellness, fitness, nutrition, articles, tips, resources, multilingual'
      },
      'signin': {
        'title': 'Sign In - Health App',
        'description': 'Sign in to your Health App account to access your personalized health dashboard, articles, and wellness resources.',
        'keywords': 'sign in, login, health app, account, authentication, health dashboard'
      },
      'signup': {
        'title': 'Sign Up - Health App',
        'description': 'Create your Health App account to access personalized health content, track your wellness journey, and join our health community.',
        'keywords': 'sign up, register, create account, health app, health community, wellness tracking'
      },
      'dashboard': {
        'title': 'Dashboard - Health App',
        'description': 'Your personalized health overview and insights. Track your health goals, progress, and access your health articles and resources.',
        'keywords': 'health dashboard, health goals, progress tracking, health insights, personal health, wellness tracking'
      },
      'profile': {
        'title': 'Profile - Health App',
        'description': 'Manage your Health App account settings, preferences, and personal information. Customize your health experience and language preferences.',
        'keywords': 'user profile, account settings, preferences, personal information, health app settings, language preferences'
      },
      'createArticle': {
        'title': 'Create Article - Health App',
        'description': 'Share your health knowledge with the community. Create and publish health articles, tips, and wellness content in multiple languages.',
        'keywords': 'create article, write health content, publish health tips, wellness articles, health knowledge sharing, content creation'
      },
      'forgotPassword': {
        'title': 'Forgot Password - Health App',
        'description': 'Reset your Health App password. Enter your email address and we\'ll send you a secure link to reset your password.',
        'keywords': 'forgot password, reset password, password recovery, health app login, account recovery'
      },
      'resetPassword': {
        'title': 'Reset Password - Health App',
        'description': 'Set your new password for your Health App account. Enter your new password below to complete the password reset process.',
        'keywords': 'reset password, new password, password change, health app security, account security'
      }
    },
    'pt': {
      'home': {
        'title': 'Health App - Sua Plataforma Abrangente de Saúde e Bem-estar',
        'description': 'Descubra artigos, dicas e recursos para melhorar sua saúde e bem-estar. Acesse conteúdo de saúde abrangente em vários idiomas.',
        'keywords': 'saúde, bem-estar, fitness, nutrição, artigos, dicas, recursos, multilíngue'
      },
      'signin': {
        'title': 'Entrar - Health App',
        'description': 'Entre na sua conta Health App para acessar seu painel de saúde personalizado, artigos e recursos de bem-estar.',
        'keywords': 'entrar, login, health app, conta, autenticação, painel de saúde'
      },
      'signup': {
        'title': 'Cadastrar - Health App',
        'description': 'Crie sua conta Health App para acessar conteúdo de saúde personalizado, acompanhar sua jornada de bem-estar e se juntar à nossa comunidade de saúde.',
        'keywords': 'cadastrar, registrar, criar conta, health app, comunidade de saúde, acompanhamento de bem-estar'
      },
      'dashboard': {
        'title': 'Painel - Health App',
        'description': 'Sua visão geral de saúde personalizada e insights. Acompanhe suas metas de saúde, progresso e acesse seus artigos e recursos de saúde.',
        'keywords': 'painel de saúde, metas de saúde, acompanhamento de progresso, insights de saúde, saúde pessoal, acompanhamento de bem-estar'
      },
      'profile': {
        'title': 'Perfil - Health App',
        'description': 'Gerencie as configurações da sua conta Health App, preferências e informações pessoais. Personalize sua experiência de saúde e preferências de idioma.',
        'keywords': 'perfil do usuário, configurações da conta, preferências, informações pessoais, configurações do health app, preferências de idioma'
      },
      'createArticle': {
        'title': 'Criar Artigo - Health App',
        'description': 'Compartilhe seu conhecimento sobre saúde com a comunidade. Crie e publique artigos de saúde, dicas e conteúdo de bem-estar em vários idiomas.',
        'keywords': 'criar artigo, escrever conteúdo de saúde, publicar dicas de saúde, artigos de bem-estar, compartilhamento de conhecimento sobre saúde, criação de conteúdo'
      },
      'forgotPassword': {
        'title': 'Esqueceu a Senha - Health App',
        'description': 'Redefina sua senha Health App. Digite seu endereço de email e enviaremos um link seguro para redefinir sua senha.',
        'keywords': 'esqueceu a senha, redefinir senha, recuperação de senha, login health app, recuperação de conta'
      },
      'resetPassword': {
        'title': 'Redefinir Senha - Health App',
        'description': 'Defina sua nova senha para sua conta Health App. Digite sua nova senha abaixo para completar o processo de redefinição de senha.',
        'keywords': 'redefinir senha, nova senha, alteração de senha, segurança health app, segurança da conta'
      }
    },
    'es': {
      'home': {
        'title': 'Health App - Tu Plataforma Integral de Salud y Bienestar',
        'description': 'Descubre artículos, consejos y recursos para mejorar tu salud y bienestar. Accede a contenido de salud integral en múltiples idiomas.',
        'keywords': 'salud, bienestar, fitness, nutrición, artículos, consejos, recursos, multilingüe'
      },
      'signin': {
        'title': 'Iniciar Sesión - Health App',
        'description': 'Inicia sesión en tu cuenta Health App para acceder a tu panel de salud personalizado, artículos y recursos de bienestar.',
        'keywords': 'iniciar sesión, login, health app, cuenta, autenticación, panel de salud'
      },
      'signup': {
        'title': 'Registrarse - Health App',
        'description': 'Crea tu cuenta Health App para acceder a contenido de salud personalizado, rastrear tu viaje de bienestar y unirte a nuestra comunidad de salud.',
        'keywords': 'registrarse, crear cuenta, health app, comunidad de salud, seguimiento de bienestar'
      },
      'dashboard': {
        'title': 'Panel - Health App',
        'description': 'Tu vista general de salud personalizada e insights. Rastrea tus metas de salud, progreso y accede a tus artículos y recursos de salud.',
        'keywords': 'panel de salud, metas de salud, seguimiento de progreso, insights de salud, salud personal, seguimiento de bienestar'
      },
      'profile': {
        'title': 'Perfil - Health App',
        'description': 'Gestiona la configuración de tu cuenta Health App, preferencias e información personal. Personaliza tu experiencia de salud y preferencias de idioma.',
        'keywords': 'perfil de usuario, configuración de cuenta, preferencias, información personal, configuración de health app, preferencias de idioma'
      },
      'createArticle': {
        'title': 'Crear Artículo - Health App',
        'description': 'Comparte tu conocimiento sobre salud con la comunidad. Crea y publica artículos de salud, consejos y contenido de bienestar en múltiples idiomas.',
        'keywords': 'crear artículo, escribir contenido de salud, publicar consejos de salud, artículos de bienestar, compartir conocimiento de salud, creación de contenido'
      },
      'forgotPassword': {
        'title': 'Olvidé mi Contraseña - Health App',
        'description': 'Restablece tu contraseña Health App. Ingresa tu dirección de correo y te enviaremos un enlace seguro para restablecer tu contraseña.',
        'keywords': 'olvidé contraseña, restablecer contraseña, recuperación de contraseña, login health app, recuperación de cuenta'
      },
      'resetPassword': {
        'title': 'Restablecer Contraseña - Health App',
        'description': 'Establece tu nueva contraseña para tu cuenta Health App. Ingresa tu nueva contraseña a continuación para completar el proceso de restablecimiento de contraseña.',
        'keywords': 'restablecer contraseña, nueva contraseña, cambio de contraseña, seguridad health app, seguridad de cuenta'
      }
    },
    'fr': {
      'home': {
        'title': 'Health App - Votre Plateforme Complète de Santé et de Bien-être',
        'description': 'Découvrez des articles, conseils et ressources pour améliorer votre santé et votre bien-être. Accédez à du contenu de santé complet en plusieurs langues.',
        'keywords': 'santé, bien-être, fitness, nutrition, articles, conseils, ressources, multilingue'
      },
      'signin': {
        'title': 'Se Connecter - Health App',
        'description': 'Connectez-vous à votre compte Health App pour accéder à votre tableau de bord de santé personnalisé, articles et ressources de bien-être.',
        'keywords': 'se connecter, login, health app, compte, authentification, tableau de bord de santé'
      },
      'signup': {
        'title': 'S\'inscrire - Health App',
        'description': 'Créez votre compte Health App pour accéder à du contenu de santé personnalisé, suivre votre parcours de bien-être et rejoindre notre communauté de santé.',
        'keywords': 's\'inscrire, créer compte, health app, communauté de santé, suivi de bien-être'
      },
      'dashboard': {
        'title': 'Tableau de Bord - Health App',
        'description': 'Votre aperçu de santé personnalisé et vos insights. Suivez vos objectifs de santé, votre progression et accédez à vos articles et ressources de santé.',
        'keywords': 'tableau de bord de santé, objectifs de santé, suivi de progression, insights de santé, santé personnelle, suivi de bien-être'
      },
      'profile': {
        'title': 'Profil - Health App',
        'description': 'Gérez les paramètres de votre compte Health App, vos préférences et vos informations personnelles. Personnalisez votre expérience de santé et vos préférences linguistiques.',
        'keywords': 'profil utilisateur, paramètres de compte, préférences, informations personnelles, paramètres health app, préférences linguistiques'
      },
      'createArticle': {
        'title': 'Créer un Article - Health App',
        'description': 'Partagez vos connaissances en santé avec la communauté. Créez et publiez des articles de santé, conseils et contenu de bien-être en plusieurs langues.',
        'keywords': 'créer article, écrire contenu de santé, publier conseils de santé, articles de bien-être, partage de connaissances en santé, création de contenu'
      },
      'forgotPassword': {
        'title': 'Mot de Passe Oublié - Health App',
        'description': 'Réinitialisez votre mot de passe Health App. Entrez votre adresse e-mail et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.',
        'keywords': 'mot de passe oublié, réinitialiser mot de passe, récupération de mot de passe, connexion health app, récupération de compte'
      },
      'resetPassword': {
        'title': 'Réinitialiser le Mot de Passe - Health App',
        'description': 'Définissez votre nouveau mot de passe pour votre compte Health App. Entrez votre nouveau mot de passe ci-dessous pour compléter le processus de réinitialisation.',
        'keywords': 'réinitialiser mot de passe, nouveau mot de passe, changement de mot de passe, sécurité health app, sécurité de compte'
      }
    },
    'de': {
      'home': {
        'title': 'Health App - Ihre Umfassende Gesundheits- und Wohlbefinden-Plattform',
        'description': 'Entdecken Sie Artikel, Tipps und Ressourcen zur Verbesserung Ihrer Gesundheit und Ihres Wohlbefindens. Greifen Sie auf umfassende Gesundheitsinhalte in mehreren Sprachen zu.',
        'keywords': 'Gesundheit, Wohlbefinden, Fitness, Ernährung, Artikel, Tipps, Ressourcen, mehrsprachig'
      },
      'signin': {
        'title': 'Anmelden - Health App',
        'description': 'Melden Sie sich in Ihrem Health App-Konto an, um auf Ihr personalisiertes Gesundheits-Dashboard, Artikel und Wohlbefinden-Ressourcen zuzugreifen.',
        'keywords': 'anmelden, login, health app, konto, authentifizierung, gesundheits-dashboard'
      },
      'signup': {
        'title': 'Registrieren - Health App',
        'description': 'Erstellen Sie Ihr Health App-Konto, um auf personalisierte Gesundheitsinhalte zuzugreifen, Ihre Wohlbefinden-Reise zu verfolgen und sich unserer Gesundheitsgemeinschaft anzuschließen.',
        'keywords': 'registrieren, konto erstellen, health app, gesundheitsgemeinschaft, wohlbefinden-verfolgung'
      },
      'dashboard': {
        'title': 'Dashboard - Health App',
        'description': 'Ihr personalisierter Gesundheitsüberblick und Einblicke. Verfolgen Sie Ihre Gesundheitsziele, Fortschritte und greifen Sie auf Ihre Gesundheitsartikel und -ressourcen zu.',
        'keywords': 'gesundheits-dashboard, gesundheitsziele, fortschrittsverfolgung, gesundheitseinblicke, persönliche gesundheit, wohlbefinden-verfolgung'
      },
      'profile': {
        'title': 'Profil - Health App',
        'description': 'Verwalten Sie Ihre Health App-Kontoeinstellungen, Präferenzen und persönlichen Informationen. Passen Sie Ihre Gesundheitsexperience und Sprachpräferenzen an.',
        'keywords': 'benutzerprofil, kontoeinstellungen, präferenzen, persönliche informationen, health app-einstellungen, sprachpräferenzen'
      },
      'createArticle': {
        'title': 'Artikel Erstellen - Health App',
        'description': 'Teilen Sie Ihr Gesundheitswissen mit der Gemeinschaft. Erstellen und publizieren Sie Gesundheitsartikel, Tipps und Wohlbefinden-Inhalte in mehreren Sprachen.',
        'keywords': 'artikel erstellen, gesundheitsinhalte schreiben, gesundheitstipps veröffentlichen, wohlbefinden-artikel, gesundheitswissen teilen, inhaltserstellung'
      },
      'forgotPassword': {
        'title': 'Passwort Vergessen - Health App',
        'description': 'Setzen Sie Ihr Health App-Passwort zurück. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen sicheren Link zum Zurücksetzen Ihres Passworts.',
        'keywords': 'passwort vergessen, passwort zurücksetzen, passwortwiederherstellung, health app login, kontowiederherstellung'
      },
      'resetPassword': {
        'title': 'Passwort Zurücksetzen - Health App',
        'description': 'Legen Sie Ihr neues Passwort für Ihr Health App-Konto fest. Geben Sie Ihr neues Passwort unten ein, um den Passwort-Reset-Prozess abzuschließen.',
        'keywords': 'passwort zurücksetzen, neues passwort, passwortänderung, health app sicherheit, kontosicherheit'
      }
    },
    'it': {
      'home': {
        'title': 'Health App - La Tua Piattaforma Completa di Salute e Benessere',
        'description': 'Scopri articoli, consigli e risorse per migliorare la tua salute e il tuo benessere. Accedi a contenuti di salute completi in più lingue.',
        'keywords': 'salute, benessere, fitness, nutrizione, articoli, consigli, risorse, multilingue'
      },
      'signin': {
        'title': 'Accedi - Health App',
        'description': 'Accedi al tuo account Health App per accedere alla tua dashboard di salute personalizzata, articoli e risorse di benessere.',
        'keywords': 'accedi, login, health app, account, autenticazione, dashboard di salute'
      },
      'signup': {
        'title': 'Registrati - Health App',
        'description': 'Crea il tuo account Health App per accedere a contenuti di salute personalizzati, traccia il tuo percorso di benessere e unisciti alla nostra comunità di salute.',
        'keywords': 'registrati, crea account, health app, comunità di salute, tracciamento benessere'
      },
      'dashboard': {
        'title': 'Dashboard - Health App',
        'description': 'La tua panoramica di salute personalizzata e approfondimenti. Traccia i tuoi obiettivi di salute, progressi e accedi ai tuoi articoli e risorse di salute.',
        'keywords': 'dashboard di salute, obiettivi di salute, tracciamento progressi, approfondimenti di salute, salute personale, tracciamento benessere'
      },
      'profile': {
        'title': 'Profilo - Health App',
        'description': 'Gestisci le impostazioni del tuo account Health App, preferenze e informazioni personali. Personalizza la tua esperienza di salute e preferenze linguistiche.',
        'keywords': 'profilo utente, impostazioni account, preferenze, informazioni personali, impostazioni health app, preferenze linguistiche'
      },
      'createArticle': {
        'title': 'Crea Articolo - Health App',
        'description': 'Condividi la tua conoscenza sulla salute con la comunità. Crea e pubblica articoli di salute, consigli e contenuti di benessere in più lingue.',
        'keywords': 'crea articolo, scrivi contenuti di salute, pubblica consigli di salute, articoli di benessere, condivisione conoscenza salute, creazione contenuti'
      },
      'forgotPassword': {
        'title': 'Password Dimenticata - Health App',
        'description': 'Reimposta la tua password Health App. Inserisci il tuo indirizzo email e ti invieremo un link sicuro per reimpostare la tua password.',
        'keywords': 'password dimenticata, reimposta password, recupero password, login health app, recupero account'
      },
      'resetPassword': {
        'title': 'Reimposta Password - Health App',
        'description': 'Imposta la tua nuova password per il tuo account Health App. Inserisci la tua nuova password qui sotto per completare il processo di reimpostazione password.',
        'keywords': 'reimposta password, nuova password, cambio password, sicurezza health app, sicurezza account'
      }
    },
    'nl': {
      'home': {
        'title': 'Health App - Je Uitgebreide Gezondheids- en Welzijnsplatform',
        'description': 'Ontdek artikelen, tips en bronnen om je gezondheid en welzijn te verbeteren. Krijg toegang tot uitgebreide gezondheidsinhoud in meerdere talen.',
        'keywords': 'gezondheid, welzijn, fitness, voeding, artikelen, tips, bronnen, meertalig'
      },
      'signin': {
        'title': 'Inloggen - Health App',
        'description': 'Log in op je Health App-account om toegang te krijgen tot je gepersonaliseerde gezondheidsdashboard, artikelen en welzijnsbronnen.',
        'keywords': 'inloggen, login, health app, account, authenticatie, gezondheidsdashboard'
      },
      'signup': {
        'title': 'Registreren - Health App',
        'description': 'Maak je Health App-account aan om toegang te krijgen tot gepersonaliseerde gezondheidsinhoud, je welzijnsreis bij te houden en je aan te sluiten bij onze gezondheidsgemeenschap.',
        'keywords': 'registreren, account aanmaken, health app, gezondheidsgemeenschap, welzijnsvolging'
      },
      'dashboard': {
        'title': 'Dashboard - Health App',
        'description': 'Je gepersonaliseerde gezondheidsoverzicht en inzichten. Houd je gezondheidsdoelen, voortgang bij en krijg toegang tot je gezondheidsartikelen en -bronnen.',
        'keywords': 'gezondheidsdashboard, gezondheidsdoelen, voortgangsvolging, gezondheidsinzichten, persoonlijke gezondheid, welzijnsvolging'
      },
      'profile': {
        'title': 'Profiel - Health App',
        'description': 'Beheer je Health App-accountinstellingen, voorkeuren en persoonlijke informatie. Pas je gezondheidservaring en taalvoorkeuren aan.',
        'keywords': 'gebruikersprofiel, accountinstellingen, voorkeuren, persoonlijke informatie, health app-instellingen, taalvoorkeuren'
      },
      'createArticle': {
        'title': 'Artikel Maken - Health App',
        'description': 'Deel je gezondheidskennis met de gemeenschap. Maak en publiceer gezondheidsartikelen, tips en welzijnsinhoud in meerdere talen.',
        'keywords': 'artikel maken, gezondheidsinhoud schrijven, gezondheidstips publiceren, welzijnsartikelen, gezondheidskennis delen, inhoud maken'
      },
      'forgotPassword': {
        'title': 'Wachtwoord Vergeten - Health App',
        'description': 'Reset je Health App-wachtwoord. Voer je e-mailadres in en we sturen je een veilige link om je wachtwoord te resetten.',
        'keywords': 'wachtwoord vergeten, wachtwoord resetten, wachtwoordherstel, health app login, accountherstel'
      },
      'resetPassword': {
        'title': 'Wachtwoord Resetten - Health App',
        'description': 'Stel je nieuwe wachtwoord in voor je Health App-account. Voer je nieuwe wachtwoord hieronder in om het wachtwoord-resetproces te voltooien.',
        'keywords': 'wachtwoord resetten, nieuw wachtwoord, wachtwoordwijziging, health app beveiliging, accountbeveiliging'
      }
    },
    'he': {
      'home': {
        'title': 'Health App - פלטפורמת הבריאות והרווחה המקיפה שלך',
        'description': 'גלה מאמרים, טיפים ומשאבים לשיפור הבריאות והרווחה שלך. גש לתוכן בריאות מקיף במספר שפות.',
        'keywords': 'בריאות, רווחה, כושר, תזונה, מאמרים, טיפים, משאבים, רב-לשוני'
      },
      'signin': {
        'title': 'התחבר - Health App',
        'description': 'התחבר לחשבון Health App שלך כדי לגשת ללוח הבקרה האישי שלך, מאמרים ומשאבי רווחה.',
        'keywords': 'התחברות, כניסה, health app, חשבון, אימות, לוח בקרה בריאות'
      },
      'signup': {
        'title': 'הירשם - Health App',
        'description': 'צור את חשבון Health App שלך כדי לגשת לתוכן בריאות אישי, עקוב אחר מסע הרווחה שלך והצטרף לקהילת הבריאות שלנו.',
        'keywords': 'הרשמה, יצירת חשבון, health app, קהילת בריאות, מעקב רווחה'
      },
      'dashboard': {
        'title': 'לוח בקרה - Health App',
        'description': 'הסקירה האישית שלך על הבריאות ותובנות. עקוב אחר יעדי הבריאות שלך, התקדמות וגש למאמרי הבריאות והמשאבים שלך.',
        'keywords': 'לוח בקרה בריאות, יעדי בריאות, מעקב התקדמות, תובנות בריאות, בריאות אישית, מעקב רווחה'
      },
      'profile': {
        'title': 'פרופיל - Health App',
        'description': 'נהל את הגדרות החשבון Health App שלך, העדפות ומידע אישי. התאם אישית את חוויית הבריאות שלך והעדפות השפה.',
        'keywords': 'פרופיל משתמש, הגדרות חשבון, העדפות, מידע אישי, הגדרות health app, העדפות שפה'
      },
      'createArticle': {
        'title': 'צור מאמר - Health App',
        'description': 'שתף את הידע שלך על בריאות עם הקהילה. צור ופרסם מאמרי בריאות, טיפים ותוכן רווחה במספר שפות.',
        'keywords': 'יצירת מאמר, כתיבת תוכן בריאות, פרסום טיפי בריאות, מאמרי רווחה, שיתוף ידע בריאות, יצירת תוכן'
      },
      'forgotPassword': {
        'title': 'שכחתי סיסמה - Health App',
        'description': 'אפס את סיסמת Health App שלך. הכנס את כתובת האימייל שלך ונשלח לך קישור בטוח לאיפוס הסיסמה.',
        'keywords': 'שכחתי סיסמה, איפוס סיסמה, שחזור סיסמה, כניסה health app, שחזור חשבון'
      },
      'resetPassword': {
        'title': 'אפס סיסמה - Health App',
        'description': 'הגדר את הסיסמה החדשה שלך עבור חשבון Health App שלך. הכנס את הסיסמה החדשה שלך למטה כדי להשלים את תהליך איפוס הסיסמה.',
        'keywords': 'איפוס סיסמה, סיסמה חדשה, שינוי סיסמה, אבטחה health app, אבטחת חשבון'
      }
    },
    'ru': {
      'home': {
        'title': 'Health App - Ваша Комплексная Платформа Здоровья и Благополучия',
        'description': 'Откройте для себя статьи, советы и ресурсы для улучшения вашего здоровья и благополучия. Получите доступ к комплексному контенту о здоровье на нескольких языках.',
        'keywords': 'здоровье, благополучие, фитнес, питание, статьи, советы, ресурсы, многоязычный'
      },
      'signin': {
        'title': 'Войти - Health App',
        'description': 'Войдите в свой аккаунт Health App, чтобы получить доступ к персональной панели здоровья, статьям и ресурсам благополучия.',
        'keywords': 'войти, вход, health app, аккаунт, аутентификация, панель здоровья'
      },
      'signup': {
        'title': 'Зарегистрироваться - Health App',
        'description': 'Создайте свой аккаунт Health App для доступа к персональному контенту о здоровье, отслеживания вашего пути к благополучию и присоединения к нашему сообществу здоровья.',
        'keywords': 'зарегистрироваться, создать аккаунт, health app, сообщество здоровья, отслеживание благополучия'
      },
      'dashboard': {
        'title': 'Панель - Health App',
        'description': 'Ваш персональный обзор здоровья и инсайты. Отслеживайте ваши цели здоровья, прогресс и получайте доступ к вашим статьям и ресурсам о здоровье.',
        'keywords': 'панель здоровья, цели здоровья, отслеживание прогресса, инсайты здоровья, персональное здоровье, отслеживание благополучия'
      },
      'profile': {
        'title': 'Профиль - Health App',
        'description': 'Управляйте настройками вашего аккаунта Health App, предпочтениями и личной информацией. Настройте ваш опыт здоровья и языковые предпочтения.',
        'keywords': 'профиль пользователя, настройки аккаунта, предпочтения, личная информация, настройки health app, языковые предпочтения'
      },
      'createArticle': {
        'title': 'Создать Статью - Health App',
        'description': 'Поделитесь своими знаниями о здоровье с сообществом. Создавайте и публикуйте статьи о здоровье, советы и контент о благополучии на нескольких языках.',
        'keywords': 'создать статью, написать контент о здоровье, опубликовать советы о здоровье, статьи о благополучии, поделиться знаниями о здоровье, создание контента'
      },
      'forgotPassword': {
        'title': 'Забыли Пароль - Health App',
        'description': 'Сбросьте ваш пароль Health App. Введите ваш адрес электронной почты, и мы отправим вам безопасную ссылку для сброса пароля.',
        'keywords': 'забыли пароль, сбросить пароль, восстановление пароля, вход health app, восстановление аккаунта'
      },
      'resetPassword': {
        'title': 'Сбросить Пароль - Health App',
        'description': 'Установите ваш новый пароль для аккаунта Health App. Введите ваш новый пароль ниже, чтобы завершить процесс сброса пароля.',
        'keywords': 'сбросить пароль, новый пароль, изменение пароля, безопасность health app, безопасность аккаунта'
      }
    }
  };

  const properLang = languageMap[locale] || locale;
  const languageAlternates = generateLanguageAlternates(route);
  
  // Extract page name from the key (e.g., 'metadata.home.title' -> 'home')
  const pageName = titleKey.split('.')[1] || 'home';
  
  // Get translated content
  const title = translations[locale]?.[pageName]?.title || translations['en']?.[pageName]?.title || titleKey;
  const description = translations[locale]?.[pageName]?.description || translations['en']?.[pageName]?.description || descriptionKey;
  const keywords = translations[locale]?.[pageName]?.keywords || translations['en']?.[pageName]?.keywords || keywordsKey || '';
  
  return {
    title,
    description,
    keywords,
    ...baseMetadata,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `/${locale}${route}`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${route}`,
      siteName: baseMetadata.siteName,
      locale: properLang,
      type: 'website',
      images: baseMetadata.images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: baseMetadata.images.map(img => img.url),
    },
    other: {
      'language': locale,
    },
  };
}

// Legacy functions for backward compatibility (without translations)
export function generatePublicMetadataLegacy(
  locale: string,
  route: string,
  title: string,
  description: string,
  keywords: string
): Metadata {
  const properLang = languageMap[locale] || locale;
  const languageAlternates = generateLanguageAlternates(route);
  
  return {
    title,
    description,
    keywords,
    ...baseMetadata,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    robots: 'index, follow',
    alternates: {
      canonical: `/${locale}${route}`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${route}`,
      siteName: baseMetadata.siteName,
      locale: properLang,
      type: 'website',
      images: baseMetadata.images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: baseMetadata.images.map(img => img.url),
    },
    other: {
      'language': locale,
    },
  };
}

export function generatePrivateMetadataLegacy(
  locale: string,
  route: string,
  title: string,
  description: string,
  keywords: string
): Metadata {
  const properLang = languageMap[locale] || locale;
  const languageAlternates = generateLanguageAlternates(route);
  
  return {
    title,
    description,
    keywords,
    ...baseMetadata,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `/${locale}${route}`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${route}`,
      siteName: baseMetadata.siteName,
      locale: properLang,
      type: 'website',
      images: baseMetadata.images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: baseMetadata.images.map(img => img.url),
    },
    other: {
      'language': locale,
    },
  };
}
