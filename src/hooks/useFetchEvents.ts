import { useState, useEffect, useCallback, useRef } from "react";
import {
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { fetchEvents } from "@/lib/queries/fetchEvents";
import { TNoiseRecordWithNode } from "@/schemas/node_schemas";

type FilterOptions = {
  tier?: "NORMAL" | "TIER 1" | "TIER 2" | "TIER 3";
  type?: "sustained" | "shortburst";
  minSoundLevel?: number;
  maxSoundLevel?: number;
  startDate?: Timestamp;
  endDate?: Timestamp;
};

type PaginationOptions = {
  limit: number;
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>;
};

export const useFetchEvents = (
  selectedNode: string,
  filters: FilterOptions = {},
  limit: number = 10
) => {
  const [events, setEvents] = useState<TNoiseRecordWithNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs to keep mutable values without triggering re-renders
  const lastDocsRef = useRef<(QueryDocumentSnapshot<DocumentData> | undefined)[]>([]);
  const currentPageRef = useRef(1);

  const [currentPage, setCurrentPage] = useState(1);

  const [lastDocs, setLastDocs] = useState<(QueryDocumentSnapshot<DocumentData> | undefined)[]>([]);

  const loadPage = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const startAfterDoc = page > 1 ? lastDocsRef.current[page - 2] : undefined;

        const pagination: PaginationOptions = {
          limit,
          startAfterDoc,
        };

        const result = await fetchEvents(selectedNode, filters, pagination);

        setEvents((prevEvents) => {
          if (page === 1) {
            return result.events;
          } else if (page > currentPageRef.current) {
            return [...prevEvents, ...result.events];
          } else {
            return prevEvents.slice(0, (page - 1) * limit).concat(result.events);
          }
        });

        setCurrentPage(page);
        currentPageRef.current = page;

        setLastDocs((prev) => {
          const newLastDocs = [...prev];
          newLastDocs[page - 1] = result.lastDoc;
          lastDocsRef.current = newLastDocs;
          return newLastDocs;
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    [selectedNode, filters, limit]
  );

  useEffect(() => {
    setEvents([]);
    setLastDocs([]);
    setCurrentPage(1);
    currentPageRef.current = 1;
    lastDocsRef.current = [];
    loadPage(1);
  }, [selectedNode, filters, limit, loadPage]);

  const goToPage = (page: number) => {
    if (page < 1) return;
    loadPage(page);
  };

  return { events, loading, error, currentPage, goToPage };
};
