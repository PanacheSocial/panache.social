import Post from '#social/models/post'

type Pagination = {
  page: number
  lastPage: number
  total: number
  perPage: number
}

export type Feed = {
  posts: Post[]
  pagination: Pagination
}
