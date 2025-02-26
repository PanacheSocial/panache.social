import usePageProps from './use_page_props'

export default function useSuccess(id: string | undefined): string | undefined {
  const props = usePageProps<{ success?: Record<string, string> }>()

  if (!props.success) {
    return undefined
  }

  if (!id) {
    return undefined
  }

  if (!props.success[id]) {
    return undefined
  }

  return props.success[id]
}
