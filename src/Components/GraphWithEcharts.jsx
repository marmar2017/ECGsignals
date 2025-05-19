import { useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import ecgData from "../assets/Data/ecg_graph.json";
import SidebarDrawer from "./SidebarDrawer";

const GraphWithEcharts = () => {
  const [signals, setSignals] = useState([]);
  const [beats, setBeats] = useState([]);
  const [selectedBeatIndex, setSelectedBeatIndex] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const [activeLabels, setActiveLabels] = useState(["N", "V", "A", "S"]);
  const [selectedEventIndices, setSelectedEventIndices] = useState([]);
  const [batchLabel, setBatchLabel] = useState("N");
  const [showSidebar, setShowSidebar] = useState(false);
  const chartRef = useRef(null);
  const highlightInfoRef = useRef(null);
  const reportRef = useRef(null);

  useEffect(() => {
    const timeLimit = 10000;
    const filteredSignals = ecgData.signals.filter(
      (p) => p.timeInMs <= timeLimit
    );
    const validTimes = new Set(filteredSignals.map((p) => p.timeInMs));
    const filteredBeats = ecgData.beats.filter((beat) => {
      const point = ecgData.signals[beat.beatIndex];
      return point && validTimes.has(point.timeInMs);
    });

    setSignals(filteredSignals);
    setBeats(filteredBeats);
  }, []);

  const handleLabelChange = (e) => {
    const updatedBeats = beats.map((beat, index) =>
      index === selectedBeatIndex ? { ...beat, label: e.target.value } : beat
    );
    setBeats(updatedBeats);
    setSelectedBeatIndex(null);
    setDropdownPos(null);
  };

  const handleClick = (params) => {
    if (!params?.data?.coord || !chartRef.current) return;

    const [clickedTime, clickedPoint] = params.data.coord;
    const beatIndex = beats.findIndex((beat) => {
      const point = ecgData.signals[beat.beatIndex];
      return (
        Math.abs(point.timeInMs - clickedTime) < 5 &&
        Math.abs(point.point - clickedPoint) < 0.01
      );
    });

    if (beatIndex !== -1) {
      const echartsInstance = chartRef.current.getEchartsInstance();
      const pixel = echartsInstance.convertToPixel(
        { xAxisIndex: 0, yAxisIndex: 0 },
        [clickedTime, clickedPoint]
      );

      setSelectedBeatIndex(beatIndex);
      setDropdownPos({ left: pixel[0], top: pixel[1] });
    } else {
      setSelectedBeatIndex(null);
      setDropdownPos(null);
    }
  };

  const handleDataZoom = () => {
    const chart = chartRef.current?.getEchartsInstance?.();
    if (!chart) return;

    const dataZoom = chart.getOption().dataZoom?.[0];
    const { start, end } = dataZoom;

    const allTimes = signals.map((p) => p.timeInMs);
    const minTime = Math.min(...allTimes);
    const maxTime = Math.max(...allTimes);

    const startTime = minTime + ((maxTime - minTime) * start) / 100;
    const endTime = minTime + ((maxTime - minTime) * end) / 100;
    const duration = endTime - startTime;
    chart.setOption({
      series: [{
        markArea: {
          data: [[
            {
              name: 'Selected Area',
              xAxis: startTime,
            },
            {
              xAxis: endTime,
            },
          ]]
        }
      }]
    });
    const selectedBeats = beats.filter((beat) => {
      return (
        beat.startInMs >= startTime && beat.endInMs <= endTime
      );
    });



    console.log(selectedBeats)
    const beatCount = selectedBeats.length;
    const hr = duration > 0 ? Math.round((beatCount / duration) * 60000) : 0;

    const highlight = {
      start: Math.round(startTime),
      end: Math.round(endTime),
      duration: Math.round(duration),
      beatCount,
      hr,
    };

    highlightInfoRef.current = highlight;

    if (reportRef.current) {
      reportRef.current.innerHTML = `
        <div><strong>Start Time:</strong> ${highlight.start} ms</div>
        <div><strong>End Time:</strong> ${highlight.end} ms</div>
        <div><strong>Duration:</strong> ${highlight.duration} ms</div>
        <div><strong>Beats in Range:</strong> ${highlight.beatCount}</div>
        <div><strong>Estimated HR:</strong> ${highlight.hr} bpm</div>
      `;
    }
  };

  const ecgOption = {
    title: {
      text: "ECG Waveform with Annotations",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: (params) =>
        `Time: ${params[0].data[0]} ms<br/>Amplitude: ${params[0].data[1]}`,
    },
    toolbox: {
      feature: {
        saveAsImage: { show: true },
        restore: { show: true },
        dataZoom: { show: true },
      },
    },
    markArea: {
      silent: true,
      itemStyle: {
        color: 'rgba(0, 123, 255, 0.2)',
      },
      data: [],
    },

    dataZoom: [
      {
        startValue: "0",
      },
      {
        type: "inside",
      },
    ],
    legend: {
      data: ["ECG"],
      right: "25%",
      top: "top",
    },
    xAxis: {
      type: "value",
      name: "Time (ms)",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        formatter: (value) => (value % 1000 === 0 ? `${value / 1000} s` : ""),
      },
    },
    yAxis: {
      type: "value",
      name: "Amplitude",
      nameLocation: "middle",
      nameGap: 50,
    },
    series: [
      {
        name: "ECG",
        type: "line",
        data: signals.map((p) => [p.timeInMs, p.point]),
        showSymbol: false,
        smooth: true,
        lineStyle: { width: 1 },
        markPoint: {
          symbol: "circle",
          symbolSize: 18,
          label: {
            show: true,
            formatter: (param) => param.name,
            fontSize: 10,
          },
          itemStyle: { color: "#ff0000" },
          data: beats
            .filter((beat) => activeLabels.includes(beat.label))
            .map((beat) => {
              const point = ecgData.signals[beat.beatIndex];
              return {
                name: beat.label,
                coord: [point.timeInMs, point.point],
              };
            }),
        },
      },
    ],
  };

  const clearHighlight = () => {
    highlightInfoRef.current = null;
    if (reportRef.current) {
      reportRef.current.innerHTML = `<div>No selection</div>`;
    }

    const chart = chartRef.current?.getEchartsInstance?.();
    if (chart) {
      chart.dispatchAction({
        type: "dataZoom",
        start: 0,
        end: 100,
      });
    }
  };

  const onEvents = {
    click: handleClick,
    datazoom: handleDataZoom,
  };

  const selectedBeat =
    selectedBeatIndex !== null ? beats[selectedBeatIndex] : null;

  return (
    <div className="relative h-screen overflow-y-auto">
      <button
        onClick={() => setShowSidebar(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <SidebarDrawer
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        beats={beats}
        ecgData={ecgData}
        activeLabels={activeLabels}
        setActiveLabels={setActiveLabels}
        selectedEventIndices={selectedEventIndices}
        setSelectedEventIndices={setSelectedEventIndices}
        batchLabel={batchLabel}
        setBatchLabel={setBatchLabel}
        setBeats={setBeats}
      />

      <div className="p-4">
        <ReactECharts
          ref={chartRef}
          option={ecgOption}
          onEvents={onEvents}
          notMerge={true}
          style={{ height: "600px", width: "100%" }}
        />

        {selectedBeat && dropdownPos && (
          <div
            className="absolute bg-white border rounded p-2 z-50"
            style={{
              left: dropdownPos.left,
              top: dropdownPos.top,
              transform: "translate(-50%, -100%)",
            }}
          >
            <select
              className="select select-bordered select-xs"
              value={selectedBeat.label}
              onChange={handleLabelChange}
            >
              <option value="N">N</option>
              <option value="V">V</option>
              <option value="A">A</option>
              <option value="S">S</option>
            </select>
          </div>
        )}

        <div className="mt-4 flex flex-col items-center space-y-2">
          <div
            ref={reportRef}
            className="px-3 py-2 text-xs bg-blue-100 border border-blue-300 rounded-lg shadow-md text-center"
          >
            <strong className="block mb-1">Selected Area Info:</strong>
            <div>No selection</div>
          </div>

          <button
            onClick={clearHighlight}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded shadow hover:bg-red-600"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphWithEcharts;
