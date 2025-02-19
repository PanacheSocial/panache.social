import { Head } from '@inertiajs/react'
import React from 'react'
import he from 'he'

export const PageMeta = ({
  title,
  meta,
  children,
}: {
  title: string
  meta?: Record<string, string | undefined>
  children?: React.ReactNode
}) => {
  title = he.escape(`Panache Social${title ? ` - ${title}` : ''}`)

  return (
    <>
      <Head>
        <title>{title}</title>
        {title ? <meta name="title" content={title} /> : null}
        {meta &&
          Object.entries(meta).map((metaItem) => {
            if (!metaItem || !metaItem[1]) return
            const [name, content] = metaItem
            return (
              <meta
                key={name}
                name={he.escape(name.slice(0, 100))}
                content={he.escape(content.slice(0, 100))}
              />
            )
          })}
      </Head>
      {children}
    </>
  )
}
