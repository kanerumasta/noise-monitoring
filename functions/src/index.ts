import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

const db = admin.firestore();

const getTierLevel = (soundLevel: number) => {
  return soundLevel >= 101
    ? "Tier 3"
    : soundLevel >= 86
    ? "Tier 2"
    : soundLevel >= 71
    ? "Tier 1"
    : "Normal";
};

export const notifyOnLoudEvent = onDocumentCreated(
  "history/{nodeId}/events/{eventId}",
  async (event) => {
    const eventData = event.data as { soundlevel?: number } | undefined;
    const { nodeId, eventId } = event.params;

    if (!eventData) {
      logger.warn("No event data found");
      return;
    }

    if (typeof eventData.soundlevel !== "number") {
      logger.warn("soundlevel is missing or invalid in event data");
      return;
    }

    const soundLevel = eventData.soundlevel;
    const tier = getTierLevel(soundLevel);

    const nodeDocRef = db.collection("history").doc(nodeId);
    const nodeSnap = await nodeDocRef.get();

    if (!nodeSnap.exists) {
      logger.warn("Node not found:", nodeId);
      return;
    }

    const nodeData = nodeSnap.data();
    const sitename = nodeData?.name || "Unknown Site";

    if (tier !== "Normal") {
      const notification = {
        nodeId,
        eventId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        title: `Noise Alert from ${nodeId}`,
        message: `Noise Level reached ${tier} at ${sitename} around {time}`,
      };

      await db.collection("notifications").add(notification);
      logger.info("Notification created:", notification);
    }
  }
);
