import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import AppNavigator from './src/navigation/AppNavigator'
import Toast from './src/components/Toast'
import type { ShowToast, ShowToastOptions } from './src/types/toast'
import { AuthProvider } from './src/context/AuthContext'

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins'

export default function App(): ReactElement {

  // Load brand fonts before rendering the app to avoid layout shift
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  })

  // App-level toast state (centralized display)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'info' | 'danger'>('info')
  const [toastDuration, setToastDuration] = useState(1200)
  const afterToastRef = useRef<(() => void) | null>(null)

  // Exposed toast function passed via props to screens
  const showToast: ShowToast = useCallback((options: ShowToastOptions) => {
    const { message, type = 'info', duration = 1600, afterToast } = options
    setToastMessage(message)
    setToastType(type)
    setToastDuration(duration)
    afterToastRef.current = afterToast ?? null
    setToastVisible(true)
  }, []);

  // Render nothing until fonts are ready
  if (!fontsLoaded) {
    return <></>
  }

  // App root: navigation container and status bar
  return (
    <AuthProvider>
      {/* Navigation tree receives a showToast prop; screens call it to display app-level toast */}
      <AppNavigator showToast={showToast} />
      <StatusBar style="auto" />
      {/* Single Toast instance rendered at the app root */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        duration={toastDuration}
        type={toastType}
        onClose={() => {
          setToastVisible(false)
          if (afterToastRef.current) {
            const cb = afterToastRef.current
            afterToastRef.current = null
            cb()
          }
        }}
      />
    </AuthProvider>
  )
}
