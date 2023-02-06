import type { GameOptions, CubeFile } from "types/setup"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"
import { post } from 'components/base/libs/fetch'
import { adaptOptions } from "./setup.utils"
import { gameURL, newGameURL } from 'assets/urls'


export default function useCreateGame() {
  const router = useRouter()
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error,   setError   ] = useState<string | null>(null)

  const createGame = useCallback((options: GameOptions, file: CubeFile | null) => {
    if (options.type === 'Cube' && !file) return setError('Must select a cube file')
    if (options.type === 'Booster' && !options.packList.length) return setError('Must select at least one pack')
    if (file?.error) return setError(`Error with cube file: ${file.error}`)
    
    setError(null)
    setLoading(true)

    return post(newGameURL(options.type), adaptOptions(options, file)).then(async (data) => {
      if (!data?.url) return setError('Error creating game!')
      return router.push(gameURL(data.url)).catch((err) => setError(err?.message || err))
    })
      .catch((err) => setError(err?.message || err))
      .finally(() =>  setLoading(false))

  }, [router, setLoading, setError])


  return { createGame, loading, error }
}