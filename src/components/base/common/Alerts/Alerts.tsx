import type { ErrorAlert, ToastAlert } from "./alerts.d"
import { ErrorModalWrapper, ToastContainer, ToastStyle } from "./AlertStyles"
import { errorDefaults, toastDefaults } from "./alert.constants"


export function ErrorModal({ alert, closeModal }: { alert: ErrorAlert, closeModal: (id?: string) => void }) {
  const fullAlert = { ...errorDefaults, ...alert }

  return (
    <ErrorModalWrapper alert={fullAlert as Required<ErrorAlert>} closeModal={() => closeModal(fullAlert.id)}>
      <p>{fullAlert.message}</p>
    </ErrorModalWrapper>
  )
}


export function ToastDisplay({ list, closeAlert }: { list: ToastAlert[], closeAlert: (id?: string) => void }) {
  return (
    <ToastContainer>
      { list.map((alert) => <ToastMessage key={alert.id} alert={alert} closeAlert={closeAlert} />) }
    </ToastContainer>
  )
}

function ToastMessage({ alert, closeAlert }: { alert: ToastAlert, closeAlert: (id?: string) => void }) {
  const { id, message, theme, disableClick, hideDelay } = { ...toastDefaults, ...alert }

  return (
    <ToastStyle theme={theme} onClick={disableClick ? undefined : () => closeAlert(id)}>
      {message}
    </ToastStyle>
  )
}