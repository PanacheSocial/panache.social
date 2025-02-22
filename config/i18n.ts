import app from '@adonisjs/core/services/app'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'
import fs from 'node:fs/promises'
import path from 'node:path'

const i18nConfig = defineConfig({
  defaultLocale: 'en',
  supportedLocales: ['en', 'de', 'fr'],

  formatter: formatters.icu(),

  loaders: [
    loaders.fs({
      location: app.languageFilesPath(),
    }),
    translationsLoader(),
  ],
})

export default i18nConfig

/**
 * Loader implementation
 */
export class TranslationsLoader {
  /**
   * Load translations from each app/<module>/lang directory
   * which contains a JSON file with translations, for example en.json or fr.json
   * @returns Translations
   */
  async load(): Promise<Record<string, Record<string, string>>> {
    const appDir = 'app' // Assuming the app directory is at the root
    const translations: Record<string, Record<string, string>> = {}

    try {
      const modules = await fs.readdir(appDir)

      for (const module of modules) {
        const langDir = path.join(appDir, module, 'lang')

        try {
          const langFiles = await fs.readdir(langDir)

          for (const file of langFiles) {
            if (file.endsWith('.json')) {
              const locale = path.basename(file, '.json')
              const content = await fs.readFile(path.join(langDir, file), 'utf-8')
              const moduleTranslations = JSON.parse(content)

              if (!translations[locale]) {
                translations[locale] = {}
              }

              // Prefix keys with module name to avoid conflicts
              Object.keys(moduleTranslations).forEach((key) => {
                translations[locale][`${module}.${key}`] = moduleTranslations[key]
              })
            }
          }
        } catch (error) {
          // If lang directory doesn't exist for a module, just skip it
          if (error.code !== 'ENOENT') {
            console.error(`Error reading lang directory for module ${module}:`, error)
          }
        }
      }
    } catch (error) {
      console.error('Error reading app directory:', error)
    }

    return translations
  }
}

export function translationsLoader() {
  return () => {
    return new TranslationsLoader()
  }
}
