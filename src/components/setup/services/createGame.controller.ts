import type { GameOptions, CubeFile } from "types/setup"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"
import { post, adaptOptions, newGameURL, gameURL } from "./setup.utils"


export default function useCreateGame() {
  const router = useRouter()
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error,   setError   ] = useState<string | null>(null)


  const createGame = useCallback((options: GameOptions, file: CubeFile | null) => {
    if (!file) return setError('Must select a cube file')
    if (file.error) return setError(`Error with cube file: ${file.error}`)
    
    setError(null)
    setLoading(true)

    return post(newGameURL, adaptOptions(options, file)).then(async (data) => {
      if (!data?.url) return setError('Error creating game!')
      return router.push(gameURL(data.url)).catch((err) => setError(err?.message || err))

    }).catch((err) => setError(err?.message || err))
      .finally(() =>  setLoading(false))

  }, [setLoading, setError])


  return { createGame, loading, error }
}