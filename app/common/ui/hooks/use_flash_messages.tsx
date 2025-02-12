import usePageProps from './use_page_props'

export function useFlashMessages() {
  const { flashMessages } = usePageProps<{ flashMessages: Record<string, string> }>()

  return flashMessages
}
