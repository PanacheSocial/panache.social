import User from '#common/models/user'
import Post from '#social/models/post'
import { Feed } from '#social/types/feed'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export class FeedService {
  newPostQuery(user?: User) {
    const query = Post.query()

    if (user) {
      query.preload('likes', (query) => {
        query.where('profile_id', user.currentProfileId!)
      })
    }

    query.preload('profile', (query) => {
      query.select('username', 'avatar')
    })

    query.preload('room')

    return query
  }

  private applyFilters(
    query: ModelQueryBuilderContract<typeof Post, Post>,
    period: string,
    sortMethod: string
  ) {
    // Filter posts by the selected period
    let startDate: DateTime | null = null

    switch (period) {
      case 'day':
        startDate = DateTime.now().minus({ days: 1 })
        break
      case 'week':
        startDate = DateTime.now().minus({ weeks: 1 })
        break
      case 'month':
        startDate = DateTime.now().minus({ months: 1 })
        break
      case 'all':
        startDate = null
        break
    }

    if (startDate) {
      query.where('created_at', '>=', startDate.toString())
    }

    // Sort posts based on the selected method
    switch (sortMethod) {
      case 'popular':
        query.orderBy('likes_count', 'desc')
        break
      case 'new':
        query.orderBy('created_at', 'desc')
        break
    }

    return query
  }

  async popular(sortMethod: string, period: string, page: number, user?: User): Promise<Feed> {
    const query = this.newPostQuery(user)

    this.applyFilters(query, period, sortMethod)

    const posts = await query.paginate(page, 20)

    return {
      posts: posts.all(),
      pagination: {
        page: posts.currentPage,
        lastPage: posts.lastPage,
        total: posts.total,
        perPage: posts.perPage,
      },
    }
  }

  async userFeed(sortMethod: string, period: string, page: number, user?: User): Promise<Feed> {
    if (!user) {
      return this.popular(sortMethod, period, page)
    }

    const postsQuery = this.newPostQuery(user)

    await user.loadOnce('currentProfile')

    postsQuery.whereHas('room', (query) => {
      query.whereHas('members', (query) => {
        query.where('profile_id', user.currentProfileId!)
      })
    })

    this.applyFilters(postsQuery, period, sortMethod)

    const posts = await postsQuery.paginate(page, 20)

    return {
      posts: posts.all(),
      pagination: {
        page: posts.currentPage,
        lastPage: posts.lastPage,
        total: posts.total,
        perPage: posts.perPage,
      },
    }
  }
}
