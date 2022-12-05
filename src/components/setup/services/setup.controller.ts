import { useState, useCallback, FormEventHandler } from "react"
import useCreateGame from "./createGame.controller"
import useCubeFile from "./cubeFile.controller"
import { setupDefaults } from "assets/constants"


export default function useSetupController() {
  const [ options, setOptions ] = useState(setupDefaults)
  const { file, setFile, loading: fileLoading } = useCubeFile()

  const setName     = useCallback((value: string) => setOptions((curr) => ({ ...curr, name: value     })), [setOptions])
  const setPlayers  = useCallback((value: string) => setOptions((curr) => ({ ...curr, players: value  })), [setOptions])
  const setPacks    = useCallback((value: string) => setOptions((curr) => ({ ...curr, packs: value    })), [setOptions])
  const setPackSize = useCallback((value: string) => setOptions((curr) => ({ ...curr, packSize: value })), [setOptions])

  const { createGame, loading: gameLoading, error } = useCreateGame()
  const submitForm: FormEventHandler = (ev) => { ev.preventDefault(); return createGame(options, file) }

  return {
    options, file, fileLoading,
    submitForm, gameLoading, error,
    setName, setPlayers, setPacks, setPackSize, setFile,
  }
}