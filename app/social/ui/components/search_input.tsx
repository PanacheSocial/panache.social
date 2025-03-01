'use client'

import { useState, FormEvent } from 'react'
import { Search, X } from 'lucide-react'
import React from 'react'
import { Input } from '#common/ui/components/input'
import { Button } from '#common/ui/components/button'
import useTranslate from '#common/ui/hooks/use_translate'
import useQuery from '#common/ui/hooks/use_query'
import usePath from '#common/ui/hooks/use_path'
import { router } from '@inertiajs/react'

interface SearchInputProps {
  className?: string
}

const explorePaths = ['/rooms', '/posts', '/comments']

export function SearchInput({ className = '' }: SearchInputProps) {
  const path = usePath()
  const isExplore = explorePaths.includes(path)
  const t = useTranslate()
  const query = useQuery()
  const [searchTerm, setSearchTerm] = useState(query.search || '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const params = searchTerm ? { search: searchTerm } : {}

    router.get(isExplore ? path : '/rooms', params, {
      preserveState: false,
      preserveScroll: true,
    })
  }

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <form className={`relative ${className}`} onSubmit={handleSubmit}>
      <button type="submit" hidden></button>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={t('common.search') + '...'}
        id="search"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
}
