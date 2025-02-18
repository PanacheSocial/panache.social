import React from 'react'
import SocialLayout from '../components/social_layout'
import { Tabs, TabsList, TabLink } from '#common/ui/components/tabs'
import useTranslate from '#common/ui/hooks/use_translate'
import { Label } from '#common/ui/components/label'
import { Input } from '#common/ui/components/input'
import { Button } from '#common/ui/components/button'
import { Textarea } from '#common/ui/components/textarea'
import usePageProps from '#common/ui/hooks/use_page_props'
import Room from '#social/models/room'
import { Head, InertiaFormProps, router, useForm } from '@inertiajs/react'
import RoomSelect from '../components/rooms/room_select'
import { Error } from '#common/ui/components/error'
import { useToast } from '#common/ui/hooks/use_toast'
import { CheckIcon } from 'lucide-react'
import { MemeEditor } from '../components/posts/meme_editor'
import useQuery from '#common/ui/hooks/use_query'
import useParams from '#common/ui/hooks/use_params'
import { otherFonts, recommendedFonts } from '../constants'
import { MemeEditorProvider, useMemeEditorContext } from '../contexts/meme_editor_context'

export default function Create() {
  const t = useTranslate('social')
  const params = useParams()
  const type = params.type || 'text'

  const fonts = [...recommendedFonts, ...otherFonts]

  return (
    <>
      {/* Load fonts for memes creation */}
      {type === 'meme' ? (
        <Head>
          {fonts.map((font) => (
            <link
              key={font}
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;700&display=swap`}
            />
          ))}
        </Head>
      ) : null}
      <MemeEditorProvider>
        <SocialLayout>
          <h1 className="text-2xl font-semibold">{t('create_a_post')}</h1>
          <CreatePostForm />
        </SocialLayout>
      </MemeEditorProvider>
    </>
  )
}

function CreatePostForm() {
  const t = useTranslate('social')
  const { toast } = useToast()
  const query = useQuery()

  /**
   * Compute rooms.
   */
  const props = usePageProps<{ popularRooms: Room[]; joinedRooms?: Room[] }>()
  const rooms =
    props?.joinedRooms && props?.joinedRooms.length > 0 ? props.joinedRooms : props.popularRooms

  /**
   * Retrieve canvas from context.
   */
  const { canvas } = useMemeEditorContext()

  const urlQuerySuffix = query.room ? `?room=${query.room}` : ''
  const defaultRoomSlug = query.room ? query.room : 'current-profile'
  const [roomSlug, setRoomSlug] = React.useState(defaultRoomSlug)

  const form = useForm({
    title: '',
    text: '',
    link: '',
    image: null as File | null,
  })
  const params = useParams()
  const type = params.type || 'text'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const onSuccess = () => {
      toast({
        description: (
          <div className="flex items-center space-x-2">
            <CheckIcon className="text-emerald-700 h-4 w-4" />
            <span>{t('post_created')}</span>
          </div>
        ),
      })
    }

    if (type === 'meme' && canvas) {
      const dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8,
        multiplier: 3,
      })
      const file = dataURLToFile(dataURL, 'file.png')
      router.post(`/rooms/${roomSlug}/posts`, { ...form.data, image: file }, { onSuccess })
      return
    }

    form.post(`/rooms/${roomSlug}/posts`, { onSuccess })
  }

  // Helper function to convert a data URL to a File
  const dataURLToFile = (dataURL: string, filename: string): File => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  return (
    <form className="flex flex-col space-y-8 pt-4" onSubmit={handleSubmit}>
      <Tabs defaultValue="text" className="min-w-full flex flex-col space-y-8">
        <TabsList className="flex flex-wrap sm:grid w-full h-full sm:grid-cols-4 gap-y-2 sm:gap-y-0 gap-x-4">
          <TabLink href={`/create${urlQuerySuffix}`} isActive={type === 'text'} label={t('text')} />
          <TabLink
            href={`/create/image${urlQuerySuffix}`}
            isActive={type === 'image'}
            label={t('image')}
          />
          <TabLink
            href={`/create/link${urlQuerySuffix}`}
            isActive={type === 'link'}
            label={t('link')}
          />
          <div className="hidden sm:block w-full">
            <TabLink
              href={`/create/meme${urlQuerySuffix}`}
              isActive={type === 'meme'}
              label={t('meme')}
            />
          </div>
        </TabsList>

        {type === 'text' && (
          <div className="w-full flex flex-col space-y-6">
            <RoomSelect roomSlug={roomSlug} setRoomSlug={setRoomSlug} rooms={rooms} />
            <TitleField
              value={form.data.title}
              onChange={(value) => form.setData('title', value)}
            />

            <div>
              <Label htmlFor="text">{t('text')}</Label>
              <Textarea
                className="mt-1"
                id="text"
                name="text"
                rows={5}
                placeholder={t('text_placeholder')}
                value={form.data.text}
                onChange={(e) => form.setData('text', e.target.value)}
                minLength={10}
                maxLength={10000}
              />
              <Error errorKey="text" />
            </div>
            <hr />
            <CreateActions form={form} />
          </div>
        )}

        {type === 'image' && (
          <div className="w-full flex flex-col space-y-6">
            <RoomSelect roomSlug={roomSlug} setRoomSlug={setRoomSlug} rooms={rooms} />
            <TitleField
              value={form.data.title}
              onChange={(value) => form.setData('title', value)}
            />

            <div>
              <Label htmlFor="image">{t('image')}</Label>
              <Input
                id="image"
                name="image"
                accept="image/*"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    form.setData('image', e.target.files[0])
                  }
                }}
              />
              <Error errorKey="image" />
            </div>

            <hr />
            <CreateActions form={form} />
          </div>
        )}

        {type === 'link' && (
          <div className="w-full flex flex-col space-y-6">
            <RoomSelect roomSlug={roomSlug} setRoomSlug={setRoomSlug} rooms={rooms} />
            <TitleField
              value={form.data.title}
              onChange={(value) => form.setData('title', value)}
            />

            <div>
              <Label htmlFor="link">{t('link')}</Label>

              <Input
                id="link"
                name="link"
                type="url"
                placeholder={t('link_placeholder')}
                value={form.data.link}
                onChange={(e) => form.setData('link', e.target.value)}
              />
              <Error errorKey="link" />
            </div>

            <hr />
            <CreateActions form={form} />
          </div>
        )}

        {type === 'meme' && (
          <>
            <div className="w-full grid lg:grid-cols-4 gap-x-8 gap-y-8 lg:gap-y-0">
              <div className="col-span-2">
                <MemeEditor />
              </div>
              <div className="w-full flex flex-col space-y-6 col-span-2 lg:pt-16">
                <RoomSelect roomSlug={roomSlug} setRoomSlug={setRoomSlug} rooms={rooms} />
                <TitleField
                  value={form.data.title}
                  onChange={(value) => form.setData('title', value)}
                />
                <hr />
                <CreateActions form={form} />
              </div>
            </div>
          </>
        )}
      </Tabs>
    </form>
  )
}

function TitleField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const t = useTranslate('social')
  return (
    <div className="grid gap-2">
      <Label htmlFor="title">{t('title')}</Label>
      <Input
        autoComplete="off"
        id="title"
        name="title"
        type="text"
        placeholder={t('type_title_here')}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <Error errorKey="title" />
    </div>
  )
}

function CreateActions({
  form,
}: {
  form: InertiaFormProps<{ title: string; text: string; link: string; image: File | null }>
}) {
  const t = useTranslate('social')
  return (
    <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <Button type="submit">{t('submit_post')}</Button>

      <Button variant="secondary" type="reset">
        {t('cancel')}
      </Button>

      {/* @ts-ignore */}
      {import.meta.env.VITE_USER_NODE_ENV === 'development' && (
        <Button
          type="button"
          variant="warning"
          onClick={() => {
            form.setData({
              title: 'Entrez le titre ici',
              text: 'Computer Programming',
              link: '',
              image: null,
            })
          }}
        >
          Fill Development Values
        </Button>
      )}
    </div>
  )
}
