'use client'

import { useEffect, useState } from 'react'
import {
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useNotifications } from '@/hooks/useNotifications'

import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@headlessui/react'

type Notification = {
  id: string
  title: string
  message: string
  timestamp: Timestamp
  isRead: boolean
  eventId: string
  nodeId: string
}

export default function NotificationsPage() {
  const notifications = useNotifications()

  const newNotifications = notifications
    .filter((n) => !n.isRead)
    .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())

  const oldNotifications = notifications
    .filter((n) => n.isRead)
    .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())

  const formatDate = (ts: Timestamp) => {
    const date = ts.toDate()
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const markAllAsRead = async () => {
    const batch = newNotifications.map(async (notif) => {
      const ref = doc(
        db,
        `notifications/${notif.id}`
      )
      await updateDoc(ref, { isRead: true })
    })

    await Promise.all(batch)
  }

  const renderNotifications = (items: Notification[]) =>
    items.length === 0 ? (
      <div className="text-gray-500 text-sm">No notifications here 🎉</div>
    ) : (
      <ul className="space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            className={`p-4 rounded-lg border shadow-sm bg-white hover:shadow-md transition-all`}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-gray-800">{n.title}</h3>
              <span className="text-xs text-gray-400">{formatDate(n.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-600">{n.message}</p>
          </li>
        ))}
      </ul>
    )

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BellIcon className="w-7 h-7 text-indigo-600" />
          Your Notifications
        </h1>
        {newNotifications.length > 0 && (
          <Button onClick={markAllAsRead}>
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">
          New Notifications ({newNotifications.length})
        </h2>
        {renderNotifications(newNotifications)}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Earlier Notifications ({oldNotifications.length})
        </h2>
        {renderNotifications(oldNotifications)}
      </section>
    </main>
  )
}
