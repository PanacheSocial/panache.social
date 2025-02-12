// components/posts/youtube_embed.tsx
import React from 'react'

interface YouTubeEmbedProps {
  url: string
  setHovered?: (value: boolean) => void
}

export const YouTubeEmbed = ({ url, setHovered }: YouTubeEmbedProps) => {
  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null

  const containerProps = setHovered
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      }
    : {}

  return (
    <div className="max-w-2xl" {...containerProps}>
      <div className="relative w-full pt-[56.25%]">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
