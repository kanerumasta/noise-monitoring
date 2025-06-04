import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/lib/queries/fetchEvents';
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { TNoiseRecordWithNode } from '@/schemas/node_schemas';

type FilterOptions = {
  tier?: "NORMAL" | "TIER 1" | "TIER 2" | "TIER 3";
  type?: "sustained" | "shortburst";
  minSoundLevel?: number;
  maxSoundLevel?: number;
  startDate?: any;  // use Timestamp if you want
  endDate?: any;
};

export function useEventsInfinite(
  selectedNode: string,
  filters: FilterOptions = {},
  limit = 10
) {
  return useInfiniteQuery<
    { events: TNoiseRecordWithNode[]; lastDoc?: QueryDocumentSnapshot<DocumentData> },
    Error
  >(
    ['events', selectedNode, filters],
    ({ pageParam }: { pageParam?: QueryDocumentSnapshot<DocumentData> }) =>
      fetchEvents(selectedNode, filters, { limit, startAfterDoc: pageParam }),

  );
}
