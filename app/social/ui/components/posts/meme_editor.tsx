'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '#common/ui/components/button'
import { Icons } from '../profiles/icons'
import { type Accept } from 'react-dropzone-esm'
import { Popover, PopoverContent, PopoverTrigger } from '#common/ui/components/popover'
import { HexColorPicker } from 'react-colorful'
import { useWindow } from '#social/ui/hooks/use_window'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#common/ui/components/command'
import { otherFonts, recommendedFonts } from '#social/ui/constants'
import { CheckIcon, LayoutTemplateIcon } from 'lucide-react'
import { cn } from '#common/ui/lib/utils'
import useTranslate from '#common/ui/hooks/use_translate'
import { Dialog, DialogContent, DialogTrigger } from '#common/ui/components/dialog'
import { Input } from '#common/ui/components/input'
import { useMemeEditorContext } from '#social/ui/contexts/meme_editor_context'

type Meme = {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count: number
}

export function MemeEditor() {
  const {
    activeObject,
    canvasRef,
    setBackgroundImage,
    addText,
    addImage,
    changeFontFamily,
    changeTextColor,
    flipImage,
    deleteSelectedObject,
    changeBackgroundColor,
    currentBackgroundColor,
    selectedTextProperties,
    isImageSelected,
    toggleDrawingMode,
    incrementBrushSize,
    setBrushColor,
    drawingSettings,
  } = useMemeEditorContext()
  const t = useTranslate()

  const { isMobile } = useWindow()

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [openMemesDialog, setOpenMemesDialog] = React.useState(false)
  const [memes, setMemes] = useState<Meme[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/memes/metadata.json')
      .then((response) => response.json())
      .then((data) => {
        setMemes(data)
      })
      .catch((error) => console.error('Error fetching memes:', error))
  }, [])

  const filteredMemes = memes.filter((meme) =>
    meme.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topToolbar = (
    <div className="flex items-center flex-wrap md:justify-center">
      <Dialog open={openMemesDialog} onOpenChange={setOpenMemesDialog}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="tooltip shrink-0">
            <span>{t('social.template')}</span>
            <LayoutTemplateIcon className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('social.select_meme_template')}</h2>
            <Input
              type="text"
              placeholder={t('social.search_memes')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMemes.map((meme) => (
                <div
                  key={meme.id}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setBackgroundImage(meme.url)
                      .then(() => {
                        setOpenMemesDialog(false)
                      })
                      .catch((error) => {
                        console.error('Error setting background image:', error)
                      })
                  }}
                >
                  <img
                    src={meme.url || '/placeholder.svg'}
                    alt={meme.name}
                    width={meme.width}
                    height={meme.height}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm text-center">{meme.name}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="tooltip shrink-0">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: currentBackgroundColor }}
            ></span>
            <span>{t('social.background_color')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mt-3 w-fit p-0 bg-transparent rounded-lg" align="start">
          <HexColorPicker
            className="border-none"
            color={currentBackgroundColor}
            onChange={changeBackgroundColor}
          />
        </PopoverContent>
      </Popover>
    </div>
  )

  const drawingActions = (
    <>
      <Button
        type="button"
        onClick={incrementBrushSize}
        variant="outline"
        size="icon"
        className="tooltip shrink-0"
      >
        <span>{t('social.brush_size')}</span>
        {drawingSettings.brushSize}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="tooltip shrink-0">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: drawingSettings.brushColor }}
            ></span>
            <span>{t('social.brush_color')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mt-3 w-fit p-0 bg-transparent rounded-lg" align="start">
          <HexColorPicker
            className="border-none"
            color={drawingSettings.brushColor}
            onChange={setBrushColor}
          />
        </PopoverContent>
      </Popover>
    </>
  )

  const imageActions = (
    <Button
      type="button"
      onClick={() => flipImage('horizontal')}
      variant="outline"
      size="icon"
      className="tooltip shrink-0"
    >
      <span>{t('social.flip')}</span>
      <Icons.flip className="size-4" />
    </Button>
  )

  const textActions = (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="tooltip shrink-0">
            <span>{t('social.font')}</span>
            <Icons.font className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-[200px] w-full p-0 h-[250px] rounded-lg">
          <Command>
            <CommandInput placeholder={t('social.search_font')} />
            <CommandList className="hide_scrollbar">
              <CommandEmpty>{t('social.no_font_found')}</CommandEmpty>
              <CommandGroup heading={t('social.recommended')}>
                {recommendedFonts.map((fontName) => (
                  <CommandItem
                    key={fontName}
                    value={fontName}
                    className={cn('cursor-pointer')}
                    onSelect={(currentValue) => changeFontFamily(currentValue)}
                  >
                    <span style={{ fontFamily: `'${fontName}', sans-serif` }}>{fontName}</span>
                    <CheckIcon
                      className={cn(
                        'ml-auto size-4',
                        fontName === selectedTextProperties.fontFamily ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading={t('social.others')}>
                {otherFonts.map((fontName) => (
                  <CommandItem
                    key={fontName}
                    value={fontName}
                    className={cn('cursor-pointer')}
                    onSelect={(currentValue) => changeFontFamily(currentValue)}
                  >
                    <span style={{ fontFamily: `'${fontName}', sans-serif` }}>{fontName}</span>
                    <CheckIcon
                      className={cn(
                        'ml-auto size-4',
                        fontName === selectedTextProperties.fontFamily ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="tooltip shrink-0">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: selectedTextProperties.fontColor }}
            ></span>
            <span>{t('social.text_color')}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mt-3 w-fit p-0 bg-transparent rounded-lg" align="start">
          <HexColorPicker
            className="border-none"
            color={selectedTextProperties.fontColor}
            onChange={changeTextColor}
          />
        </PopoverContent>
      </Popover>
    </>
  )

  const bottomToolbar = (
    <div className="flex items-center flex-wrap md:justify-center">
      {selectedTextProperties.isTextSelected && textActions}

      {!activeObject && (
        <Button
          type="button"
          onClick={toggleDrawingMode}
          variant="outline"
          size="icon"
          className="tooltip shrink-0"
        >
          <span>{t(drawingSettings.isDrawing ? 'social.stop' : 'social.draw')}</span>
          <Icons.draw className="size-4" />
        </Button>
      )}

      {drawingSettings.isDrawing && drawingActions}

      {!activeObject && !drawingSettings.isDrawing && (
        <>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="icon"
            className="tooltip shrink-0"
          >
            <span>{t('social.add_image')}</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                addImage(file)
              }
            }}
          />
        </>
      )}

      {isImageSelected && imageActions}

      {!activeObject && !drawingSettings.isDrawing && (
        <Button
          type="button"
          onClick={addText}
          variant="outline"
          size="icon"
          className="tooltip shrink-0"
        >
          <span>{t('social.add_text')}</span>
          <Icons.text className="size-4" />
        </Button>
      )}

      {activeObject && (
        <Button
          type="button"
          onClick={deleteSelectedObject}
          variant="outline"
          size="icon"
          className="tooltip shrink-0"
        >
          <span>{t('common.delete')}</span>
          <Icons.trash className="size-4 text-red-600" />
        </Button>
      )}

      {isMobile && (
        <div className="h-5 invisible">
          <div className="h-full w-px bg-[#e5e5e5]"></div>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-full h-full flex flex-col justify-between">
      {topToolbar}

      {/* Canvas Container */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] relative mx-auto">
          <canvas
            ref={canvasRef}
            className="border rounded-3xl overflow-hidden w-full h-full"
            id="meme-canvas"
          />
        </div>
      </div>

      {bottomToolbar}
    </div>
  )
}
