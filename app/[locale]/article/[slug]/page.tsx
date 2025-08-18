import { getLanguageConfig } from '@/lib/utils/languageUtils';
import Link from 'next/link';

export default function ArticlePage({ 
  params 
}: { 
  params: { lang: string; slug: string } 
}) {
  const langConfig = getLanguageConfig(params.lang);

  const articleMessages = {
    'en': {
      title: 'Sample Health Article',
      subtitle: 'This is a sample article about health and wellness',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Edit Article',
        delete: 'Delete Article',
        backToList: 'Back to Articles'
      }
    },
    'pt': {
      title: 'Artigo de Saúde de Exemplo',
      subtitle: 'Este é um artigo de exemplo sobre saúde e bem-estar',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Editar Artigo',
        delete: 'Excluir Artigo',
        backToList: 'Voltar aos Artigos'
      }
    },
    'es': {
      title: 'Artículo de Salud de Ejemplo',
      subtitle: 'Este es un artículo de ejemplo sobre salud y bienestar',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Editar Artículo',
        delete: 'Eliminar Artículo',
        backToList: 'Volver a los Artículos'
      }
    },
    'fr': {
      title: 'Article de Santé d\'Exemple',
      subtitle: 'Ceci est un article d\'exemple sur la santé et le bien-être',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Modifier l\'Article',
        delete: 'Supprimer l\'Article',
        backToList: 'Retour aux Articles'
      }
    },
    'de': {
      title: 'Beispiel-Gesundheitsartikel',
      subtitle: 'Dies ist ein Beispielartikel über Gesundheit und Wohlbefinden',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Artikel Bearbeiten',
        delete: 'Artikel Löschen',
        backToList: 'Zurück zu den Artikeln'
      }
    },
    'it': {
      title: 'Articolo di Salute di Esempio',
      subtitle: 'Questo è un articolo di esempio sulla salute e il benessere',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Modifica Articolo',
        delete: 'Elimina Articolo',
        backToList: 'Torna agli Articoli'
      }
    },
    'nl': {
      title: 'Voorbeeld Gezondheidsartikel',
      subtitle: 'Dit is een voorbeeldartikel over gezondheid en welzijn',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Artikel Bewerken',
        delete: 'Artikel Verwijderen',
        backToList: 'Terug naar Artikelen'
      }
    },
    'he': {
      title: 'מאמר בריאות לדוגמה',
      subtitle: 'זהו מאמר לדוגמה על בריאות ורווחה',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'ערוך מאמר',
        delete: 'מחק מאמר',
        backToList: 'חזור למאמרים'
      }
    },
    'ru': {
      title: 'Пример Статьи о Здоровье',
      subtitle: 'Это пример статьи о здоровье и благополучии',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      actions: {
        edit: 'Редактировать Статью',
        delete: 'Удалить Статью',
        backToList: 'Вернуться к Статьям'
      }
    }
  };

  const message = articleMessages[params.lang as keyof typeof articleMessages] || articleMessages.en;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back to Articles Link */}
      <div className="mb-6">
        <Link 
          href={`/${params.lang}`}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← {message.actions.backToList}
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {message.title}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {message.subtitle}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>📅 Published: {new Date().toLocaleDateString()}</span>
          <span>👤 Author: John Doe</span>
          <span>🏷️ Category: Health</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {message.content}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>
      </div>

      {/* Article Actions */}
      <div className="flex space-x-4 mb-8">
        <Link
          href={`/${params.lang}/article/${params.slug}/update`}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {message.actions.edit}
        </Link>
        <button
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {message.actions.delete}
        </button>
      </div>

      {/* Article Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Language: {langConfig.language.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Locale: {langConfig.locale}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Slug: <span className="font-mono">{params.slug}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
