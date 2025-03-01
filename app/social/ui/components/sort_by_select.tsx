import * as React from 'react'
import { router } from '@inertiajs/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import useTranslate from '#common/ui/hooks/use_translate'
import { ArrowDownWideNarrowIcon, ClockIcon } from 'lucide-react'
import useQuery from '#common/ui/hooks/use_query'
import usePath from '#common/ui/hooks/use_path'

export function SortBySelect() {
  const t = useTranslate('social')
  const query = useQuery()
  const path = usePath()
  const [method, setMethod] = React.useState(query.method || 'popular')
  const [period, setPeriod] = React.useState(query.period || 'day')

  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    setLoaded(true)
  }, [])

  React.useEffect(() => {
    if (!loaded) return
    
    const params = new URLSearchParams(query)

    if (method === 'new') {
      params.set('method', 'new')
      params.delete('period')
    } else {
      params.set('method', method)
      params.set('period', period)
    }

    router.get(path, Object.fromEntries(params), {
      preserveState: false,
      preserveScroll: true,
    })
  }, [method, period])

  return (
    <div className="flex items-center space-x-4 border-b pb-4">
      <p className="text-sm">{t('sort_by')}:</p>

      <Select value={method} onValueChange={(value) => setMethod(value)}>
        <SelectTrigger className="w-auto">
          <div className="flex items-center space-x-2 pr-2">
            <ArrowDownWideNarrowIcon className="h-4 w-4" />
            <SelectValue placeholder="Select a fruit" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('sort_by')}</SelectLabel>
            <SelectItem value="popular">{t('popular')}</SelectItem>
            <SelectItem value="new">{t('new')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {method === 'popular' && (
        <Select value={period} onValueChange={(value) => setPeriod(value)}>
          <SelectTrigger className="w-auto">
            <div className="flex items-center space-x-2 pr-2">
              <ClockIcon className="h-4 w-4" />
              <SelectValue placeholder="Select a fruit" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('sort_by')}</SelectLabel>
              <SelectItem value="day">{t('day')}</SelectItem>
              <SelectItem value="week">{t('week')}</SelectItem>
              <SelectItem value="month">{t('month')}</SelectItem>
              <SelectItem value="year">{t('year')}</SelectItem>
              <SelectItem value="all">{t('all')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
