import CropIcon from '@material-design-icons/svg/outlined/crop_free.svg'
import VoiceIcon from '@material-design-icons/svg/outlined/keyboard_voice.svg'
import CameraIcon from '@material-design-icons/svg/outlined/photo_camera.svg'
import { render } from 'react-dom'

import { Button } from '@ui/button/button'

import { createTemplatePlugin } from '@/lib/autocomplete/plugins/createTemplatePlugin'

type AutocompleteIconsProps = {
  voice?: boolean
  camera?: boolean
}

function AutocompleteIcons({
  voice = true,
  camera = true,
}: AutocompleteIconsProps) {
  return (
    <div className="h-full flex gap-1 items-center absolute right-0">
      {voice && (
        <Button className="h-full" title="Voice search">
          <VoiceIcon className="text-2xl fill-current" />
        </Button>
      )}

      {camera && (
        <>
          <span className="w-px h-6 bg-neutral-light"></span>
          <Button
            className="flex h-full items-center justify-center text-2xl pr-3"
            title="Camera search"
          >
            <CropIcon className="fill-current" />
            <CameraIcon className="text-[0.5em] absolute fill-current" />
          </Button>
        </>
      )}
    </div>
  )
}

export function voiceCameraIconsPluginCreator() {
  return createTemplatePlugin({
    container: '.aa-InputWrapperSuffix',
    render(root) {
      render(<AutocompleteIcons />, root)
    },
  })
}
