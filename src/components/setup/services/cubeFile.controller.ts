import type { CubeFile, UploadType } from "types/setup"
import { useState, useCallback } from "react"
import { upload, cubeListURL, fileID } from "./setup.utils"


export default function useCubeFile() {
  const [ file, _setFile ] = useState<CubeFile | null>(null)
  const [ loading, setLoading ] = useState(false)


  const setFile = useCallback((file: File | null) => {
    if (!file) return _setFile(null)

    setLoading(true)
    
    return upload<UploadType>(cubeListURL, file, fileID).then((data) => {
      
      if (typeof data !== 'object') data = { error: `Return Code: ${data}` }
      
      if ('error' in data) _setFile({ name: file.name, error: data.error })
      else _setFile({ name: file.name, data })

      setLoading(false)
    })
  }, [_setFile, setLoading])


  return { file, setFile, loading }
}


