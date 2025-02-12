import MessageGenerated from '#ai/events/message_generated'
import HandleGeneratedMessage from '#ai/listeners/handle_generated_message'
import PostCreated from '#social/events/post_created'
import emitter from '@adonisjs/core/services/emitter'

const LoadExtraPostFields = () => import('#social/listeners/load_extra_post_fields')

emitter.on(PostCreated, [LoadExtraPostFields])
emitter.on(MessageGenerated, [HandleGeneratedMessage])
