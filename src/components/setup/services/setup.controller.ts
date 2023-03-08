import type { FormEventHandler } from "react"
import useCreateGame from "./createGame.controller"
import useCubeFile from "./cubeFile.controller"
import { useSimpleReducer } from "components/base/libs/hooks"
import { spliceInPlace } from "components/base/services/common.services"
import { setupDefaults, setupLimits } from "assets/constants"

export default function useSetupController() {
  const [ options, setOption ] = useSimpleReducer(setupDefaults)
  const { file, setFile, loading: fileLoading } = useCubeFile()

  const { createGame, loading: gameLoading, error } = useCreateGame()

  const disableSubmit = !options.name || (options.type === 'Cube' ? !file : !options.packList.length)
  const submitForm: FormEventHandler|undefined = disableSubmit ? undefined : (ev) => {
    ev.preventDefault(); return createGame(options, file)
  }

  const setPack = (idx: number) => (code: string) => setOption.packList(spliceInPlace(options.packList,idx,1,code))

  const addPack = options.packList.length < setupLimits.packs.max && (
    () => setOption.packList(options.packList.concat(options.packList[options.packList.length - 1]))
  )
  const rmvPack = options.packList.length > setupLimits.packs.min && (
    () => setOption.packList(options.packList.slice(0,options.packList.length - 1))
  )

  return {
    submitForm,
    gameLoading, error,
    options, setOption, setPack, addPack, rmvPack,
    file, fileLoading, setFile,
  }
}