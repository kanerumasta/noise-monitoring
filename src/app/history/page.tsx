"use client";
import { useState, useEffect, useMemo } from "react";
import { format, subDays } from "date-fns";
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/lib/queries/fetchEvents';
import { TNode } from '@/schemas/node_schemas';
import HistoryTable from './components/HistoryTable';
import NodeSelector from './components/NodeSelector';
import SortOptions from './components/SortOptions';
import Paginator from './components/Paginator';
import NoiseTypeFilter from './components/NoiseTypeFilter';
import TierFilter from './components/TierFilter';
import { CalendarIcon } from "@heroicons/react/24/outline";
import DateSelection from "./components/DateSelectionFilter";

export default function HistoryPage() {
  const [selectedNode, setSelectedNode] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTodaySelected, setIsTodaySelected] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sortField, setSortField] = useState<"timestamp" | "soundLevel" | "duration" | "nodes">("nodes");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedNoiseType, setSelectedNoiseType] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", selectedNode],
    queryFn: () => fetchEvents(selectedNode),
  });

  const filteredData = useMemo(() => {
    if (!events) return [];

    let filtered = [...events];

    if (isTodaySelected) {
      filtered = filtered.filter(
        (event) => format(event.timestamp.seconds * 1000, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
      );
    } else if(selectedDate) {
      filtered = filtered.filter(
        (event) => format(event.timestamp.seconds * 1000, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
    }

    filtered = filtered.filter(item => selectedTiers.length === 0 || selectedTiers.includes(item.tier));

    if (selectedNoiseType) {
      filtered = filtered.filter((e) => e.type === selectedNoiseType);
    }

    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      if (sortField === "timestamp") {
        aVal = a.timestamp.seconds;
        bVal = b.timestamp.seconds;
      } else if (sortField === "nodes") {
        aVal = a.node ? a.node.name : '';
        bVal = b.node ? b.node.name : '';
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return filtered;
  }, [events, selectedTiers, selectedNoiseType, sortField, sortOrder, isTodaySelected, selectedDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedNode, selectedDate, sortField, sortOrder, selectedTiers, selectedNoiseType]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#103A5E]">Alert History</h2>
            </div>
          </div>

          {/* Date Selection and Sorting */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Date Selection */}
              <DateSelection
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                isTodaySelected={isTodaySelected}
                setIsTodaySelected={setIsTodaySelected}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
              />
              {/* Filters */}
              <div className="flex gap-2">
                <NodeSelector selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
                <SortOptions sortField={sortField} setSortField={setSortField} sortOrder={sortOrder} setSortOrder={setSortOrder} />
                <TierFilter selectedTiers={selectedTiers} setSelectedTiers={setSelectedTiers} />
                <NoiseTypeFilter selectedNoiseType={selectedNoiseType} setSelectedNoiseType={setSelectedNoiseType} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {paginatedData && <HistoryTable data={paginatedData} isLoading={isLoading} />}
          </div>

          {/* Paginator */}
          <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} dataCount={filteredData.length} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
        </div>
      </div>
    </div>
  );
}
