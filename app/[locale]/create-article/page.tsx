import { getLanguageConfig } from '@/lib/utils/languageUtils';

export default function CreateArticlePage({ 
  params 
}: { 
  params: { lang: string } 
}) {
  const langConfig = getLanguageConfig(params.lang);

  const createArticleMessages = {
    'en': {
      title: 'Create New Article',
      subtitle: 'Share your health knowledge with the community',
      form: {
        title: 'Article Title',
        content: 'Article Content',
        category: 'Category',
        tags: 'Tags',
        submit: 'Create Article',
        cancel: 'Cancel'
      }
    },
    'pt': {
      title: 'Criar Novo Artigo',
      subtitle: 'Compartilhe seu conhecimento sobre saúde com a comunidade',
      form: {
        title: 'Título do Artigo',
        content: 'Conteúdo do Artigo',
        category: 'Categoria',
        tags: 'Tags',
        submit: 'Criar Artigo',
        cancel: 'Cancelar'
      }
    },
    'es': {
      title: 'Crear Nuevo Artículo',
      subtitle: 'Comparte tu conocimiento sobre salud con la comunidad',
      form: {
        title: 'Título del Artículo',
        content: 'Contenido del Artículo',
        category: 'Categoría',
        tags: 'Etiquetas',
        submit: 'Crear Artículo',
        cancel: 'Cancelar'
      }
    },
    'fr': {
      title: 'Créer un Nouvel Article',
      subtitle: 'Partagez vos connaissances en santé avec la communauté',
      form: {
        title: 'Titre de l\'Article',
        content: 'Contenu de l\'Article',
        category: 'Catégorie',
        tags: 'Tags',
        submit: 'Créer l\'Article',
        cancel: 'Annuler'
      }
    },
    'de': {
      title: 'Neuen Artikel Erstellen',
      subtitle: 'Teilen Sie Ihr Gesundheitswissen mit der Community',
      form: {
        title: 'Artikeltitel',
        content: 'Artikelinhalt',
        category: 'Kategorie',
        tags: 'Tags',
        submit: 'Artikel Erstellen',
        cancel: 'Abbrechen'
      }
    },
    'it': {
      title: 'Crea Nuovo Articolo',
      subtitle: 'Condividi le tue conoscenze sulla salute con la comunità',
      form: {
        title: 'Titolo Articolo',
        content: 'Contenuto Articolo',
        category: 'Categoria',
        tags: 'Tag',
        submit: 'Crea Articolo',
        cancel: 'Annulla'
      }
    },
    'nl': {
      title: 'Nieuw Artikel Maken',
      subtitle: 'Deel uw gezondheidskennis met de gemeenschap',
      form: {
        title: 'Artikeltitel',
        content: 'Artikelinhoud',
        category: 'Categorie',
        tags: 'Tags',
        submit: 'Artikel Maken',
        cancel: 'Annuleren'
      }
    },
    'he': {
      title: 'צור מאמר חדש',
      subtitle: 'שתף את הידע שלך על בריאות עם הקהילה',
      form: {
        title: 'כותרת המאמר',
        content: 'תוכן המאמר',
        category: 'קטגוריה',
        tags: 'תגיות',
        submit: 'צור מאמר',
        cancel: 'ביטול'
      }
    },
    'ru': {
      title: 'Создать Новую Статью',
      subtitle: 'Поделитесь своими знаниями о здоровье с сообществом',
      form: {
        title: 'Заголовок Статьи',
        content: 'Содержание Статьи',
        category: 'Категория',
        tags: 'Теги',
        submit: 'Создать Статью',
        cancel: 'Отмена'
      }
    }
  };

  const message = createArticleMessages[params.lang as keyof typeof createArticleMessages] || createArticleMessages.en;

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

      {/* Article Creation Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              {message.form.title}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={message.form.title}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              {message.form.content}
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={message.form.content}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              {message.form.category}
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="nutrition">Nutrition</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              {message.form.tags}
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="health, fitness, tips"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {message.form.submit}
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {message.form.cancel}
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
