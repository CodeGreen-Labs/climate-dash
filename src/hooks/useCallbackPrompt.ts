import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { unstable_Blocker } from 'react-router-dom'

import useBlocker from './useBlocker'

interface Props {
  when: boolean
}

const useCallbackPrompt = ({ when }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPrompt, setShowPrompt] = useState(false)
  const [lastLocation, setLastLocation] = useState<any>(null)
  const [confirmedNavigation, setConfirmedNavigation] = useState(false)

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false)
    setLastLocation(null)
  }, [])
  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation = useCallback(
    (nextLocation: unstable_Blocker) => {
      // in if condition we are checking next location and current location are equals or not
      if (
        !confirmedNavigation &&
        nextLocation?.location?.pathname !== location.pathname
      ) {
        setShowPrompt(true)
        setLastLocation(nextLocation)
        return false
      }
      return true
    },
    [confirmedNavigation, location]
  )

  const processNavigation = useCallback(() => {
    setShowPrompt(false)
    setConfirmedNavigation(true)
  }, [])

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location?.pathname)
    }
  }, [confirmedNavigation, lastLocation])

  useBlocker({ when, handleBlockedNavigation })

  return { showPrompt, processNavigation, cancelNavigation }
}
export default useCallbackPrompt
