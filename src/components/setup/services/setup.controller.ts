import type { DraftType, GameOptions } from "types/setup"
import { useState, useCallback, FormEventHandler } from "react"
import useCreateGame from "./createGame.controller"
import useCubeFile from "./cubeFile.controller"
import { setupDefaults } from "assets/constants"


export default function useSetupController() {
  const [ options,   setOptions ] = useState(setupDefaults as GameOptions)
  const { file, setFile, loading: fileLoading } = useCubeFile()

  const setType     = useCallback((type: DraftType)        => setOptions((curr) => ({ ...curr, type          })), [setOptions])
  const setName     = useCallback((name: string)           => setOptions((curr) => ({ ...curr, name          })), [setOptions])
  const setPlayers  = useCallback((players: string)        => setOptions((curr) => ({ ...curr, players       })), [setOptions])
  const setTimer    = useCallback((timer: string)          => setOptions((curr) => ({ ...curr, timer         })), [setOptions])
  const setPacks    = useCallback((packs: string)          => setOptions((curr) => ({ ...curr, packs         })), [setOptions])
  const setPackSize = useCallback((packSize: string)       => setOptions((curr) => ({ ...curr, packSize      })), [setOptions])
  const setPackList = useCallback((packList: string[])     => setOptions((curr) => ({ ...curr, packList      })), [setOptions])
  const setBasics   = useCallback((includeBasics: boolean) => setOptions((curr) => ({ ...curr, includeBasics })), [setOptions])

  const { createGame, loading: gameLoading, error } = useCreateGame()

  const disableSubmit = !options.name || (options.type === 'Cube' ? !file : !options.packList.length)
  const submitForm: FormEventHandler|undefined = disableSubmit ? undefined : (ev) => {
    ev.preventDefault(); return createGame(options, file)
  }

  return {
    options, file, fileLoading, submitForm, gameLoading, error,
    setType, setName, setPlayers, setTimer, setPacks, setPackSize, setPackList, setBasics, setFile,
  }
}