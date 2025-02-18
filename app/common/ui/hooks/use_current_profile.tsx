import User from '#common/models/user'
import usePageProps from './use_page_props.js'

export function useCurrentProfile() {
  const props = usePageProps<{
    user: User
  }>()

  return props.user.currentProfile
}
