import PostCreated from '#social/events/post_created'
import emitter from '@adonisjs/core/services/emitter'

const LoadExtraPostFields = () => import('#social/listeners/load_extra_post_fields')

emitter.on(PostCreated, [LoadExtraPostFields])
