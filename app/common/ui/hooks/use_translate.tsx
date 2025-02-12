import usePageProps from './use_page_props'

export function useLocale() {
  const { locale } = usePageProps<{ locale: string }>()
  return locale
}

export default function useTranslate(scope?: string) {
  const { translations } = usePageProps<{
    translations: Record<string, string>
  }>()

  return (key: string, params?: Record<string, string>) => {
    if (scope) {
      key = scope + '.' + key
    }
    let value = translations[key] || key
    if (params) {
      for (const key in params) {
        value = value.replaceAll(`{${key}}`, params[key])
      }
    }
    return value
  }
}
