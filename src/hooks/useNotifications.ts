// src/hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import {
  collectionGroup,
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Notification = {
    id:string,
  eventId: string;
  isRead: boolean;
  message: string;
  nodeId: string;
  originalTimestamp: Timestamp;
  soundLevel: number;
  timestamp: Timestamp;
  title: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const q = query(
      collectionGroup(db, 'notifications'),

    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Notification[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            })) as Notification[];

    setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  console.log('RUn')
  console.log(notifications)
  return notifications;
}
