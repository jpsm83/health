'use client';

import { usePathname } from 'next/navigation';
import { getLanguageFromPath } from '@/lib/utils/languageUtils';

// Simple translation messages
const messages = {
  en: {
    home: {
      title: 'Welcome to Health',
      subtitle: 'Your comprehensive health and wellness platform',
      description: 'Discover articles, tips, and resources to improve your health and well-being.',
      features: {
        articles: 'Health Articles',
        dashboard: 'Personal Dashboard',
        profile: 'User Profile',
        createArticle: 'Create Content'
      }
    },
    navigation: {
      home: 'Home',
      dashboard: 'Dashboard',
      profile: 'Profile',
      createArticle: 'Create Article'
    }
  },
  pt: {
    home: {
      title: 'Bem-vindo à Saúde',
      subtitle: 'Sua plataforma completa de saúde e bem-estar',
      description: 'Descubra artigos, dicas e recursos para melhorar sua saúde e bem-estar.',
      features: {
        articles: 'Artigos de Saúde',
        dashboard: 'Painel Pessoal',
        profile: 'Perfil do Usuário',
        createArticle: 'Criar Conteúdo'
      }
    },
    navigation: {
      home: 'Início',
      dashboard: 'Painel',
      profile: 'Perfil',
      createArticle: 'Criar Artigo'
    }
  },
  es: {
    home: {
      title: 'Bienvenido a Salud',
      subtitle: 'Tu plataforma integral de salud y bienestar',
      description: 'Descubre artículos, consejos y recursos para mejorar tu salud y bienestar.',
      features: {
        articles: 'Artículos de Salud',
        dashboard: 'Panel Personal',
        profile: 'Perfil de Usuario',
        createArticle: 'Crear Contenido'
      }
    },
    navigation: {
      home: 'Inicio',
      dashboard: 'Panel',
      profile: 'Perfil',
      createArticle: 'Crear Artículo'
    }
  },
  fr: {
    home: {
      title: 'Bienvenue à la Santé',
      subtitle: 'Votre plateforme complète de santé et de bien-être',
      description: 'Découvrez des articles, des conseils et des ressources pour améliorer votre santé et votre bien-être.',
      features: {
        articles: 'Articles de Santé',
        dashboard: 'Tableau de Bord Personnel',
        profile: 'Profil Utilisateur',
        createArticle: 'Créer du Contenu'
      }
    },
    navigation: {
      home: 'Accueil',
      dashboard: 'Tableau de Bord',
      profile: 'Profil',
      createArticle: 'Créer un Article'
    }
  },
  de: {
    home: {
      title: 'Willkommen bei Gesundheit',
      subtitle: 'Ihre umfassende Gesundheits- und Wellness-Plattform',
      description: 'Entdecken Sie Artikel, Tipps und Ressourcen zur Verbesserung Ihrer Gesundheit und Ihres Wohlbefindens.',
      features: {
        articles: 'Gesundheitsartikel',
        dashboard: 'Persönliches Dashboard',
        profile: 'Benutzerprofil',
        createArticle: 'Inhalt erstellen'
      }
    },
    navigation: {
      home: 'Startseite',
      dashboard: 'Dashboard',
      profile: 'Profil',
      createArticle: 'Artikel erstellen'
    }
  },
  it: {
    home: {
      title: 'Benvenuto alla Salute',
      subtitle: 'La tua piattaforma completa per la salute e il benessere',
      description: 'Scopri articoli, consigli e risorse per migliorare la tua salute e il tuo benessere.',
      features: {
        articles: 'Articoli di Salute',
        dashboard: 'Dashboard Personale',
        profile: 'Profilo Utente',
        createArticle: 'Crea Contenuto'
      }
    },
    navigation: {
      home: 'Inizio',
      dashboard: 'Dashboard',
      profile: 'Profilo',
      createArticle: 'Crea Articolo'
    }
  },
  nl: {
    home: {
      title: 'Welkom bij Gezondheid',
      subtitle: 'Jouw uitgebreide platform voor gezondheid en welzijn',
      description: 'Ontdek artikelen, tips en hulpbronnen om je gezondheid en welzijn te verbeteren.',
      features: {
        articles: 'Gezondheidsartikelen',
        dashboard: 'Persoonlijk Dashboard',
        profile: 'Gebruikersprofiel',
        createArticle: 'Inhoud Maken'
      }
    },
    navigation: {
      home: 'Home',
      dashboard: 'Dashboard',
      profile: 'Profiel',
      createArticle: 'Artikel Maken'
    }
  },
  he: {
    home: {
      title: 'ברוכים הבאים לבריאות',
      subtitle: 'פלטפורמת הבריאות והרווחה המקיפה שלכם',
      description: 'גלו מאמרים, טיפים ומשאבים לשיפור הבריאות והרווחה שלכם.',
      features: {
        articles: 'מאמרי בריאות',
        dashboard: 'לוח מחוונים אישי',
        profile: 'פרופיל משתמש',
        createArticle: 'צור תוכן'
      }
    },
    navigation: {
      home: 'בית',
      dashboard: 'לוח מחוונים',
      profile: 'פרופיל',
      createArticle: 'צור מאמר'
    }
  },
  ru: {
    home: {
      title: 'Добро пожаловать в Здоровье',
      subtitle: 'Ваша комплексная платформа здоровья и благополучия',
      description: 'Откройте для себя статьи, советы и ресурсы для улучшения вашего здоровья и благополучия.',
      features: {
        articles: 'Статьи о здоровье',
        dashboard: 'Личная панель',
        profile: 'Профиль пользователя',
        createArticle: 'Создать контент'
      }
    },
    navigation: {
      home: 'Главная',
      dashboard: 'Панель',
      profile: 'Профиль',
      createArticle: 'Создать статью'
    }
  }
};

export function useTranslation() {
  const pathname = usePathname();
  const currentLanguage = getLanguageFromPath(pathname) || 'en';
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages[currentLanguage as keyof typeof messages];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = messages.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { t, currentLanguage };
}
