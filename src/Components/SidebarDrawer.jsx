import React from "react";

const SidebarDrawer = ({
  showSidebar,
  setShowSidebar,
  beats,
  ecgData,
  activeLabels,
  setActiveLabels,
  selectedEventIndices,
  setSelectedEventIndices,
  batchLabel,
  setBatchLabel,
  setBeats,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold ml-20">Annotations</h3>
        <button onClick={() => setShowSidebar(false)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        <div className="mb-4">
          <strong>Filter:</strong>
          {["N", "V", "A", "S"].map((label) => (
            <label key={label} className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={activeLabels.includes(label)}
                onChange={() => {
                  setActiveLabels((prev) =>
                    prev.includes(label)
                      ? prev.filter((l) => l !== label)
                      : [...prev, label]
                  );
                }}
              />
              {label}
            </label>
          ))}
        </div>

        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th></th>
              <th>Index</th>
              <th>Time</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody>
            {beats.map((beat, idx) => {
              const point = ecgData.signals[beat.beatIndex];
              return (
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs"
                      checked={selectedEventIndices.includes(idx)}
                      onChange={() => {
                        setSelectedEventIndices((prev) =>
                          prev.includes(idx)
                            ? prev.filter((i) => i !== idx)
                            : [...prev, idx]
                        );
                      }}
                    />
                  </td>
                  <td>{beat.beatIndex}</td>
                  <td>{point.timeInMs}</td>
                  <td>{beat.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {selectedEventIndices.length > 0 && (
          <div className="mt-4">
            <label className="mr-2">Change label:</label>
            <select
              className="select select-sm"
              value={batchLabel}
              onChange={(e) => setBatchLabel(e.target.value)}
            >
              <option value="N">N</option>
              <option value="V">V</option>
              <option value="A">A</option>
              <option value="S">S</option>
            </select>
            <button
              className="btn btn-sm ml-2 mt-5"
              onClick={() => {
                const updated = beats.map((b, i) =>
                  selectedEventIndices.includes(i)
                    ? { ...b, label: batchLabel }
                    : b
                );
                setBeats(updated);
                setSelectedEventIndices([]);
              }}
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarDrawer;
