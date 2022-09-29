import { useEffect, useState, useMemo } from "react";
import { Range, getTrackBackground } from "react-range";
import { ColorRing } from "react-loader-spinner";
import {
  precalcData,
  normalizeResponse,
  STEP,
  MIN_RANGE_VALUE,
} from "./helpers";
import Table from "./Table";
import styles from "./ResourceTable.module.css";

const App = () => {
  const [records, setRecords] = useState<ProcessedRecord[]>();
  const [scrollbarValues, setScrollbarValues] = useState<number[]>([0]);
  const [err, setErr] = useState<string | null>(null);

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
    const result = Object.entries(resources).map(([resourceName, users]) =>
      Object.keys(users)
        .map((userName: string) => ({
          name: userName === "__total" ? "" : userName,
          resource: resourceName,
          amount: resources[resourceName][userName],
        }))
        .sort((a, b) => b.amount - a.amount)
    );

    return result.flat();
  };

  const columns: TableColumn = useMemo(
    () => [
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
    ],
    []
  );

  if (err) return <h1>{err}</h1>;
  else
    return (
      <div className={styles.resourceTable}>
        {records ? (
          <>
            <div className={styles.tableWrapper}>
              <Table
                columns={columns}
                data={resourcesAmountAtCertainMomemnt(scrollbarValues[0])}
              />
            </div>
            <div className={styles.rangeWrapper}>
              <Range
                min={MIN_RANGE_VALUE}
                max={records.length - 1}
                step={STEP}
                values={scrollbarValues}
                onChange={(scrollbarValues) =>
                  setScrollbarValues(scrollbarValues)
                }
                renderTrack={({ props, children }) => (
                  <div
                    className={styles.renderTrackWrap}
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{ ...props.style }}
                  >
                    <div
                      className={styles.renderTrack}
                      ref={props.ref}
                      style={{
                        background: getTrackBackground({
                          values: scrollbarValues,
                          colors: ["#ff5733", "#ccc"],
                          min: MIN_RANGE_VALUE,
                          max: records.length - 1,
                        }),
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div {...props} className={styles.renderThumb} />
                )}
              />
              <output className={styles.rangeOutput} id="output">
                {new Date(records[scrollbarValues[0]].timestamp).toUTCString()}
              </output>
            </div>
          </>
        ) : (
          <ColorRing
            visible
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
