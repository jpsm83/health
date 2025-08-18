import { getLanguageConfig } from '@/lib/utils/languageUtils';

export default function ProfilePage({ 
  params 
}: { 
  params: { lang: string } 
}) {
  const langConfig = getLanguageConfig(params.lang);

  const profileMessages = {
    'en': {
      title: 'User Profile',
      subtitle: 'Manage your account settings and preferences',
      sections: {
        personal: 'Personal Information',
        preferences: 'Preferences',
        security: 'Security'
      },
      fields: {
        name: 'Full Name',
        email: 'Email Address',
        language: 'Preferred Language',
        timezone: 'Timezone',
        notifications: 'Notifications'
      },
      buttons: {
        save: 'Save Changes',
        cancel: 'Cancel'
      }
    },
    'pt': {
      title: 'Perfil do Usuário',
      subtitle: 'Gerencie suas configurações de conta e preferências',
      sections: {
        personal: 'Informações Pessoais',
        preferences: 'Preferências',
        security: 'Segurança'
      },
      fields: {
        name: 'Nome Completo',
        email: 'Endereço de Email',
        language: 'Idioma Preferido',
        timezone: 'Fuso Horário',
        notifications: 'Notificações'
      },
      buttons: {
        save: 'Salvar Alterações',
        cancel: 'Cancelar'
      }
    },
    'es': {
      title: 'Perfil de Usuario',
      subtitle: 'Gestiona la configuración de tu cuenta y preferencias',
      sections: {
        personal: 'Información Personal',
        preferences: 'Preferencias',
        security: 'Seguridad'
      },
      fields: {
        name: 'Nombre Completo',
        email: 'Dirección de Email',
        language: 'Idioma Preferido',
        timezone: 'Zona Horaria',
        notifications: 'Notificaciones'
      },
      buttons: {
        save: 'Guardar Cambios',
        cancel: 'Cancelar'
      }
    },
    'fr': {
      title: 'Profil Utilisateur',
      subtitle: 'Gérez vos paramètres de compte et préférences',
      sections: {
        personal: 'Informations Personnelles',
        preferences: 'Préférences',
        security: 'Sécurité'
      },
      fields: {
        name: 'Nom Complet',
        email: 'Adresse Email',
        language: 'Langue Préférée',
        timezone: 'Fuseau Horaire',
        notifications: 'Notifications'
      },
      buttons: {
        save: 'Enregistrer',
        cancel: 'Annuler'
      }
    },
    'de': {
      title: 'Benutzerprofil',
      subtitle: 'Verwalten Sie Ihre Kontoeinstellungen und Präferenzen',
      sections: {
        personal: 'Persönliche Informationen',
        preferences: 'Präferenzen',
        security: 'Sicherheit'
      },
      fields: {
        name: 'Vollständiger Name',
        email: 'E-Mail-Adresse',
        language: 'Bevorzugte Sprache',
        timezone: 'Zeitzone',
        notifications: 'Benachrichtigungen'
      },
      buttons: {
        save: 'Änderungen Speichern',
        cancel: 'Abbrechen'
      }
    },
    'it': {
      title: 'Profilo Utente',
      subtitle: 'Gestisci le impostazioni del tuo account e le preferenze',
      sections: {
        personal: 'Informazioni Personali',
        preferences: 'Preferenze',
        security: 'Sicurezza'
      },
      fields: {
        name: 'Nome Completo',
        email: 'Indirizzo Email',
        language: 'Lingua Preferita',
        timezone: 'Fuso Orario',
        notifications: 'Notifiche'
      },
      buttons: {
        save: 'Salva Modifiche',
        cancel: 'Annulla'
      }
    },
    'nl': {
      title: 'Gebruikersprofiel',
      subtitle: 'Beheer uw accountinstellingen en voorkeuren',
      sections: {
        personal: 'Persoonlijke Informatie',
        preferences: 'Voorkeuren',
        security: 'Beveiliging'
      },
      fields: {
        name: 'Volledige Naam',
        email: 'E-mailadres',
        language: 'Voorkeurstaal',
        timezone: 'Tijdzone',
        notifications: 'Meldingen'
      },
      buttons: {
        save: 'Wijzigingen Opslaan',
        cancel: 'Annuleren'
      }
    },
    'he': {
      title: 'פרופיל משתמש',
      subtitle: 'נהל את הגדרות החשבון והעדפות שלך',
      sections: {
        personal: 'מידע אישי',
        preferences: 'העדפות',
        security: 'אבטחה'
      },
      fields: {
        name: 'שם מלא',
        email: 'כתובת אימייל',
        language: 'שפה מועדפת',
        timezone: 'אזור זמן',
        notifications: 'התראות'
      },
      buttons: {
        save: 'שמור שינויים',
        cancel: 'ביטול'
      }
    },
    'ru': {
      title: 'Профиль Пользователя',
      subtitle: 'Управляйте настройками аккаунта и предпочтениями',
      sections: {
        personal: 'Личная Информация',
        preferences: 'Предпочтения',
        security: 'Безопасность'
      },
      fields: {
        name: 'Полное Имя',
        email: 'Адрес Email',
        language: 'Предпочитаемый Язык',
        timezone: 'Часовой Пояс',
        notifications: 'Уведомления'
      },
      buttons: {
        save: 'Сохранить Изменения',
        cancel: 'Отмена'
      }
    }
  };

  const message = profileMessages[params.lang as keyof typeof profileMessages] || profileMessages.en;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {message.title}
        </h1>
        <p className="text-xl text-gray-600">
          {message.subtitle}
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {message.sections.personal}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {message.fields.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {message.fields.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {message.sections.preferences}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  {message.fields.language}
                </label>
                <select
                  id="language"
                  name="language"
                  defaultValue={params.lang}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="nl">Nederlands</option>
                  <option value="he">עברית</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                  {message.fields.timezone}
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  defaultValue="UTC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">Greenwich Mean Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {message.sections.security}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="notifications" className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {message.fields.notifications}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {message.buttons.save}
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {message.buttons.cancel}
            </button>
          </div>
        </form>
      </div>

      {/* Language Info */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Language: {langConfig.language.toUpperCase()} | Locale: {langConfig.locale}
        </p>
      </div>
    </div>
  );
}
