import React, { useCallback, useEffect, useState } from 'react'
import { SortBySelect } from '../sort_by_select'
import Post from '#social/models/post'
import { Feed } from '#social/types/feed'
import { FeedPostCard } from './feeds_postcard'
import { router, usePage, useRemember } from '@inertiajs/react'
import usePath from '#common/ui/hooks/use_path'
import useQuery from '#common/ui/hooks/use_query'

export const PostFeed = (feed: Feed) => {
  const [posts, setPosts] = useRemember(feed.posts, 'feed/posts')
  const query = useQuery()
  const path = usePath()
  const [page, setPage] = useRemember(1, 'feed/page')

  const loadNextPagePosts = useCallback(async () => {
    const params = new URLSearchParams(query)
    const nextPage = page + 1
    params.set('page', nextPage.toString())
    const url = `${path}?${params.toString()}`

    const req = new Request(url, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
    })

    const resp = await fetch(req)
    const data = await resp.json()

    setPosts([...posts, ...data.posts])
    setPage(nextPage)
  }, [feed.posts, page, path, posts, query])

  return (
    <>
      <div className="grid sm:grid-cols-3">
        <div className="col-span-2">
          <SortBySelect />
        </div>
      </div>
      <div className="pt-4 grid sm:grid-cols-3 gap-y-4">
        {posts.map((post) => (
          <div className="col-span-2" key={post.id}>
            <FeedPostCard post={post} />
          </div>
        ))}

        {feed.pagination.page < feed.pagination.lastPage && (
          <div className="col-span-3 text-center">
            <button className="btn" onClick={() => loadNextPagePosts()}>
              Load more
            </button>
          </div>
        )}
      </div>
    </>
  )
}
