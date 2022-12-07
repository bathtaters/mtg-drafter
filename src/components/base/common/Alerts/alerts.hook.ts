import type { GenericAlert, ErrorAlert, ToastAlert } from "./alerts.d"
import { nanoid } from "nanoid"
import { useCallback, useState } from "react"
import { ErrorModal, ToastDisplay } from "./Alerts"
import { toastDefaults } from "./alert.constants"

const withId = <T extends { id?: string }>(obj: T) => ({ id: nanoid(), ...obj })


export default function useAlerts(initialAlert: { error?: ErrorAlert[], toast?: ToastAlert[] } = {}) {

  const [ errorList, updateErrors ] = useGenericAlert(initialAlert.error)
  const [ toastList, updateToasts ] = useGenericAlert(initialAlert.toast, (alert) => {
    alert = withId(alert)
    const delay = alert.hideDelay ?? toastDefaults.hideDelay
    delay >= 0 && setTimeout(() => updateToasts.pop(alert.id), delay * 1000)
    return alert
  })

  return {
    ErrorComponent: () => errorList[0] && ErrorModal({ alert: errorList[0], closeModal: updateErrors.pop }),
    ToastComponent: () => ToastDisplay({ list: toastList, closeAlert: updateToasts.pop }),

    newError: updateErrors.push,
    newToast: updateToasts.push,

    clearError: updateErrors.pop,
    clearToast: updateToasts.pop,
  }
}
export type AlertsReturn = ReturnType<typeof useAlerts>


function useGenericAlert<Alert extends GenericAlert>(initialAlert: Alert[] = [], adapter: (alert: Alert) => Alert = withId) {
  
  const [ list, updateList ] = useState<Alert[]>(initialAlert.map(adapter))


  const push = useCallback((alert: Alert) => {
    const apdapted = adapter(alert)
    updateList((list) => list.concat(apdapted))
    return apdapted.id
  }, [])


  const pop = useCallback((withId?: string) => {

    updateList((list) => {
      const idx = withId ? list.findIndex(({ id }) => withId === id) : 0
      return idx >= 0 ? list.slice(0, idx).concat(list.slice(idx + 1)) : list
    })

  }, [])

  return [ list, { push, pop } ] as const
}
