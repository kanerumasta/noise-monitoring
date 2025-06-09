// lib/queries/fetchNotifications.ts
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";

export function listenToNotifications(nodeId: string, callback: (notifications: any[]) => void) {
  const q = query(
    collection(db, "notifications", nodeId, "items"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(notifs);
  });

  return unsubscribe; // Call this to stop listening
}
