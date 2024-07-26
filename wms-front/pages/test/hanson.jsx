import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "pikaday/css/pikaday.css";
import "./hansonStyle.js";
import "@handsontable/react";

import "handsontable/dist/handsontable.min.css";

import Handsontable from "handsontable";

import { HotTable, HotColumn } from "@handsontable/react";
import { data } from "./constants.jsx";
import { addClassesToRows, alignHeaders } from "./hooksCallbacks";
import Head from "next/head";


const HomePage = () => {
  useEffect(() => {
    console.log("실행되유!");
    const container = document.getElementById("container");
    if (container) {
      const root = createRoot(container);
      root.render(
        <StrictMode>
          <Table />
        </StrictMode>
      );
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Handsontable Example</title>
      </Head>
      <h1>
        테이블 테스트입니다.
      </h1>
      <div id="container" />
    </div>
  );
};

const contextMenuSettings = {
  callback(key, selection, clickEvent) {
    // Common callback for all options
    console.log(key, selection, clickEvent);
  },
  items: {
    row_above: {
      disabled() {
        // `disabled` can be a boolean or a function
        // Disable option when first row was clicked
        return this.getSelectedLast()?.[0] === 0; // `this` === hot
      },
    },
    // A separator line can also be added like this:
    // 'sp1': { name: '---------' }
    // and the key has to be unique
    sp1: "---------",
    row_below: {
      name: "Click to add row below",
    },
    about: {
      // Own custom option
      name() {
        // `name` can be a string or a function
        return "<b>Custom option</b>"; // Name can contain HTML
      },
      hidden() {
        // `hidden` can be a boolean or a function
        // Hide the option when the first column was clicked
        return this.getSelectedLast()?.[1] == 0; // `this` === hot
      },
      callback() {
        // Callback for specific option
        setTimeout(() => {
          alert("Hello world!"); // Fire alert after menu close (with timeout)
        }, 0);
      },
    },
    colors: {
      // Own custom option
      name: "Colors...",
      submenu: {
        // Custom option with submenu of items
        items: [
          {
            // Key must be in the form 'parent_key:child_key'
            key: "colors:red",
            name: "Red",
            callback() {
              setTimeout(() => {
                alert("You clicked red!");
              }, 0);
            },
          },
          { key: "colors:green", name: "Green" },
          { key: "colors:blue", name: "Blue" },
        ],
      },
    },
    credits: {
      // Own custom property
      // Custom rendered element in the context menu
      renderer() {
        const elem = document.createElement("marquee");

        elem.style.cssText = "background: lightgray;";
        elem.textContent = "Brought to you by...";

        return elem;
      },
      disableSelection: true,
      isCommand: false,
    },
  },
};

const Table = () => {
  return (
    <HotTable
      data={data}
      height={450}
      colHeaders={[
      ]}
      dropdownMenu={true}
      // dropdownMenu={["col_left", "col_right", "remove_col", "---------", "undo", "redo"]}
      hiddenColumns={{
        indicators: true,
      }}
      contextMenu={true}
      multiColumnSorting={true}
      filters={true}

      // allowRemoveColumn={true}

      rowHeaders={true}
      autoWrapCol={true}
      autoWrapRow={true}
      afterGetColHeader={alignHeaders}
      beforeRenderer={addClassesToRows}
      manualRowMove={true}
      licenseKey="non-commercial-and-evaluation"
    >
    </HotTable>
  );
};

export default HomePage;
