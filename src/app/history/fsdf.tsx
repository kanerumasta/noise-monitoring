 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#103A5E]">
                Alert History
              </h2>
              <div className="flex space-x-3">
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Node Tabs */}
          <div className="px-6 pt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 overflow-x-auto">
              {nodeTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`
                    whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg
                    ${
                      selectedTab === tab.id
                        ? "border-[#103A5E] text-[#103A5E] bg-white"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Date Selection and Sorting */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Date Selection */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                    format(selectedDate, "yyyy-MM-dd") ===
                    format(new Date(), "yyyy-MM-dd")
                      ? "bg-[#103A5E] text-white border-[#103A5E]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <CalendarIcon className="h-5 w-5" />
                  Custom Date
                </button>
                {showDatePicker && (
                  <div className="absolute mt-12 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <input
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      min={format(subDays(new Date(), 6), "yyyy-MM-dd")}
                      max={format(new Date(), "yyyy-MM-dd")}
                      onChange={(e) => {
                        setSelectedDate(new Date(e.target.value));
                        setShowDatePicker(false);
                      }}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Sorting Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort("timeRecorded")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 ${
                    sortField === "timeRecorded"
                      ? "bg-[#103A5E] text-white border-[#103A5E]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ClockIcon className="h-5 w-5" />
                  Time{" "}
                  {sortField === "timeRecorded" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("noiseAlertLevel")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 ${
                    sortField === "noiseAlertLevel"
                      ? "bg-[#103A5E] text-white border-[#103A5E]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ChartBarIcon className="h-5 w-5" />
                  Tier Level{" "}
                  {sortField === "noiseAlertLevel" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#103A5E]">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Node Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Coordinates
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Average Noise (dB)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Time Recorded
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Noise Alert Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Noise Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((record: NoiseRecord, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.coordinates.lat.toFixed(6)},{" "}
                      {record.coordinates.lng.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.noiseDb} dB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.timeRecorded}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getNoiseLevelStyle(record.noiseAlertLevel).bg
                        } ${getNoiseLevelStyle(record.noiseAlertLevel).text}`}
                      >
                        {record.noiseAlertLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.noiseCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredData.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredData.length}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-[#103A5E] border-[#103A5E] text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Noise Level Categories */}
          <div className="px-8 py-8 border-t border-gray-100 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-[#103A5E]">
                  Noise Level Reference
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Understanding noise level classifications and their thresholds
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {NOISE_CATEGORIES.map((category, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${category.bgColor}`}
                  >
                    <div
                      className={`text-sm font-medium ${category.textColor}`}
                    >
                      {category.label}
                    </div>
                    <div className={`text-xs ${category.textColor} mt-1`}>
                      {category.range}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
