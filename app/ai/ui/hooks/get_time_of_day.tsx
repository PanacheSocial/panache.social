import useTranslate from '#common/ui/hooks/use_translate'
import useUser from '#common/ui/hooks/use_user'

export function useGetTimeOfDay() {
  const t = useTranslate()
  const currentHour = new Date().getHours()
  const user = useUser()

  return () => {
    if (currentHour >= 5 && currentHour < 12) {
      return t('ai.good_morning', { firstName: user.firstName })
    } else if (currentHour >= 12 && currentHour < 17) {
      return t('ai.good_afternoon', { firstName: user.firstName })
    }
    return t('ai.good_evening', { firstName: user.firstName })
  }
}
