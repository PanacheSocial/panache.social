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
import { ArrowDownWideNarrowIcon } from 'lucide-react'
import useQuery from '#common/ui/hooks/use_query'
import usePath from '#common/ui/hooks/use_path'

export function SortCommentSelect() {
  const t = useTranslate('social')
  const query = useQuery()
  const path = usePath()
  const [method, setMethod] = React.useState(query.method || 'popular')

  React.useEffect(() => {
    const params = new URLSearchParams(query)
    params.set('method', method)

    router.get(path, Object.fromEntries(params), {
      preserveState: false,
      preserveScroll: true,
    })
  }, [method])

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
    </div>
  )
}
