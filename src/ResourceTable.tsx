import { useEffect, useState, useMemo } from "react";
import { Range, getTrackBackground } from "react-range";
import { ColorRing } from "react-loader-spinner";
import { precalcData, normalizeResponse } from "./helpers";
import Table from "./Table";
import "./ResourceTable.css";

const App = () => {
  const [records, setRecords] = useState<ProcessedRecord[]>();
  const [scrollbarValues, setScrollbarValues] = useState<number[]>([0]);
  const [err, setErr] = useState<boolean>(false);

  const STEP = 1;
  const MIN = 0;

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/alexgavrushenko/lootbox/master/generated.log"
    )
      .then((r) => r.text())
      .then((text) => setRecords(precalcData(normalizeResponse(text))))
      .catch((err) => setErr(err.message));
  }, []);

  // It's cheaper to recalc value for "certain" moment of time,
  // then storing all the results for each moment of time
  const resourcesAmountAtCertainMomemnt = (
    timestampIndex: number
  ): TableRecord[] => {
    if (!records) return [];

    const resources = records[timestampIndex].resources;
    const result = Object.keys(resources).map((resourceName) =>
      Object.keys(resources[resourceName])
        .map((userName) => ({
          name: userName === '__total' ? "" : userName,
          resource: resourceName,
          amount: resources[resourceName][userName],
        }))
        .sort((a, b) => b.amount - a.amount)
    );

    return result.reduce((prev, cur) => [...prev, ...cur]);
  };

  const columns = useMemo(
    () =>
      [
        {
          Header: "User",
          accessor: "name",
        },
        {
          Header: "Resource",
          accessor: "resource",
        },
        {
          Header: "Resource",
          accessor: "amount",
        },
      ] as TableColumn,
    []
  );

  if (err) return <h1>{err}</h1>;
  else
    return (
      <div className="App">
        {records ? (
          <>
            <div className="Table">
              <Table
                columns={columns}
                data={resourcesAmountAtCertainMomemnt(scrollbarValues[0])}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                margin: "2em",
                width: "90%",
              }}
            >
              <Range
                min={MIN}
                max={records.length - 1}
                step={STEP}
                values={scrollbarValues}
                onChange={(scrollbarValues) =>
                  setScrollbarValues(scrollbarValues)
                }
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: "36px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: "0.25rem",
                        width: "100%",
                        borderRadius: "0.25rem",
                        background: getTrackBackground({
                          values: scrollbarValues,
                          colors: ["#FF5733", "#ccc"],
                          min: MIN,
                          max: records.length - 1,
                        }),
                        alignSelf: "center",
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "2rem",
                      width: "2rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#FFF",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 0.125rem 0.375rem #AAA",
                    }}
                  >
                    <div
                      style={{
                        height: "0.5rem",
                        width: "0.5rem",
                        backgroundColor: isDragged ? "#FF5733" : "#CCC",
                      }}
                    />
                  </div>
                )}
              />
              <output style={{ marginTop: "30px" }} id="output">
                {new Date(records[scrollbarValues[0]].timestamp).toUTCString()}
              </output>
            </div>
          </>
        ) : (
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        )}
      </div>
    );
};

export default App;
