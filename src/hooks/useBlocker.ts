import { useEffect } from 'react'
import { unstable_Blocker, useBlocker as _useBlocker } from 'react-router-dom'

interface Props {
  when: boolean
  handleBlockedNavigation: (blocker: unstable_Blocker) => boolean
}

const useBlocker = ({ when, handleBlockedNavigation }: Props) => {
  const blocker = _useBlocker(when)

  useEffect(() => {
    if (blocker.state === 'blocked' && !when) {
      blocker.reset()
    }
  }, [blocker, when])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const proceed = handleBlockedNavigation(blocker)
      if (proceed) {
        setTimeout(blocker.proceed, 0)
      } else {
        blocker.reset()
      }
    }
  }, [blocker])
}
export default useBlocker
