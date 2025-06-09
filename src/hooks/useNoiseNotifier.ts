// hooks/useNoiseNotifier.ts
import { useEffect, useRef } from 'react'
import { onValue, ref } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import toast from 'react-hot-toast'

const TIER_THRESHOLDS = {
  normal: 0,
  elevated: 71,
  high: 86,
  critical: 101,
}

const getTier = (soundLevel: number): string => {
  if (soundLevel >= TIER_THRESHOLDS.critical) return 'critical'
  if (soundLevel >= TIER_THRESHOLDS.high) return 'high'
  if (soundLevel >= TIER_THRESHOLDS.elevated) return 'elevated'
  return 'normal'
}

export const useNoiseNotifier = () => {
  const lastNotified = useRef<Record<string, number>>({}) // prevent spamming

  const playSound = (tier: string) => {
    let sound: HTMLAudioElement | null = null

    if (tier === 'elevated') {
      sound = new Audio('/sounds/ding.mp3')
    } else if (tier === 'high') {
      sound = new Audio('/sounds/buzz.mp3')
    } else if (tier === 'critical') {
      sound = new Audio('/sounds/siren.mp3')
    }

    if (sound) {
      sound.volume = 1.0
      sound.play().catch((err) => {
        console.warn('Sound play failed:', err)
      })
    }
  }

  useEffect(() => {
    const nodeRef = ref(rtdb, 'nodes') // adjust if your path is different

    const unsubscribe = onValue(nodeRef, (snapshot) => {
      const data = snapshot.val()
      const now = Date.now()

      if (data) {
        Object.entries(data).forEach(([key, node]: any) => {
          const tier = getTier(node.soundLevel)

          if (tier !== 'normal') {
            const lastTime = lastNotified.current[key] || 0
            if (now - lastTime > 10000) { // 10 sec cooldown per node
              lastNotified.current[key] = now

              toast.error(`⚠️ ${node.name} - ${tier.toUpperCase()} noise`)
              playSound(tier)
            }
          }
        })
      }
    })

    return () => unsubscribe()
  }, [])
}
