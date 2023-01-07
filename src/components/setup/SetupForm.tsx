import type { SetupProps } from "types/setup"
import Spinner from "components/base/common/Spinner"
import Overlay from "components/base/common/Overlay"
import CubeForm from "./subcomponents/CubeForm"
import BoosterForm from "./subcomponents/BoosterForm"
import { FormWrapper, FormTitle, TypeTabs, SubmitButton, ErrorText } from "./styles/SetupStyles"
import useSetupController from "./services/setup.controller"

type Props = SetupProps

export default function SetupForm({ setList }: Props) {
  const setup = useSetupController()
  const { options, submitForm, gameLoading, error, setName, setType } = setup

  return (
    <FormWrapper onSubmit={submitForm}>
      <FormTitle placeholder="Enter Title" value={options.name} setValue={setName} />
      
      <TypeTabs selected={options.type} setSelected={setType} />
      { options.type === "Cube" ? <CubeForm {...setup} /> : <BoosterForm {...setup} setList={setList} /> }
      
      <ErrorText>{error}</ErrorText>
      <SubmitButton disabled={!submitForm}>Start Draft ▶</SubmitButton>

      <Overlay hide={!gameLoading}><Spinner /></Overlay>
    </FormWrapper>
  )
}