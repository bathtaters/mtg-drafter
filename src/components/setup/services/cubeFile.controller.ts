import type { CubeFile, UploadType } from "types/setup"
import { useState, useCallback } from "react"
import { upload } from "components/base/libs/fetch"
import { fileSettings } from "assets/constants"
import { cubeListURL } from "assets/urls"
import { maxSizeError } from "assets/strings"


export default function useCubeFile() {
  const [ file, _setFile ] = useState<CubeFile | null>(null)
  const [ loading, setLoading ] = useState(false)


  const setFile = useCallback((file: File | null) => {
    if (!file) return _setFile(null)
    if (file.size > fileSettings.maxSize) return _setFile({ name: file.name, error: maxSizeError(file.size, fileSettings.maxSize) })

    setLoading(true)
    
    return upload<UploadType>(cubeListURL, file, fileSettings.id).then((data) => {
      
      if (typeof data !== 'object') data = { error: `Return Code: ${data}` }
      
      if ('error' in data) _setFile({ name: file.name, error: data.error })
      else _setFile({ name: file.name, data })

      setLoading(false)
    })
  }, [_setFile, setLoading])


  return { file, setFile, loading }
}

export type SetFile = ReturnType<typeof useCubeFile>['setFile']
