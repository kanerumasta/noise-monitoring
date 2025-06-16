// lib/queries/fetchEvents.ts
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // your Firebase setup
import {
  TNode,
  TNoiseRecord,
  TNoiseRecordWithNode,
} from "@/schemas/node_schemas";

export const fetchEvents = async (
  selectedNode: string
): Promise<TNoiseRecordWithNode[]> => {
  const events: TNoiseRecordWithNode[] = [];

  if (selectedNode === "all") {
    const nodesSnap = await getDocs(collection(db, "record"));
    for (const nodeDoc of nodesSnap.docs) {
      const nodeId = nodeDoc.id;
      const nodeData = nodeDoc.data() as TNode;

      const eventsSnap = await getDocs(
        collection(db, `record/${nodeId}/events`)
      );
      events.push(
        ...eventsSnap.docs.map((eventDoc) => ({
          ...(eventDoc.data() as TNoiseRecord),
          node: { ...nodeData, id: nodeId },
        }))
      );
    }
  } else {
    const nodeRef = doc(db, "record", selectedNode);
    const nodeSnap = await getDoc(nodeRef);
    if (!nodeSnap.exists()) throw new Error("Node not found");
    const nodeData = nodeSnap.data() as TNode;

    const eventsSnap = await getDocs(
      collection(db, `record/${selectedNode}/events`)
    );
    events.push(
      ...eventsSnap.docs.map((eventDoc) => ({
        ...(eventDoc.data() as TNoiseRecord),
        node: { ...nodeData, id: selectedNode },
      }))
    );
  }

  return events;
};
