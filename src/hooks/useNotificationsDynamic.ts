// hooks/useNoiseNotificationsDynamic.ts
import { useEffect, useRef } from 'react';
import {
  collection,
  query,
  onSnapshot,
  serverTimestamp,
  orderBy,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getTierLevel } from '@/lib/helpers';
import { format } from 'date-fns';

type EventData = {
  timestamp: any;
  soundLevel: number;
  [key: string]: any;
};

const createNotification = async (
  eventId: string,
  eventData: EventData,
  nodeId: string
): Promise<void> => {
  const notificationId = `${nodeId}_${eventId}`;
  const notificationRef = doc(db, 'notifications', notificationId);

  try {
    // Check if notification already exists (extra safety)
    const existingNotification = await getDoc(notificationRef);
    if (existingNotification.exists()) {
      console.log(`Notification ${notificationId} already exists, skipping`);
      return;
    }
     // 🔍 Fetch the node to get its name (sitename)
    const nodeRef = doc(db, 'history', nodeId);
    const nodeSnap = await getDoc(nodeRef);

    let sitename = nodeId;
    if (nodeSnap.exists()) {
      const nodeData = nodeSnap.data();
      sitename = nodeData.name || sitename;
    }
    let readableTime = 'Unknown Time';

    // Handle Firestore Timestamp or JS Date
    if (eventData.timestamp instanceof Timestamp) {
    readableTime = format(eventData.timestamp.toDate(), 'p'); // e.g. 2:30 PM
    } else if (eventData.timestamp instanceof Date) {
    readableTime = format(eventData.timestamp, 'p');
    } else if (typeof eventData.timestamp === 'number') {
    readableTime = format(new Date(eventData.timestamp), 'p');
    }


    const tier = getTierLevel(eventData.soundLevel);

    // 🔊 Play sound based on tier (not Normal)
    if (tier !== 'Normal') {
      const soundMap: { [key: string]: string } = {
        'Tier 1': '/sounds/ding.mp3',
        'Tier 2': '/sounds/buzz.mp3',
        'Tier 3': '/sounds/siren.mp3',
      };

      const soundPath = soundMap[tier];
      if (soundPath) {
        const audio = new Audio(soundPath);
        audio.play().catch(err => console.warn("Sound playback failed:", err));
      }
    }


    // Create the notification document
    await setDoc(notificationRef, {
      nodeId,
      eventId,
      soundLevel: eventData.soundLevel,
      timestamp: serverTimestamp(),
      originalTimestamp: eventData.timestamp,
      title:`Noise alert from ${nodeId}`,
      message:`Noise level reached ${getTierLevel(eventData.soundLevel)} at ${sitename} around ${readableTime}`,
      isRead:false
    });

    console.log(`Notification created: ${notificationId} (Sound: ${eventData.soundLevel}dB)`);
  } catch (error) {
    console.error(`Error creating notification ${notificationId}:`, error);
  }
};

const useNoiseNotificationsDynamic = (): null => {
  const startTimeRef = useRef<Timestamp | null>(null);

  useEffect(() => {
    let unsubscribes: Unsubscribe[] = [];

    const setupListeners = async () => {
      try {
        // Set start time to current moment - only process events after this
        startTimeRef.current = Timestamp.now();
        console.log('Start time set:', startTimeRef.current.toDate());

        // Get all available nodes
        const historyRef = collection(db, 'history');
        const historySnapshot = await getDocs(historyRef);
        const nodeIds = historySnapshot.docs.map((doc) => doc.id);

        console.log('Setting up listeners for nodes:', nodeIds);

        // Set up listener for each node
        nodeIds.forEach((nodeId) => {
          const eventsRef = collection(db, `history/${nodeId}/events`);

          // Only listen to events created AFTER we start listening
          const eventsQuery = query(
            eventsRef,
            where('timestamp', '>', startTimeRef.current!),
            orderBy('timestamp', 'desc')
          );

          const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            console.log(`Node ${nodeId}: ${snapshot.docChanges().length} new events`);

            snapshot.docChanges().forEach(async (change) => {
              if (change.type === 'added') {
                const eventId = change.doc.id;
                const eventData = change.doc.data() as EventData;

                console.log(`New event ${eventId} from node ${nodeId}: ${eventData.soundLevel}dB`);

                // Only create notification for high sound levels
                if (eventData.soundLevel >= 71) {
                  await createNotification(eventId, eventData, nodeId);
                } else {
                  console.log(`Sound level ${eventData.soundLevel}dB below threshold, no notification created`);
                }
              }
            });
          }, (error) => {
            console.error(`Error in listener for node ${nodeId}:`, error);
          });

          unsubscribes.push(unsubscribe);
        });

        console.log(`Notification listeners initialized for ${nodeIds.length} nodes`);
      } catch (error) {
        console.error('Error setting up notification listeners:', error);
      }
    };

    setupListeners();

    return () => {
      console.log('Cleaning up notification listeners');
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []); // Empty dependency array - only run once

  return null;
};

export default useNoiseNotificationsDynamic;
