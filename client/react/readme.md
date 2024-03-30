# Builder Component

The `Builder` component is a React component that allows users to build a dashboard using visualizations from different dashboards.

### Install and Set Up the RevealBI SDK
Follow the instructions from the RevealBI documentation to install and configure the SDK in your project. Ensure you have access to the VisualizationViewer component.

### Set Up Tailwind CSS in Your React Project
Before starting, make sure Tailwind CSS is installed and configured in your project. You can follow the Tailwind CSS Installation Guide if you haven't done this yet.

### Prepare Visualization Data
Ensure you have an array of objects representing your visualization data. Each object should have properties like `vizTitle`, `vizImageUrl`, and `dashboardTitle`.

### Import Statements

```ts
import { RevealView, VisualizationViewer } from "@revealbi/ui-react";
import React, { useState, useEffect, useRef } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { RdashDocument } from "@revealbi/dom";
import { RevealSdkSettings, RevealViewOptions, SaveEventArgs } from "@revealbi/ui";
```

## VisualizationChartInfo Interface
This interface defines the structure of the visualization data. Each visualization has a `dashboardFileName`, `dashboardTitle`, `vizId`, `vizTitle`, `vizChartType`, and `vizImageUrl`. The selected field indicates whether the visualization is selected in the UI.

```ts
export interface VisualizationChartInfo {
  selected?: boolean;
  dashboardFileName: string;
  dashboardTitle: string;
  vizId: string;
  vizTitle: string;
  vizChartType: string;
  vizImageUrl: string;
}
```


### RevealViewOptions
These options are passed to the RevealView component to configure its behavior. The canEdit and canSaveAs options enable editing and saving of the dashboard. The startInEditMode option opens the dashboard in edit mode. The dataSourceDialog option configures the data source dialog to show existing data sources.

```ts
const options: RevealViewOptions = {
  canEdit: true,
  canSaveAs: true,
  startInEditMode: true,
  dataSourceDialog: {
    showExistingDataSources: true,
  },
}
```


### Builder Function Component
The Builder component uses several pieces of state:

- dashboardFileName: The file name of the current dashboard.
- vizId: The ID of the current visualization.
- visualizationData: An array of all available visualizations.
- selectedVisualizations: An array of the currently selected visualizations.
- dashboardDocument: The current dashboard document.
- sourceDocs: A map of source documents, keyed by file name.

The dashboardDocumentRef is a ref that holds the current dashboard document. This is used to prevent unnecessary re-renders when the dashboard document changes.

```ts
export default function Builder() {
  const [dashboardFileName, setDashboardFileName] = useState<string | unknown>("");
  const [vizId, setVizId] = useState<string | number>("");
  const [visualizationData, setVisualizationData] = useState<VisualizationChartInfo[]>([]);
  const [selectedVisualizations, setSelectedVisualizations] = useState<VisualizationChartInfo[]>([]);
  const [dashboardDocument, setDashboardDocument] = useState<RdashDocument | null>(null);
  const [sourceDocs, setSourceDocs] = useState(new Map());

  const dashboardDocumentRef = useRef(dashboardDocument);
  dashboardDocumentRef.current = dashboardDocument;
```


### useEffect Hooks
The first useEffect hook runs once when the component mounts. It sets up the header menu for the RevealView and fetches the visualization data.

The second useEffect hook runs whenever the selectedVisualizations state changes. If there are any selected visualizations, it generates a new dashboard.

```ts
  useEffect(() => {
    options.header = {
      menu: {
        items: [
          { title: "Clear / New", click: () => resetDashboard(), icon: RevealSdkSettings.serverUrl + `/images/download.png` },
        ]
      }
    };

    fetchVisualizationData();
  }, []);

  useEffect(() => {
    if (selectedVisualizations.length > 0) {
      generateDashboard();
    }
  }, [selectedVisualizations]);
```


### fetchVisualizationData Function
This asynchronous function fetches the visualization data from the server and updates the visualizationData state.

```ts
  const fetchVisualizationData = async () => {
    const response = await fetch(RevealSdkSettings.serverUrl + `/dashboards/visualizations`);
    const data = await response.json();
    setVisualizationData(data);
  };
```

### selectVisualization Function
This function is called when a visualization is clicked. It updates the dashboardFileName and `vizId` states with the file name and ID of the clicked visualization.

```ts
  const selectVisualization = (viz: VisualizationChartInfo) => {
    setDashboardFileName(viz.dashboardFileName);
    setVizId(viz.vizId);
  };
```

### addVisualization Function

The `addVisualization` function is an asynchronous function that handles the addition of a new visualization to a selected visualizations array.  This function is designed to work in a React environment and is likely used in the context of a dashboard or similar interface where users can select different visualizations to display.

Here's a detailed breakdown of what the function does:

1. **Function Parameters**: The function takes two parameters:
   - `viz`: An object of type `VisualizationChartInfo` representing the visualization to be added.
   - `event`: A `React.MouseEvent` object representing the event that triggered the function call.

2. **Stop Event Propagation**: The function calls `event.stopPropagation()` to prevent the event from bubbling up the event chain and potentially triggering additional event handlers on parent elements.

3. **Update Selected Visualizations**: The function calls `setSelectedVisualizations`, a state update function (presumably from a `useState` hook), with a callback function. This callback function:
   - Takes the previous state (`prev`) as a parameter.
   - Returns a new array that includes all previous visualizations (`...prev`) and a new object that is a copy of `viz` with the `selected` property set to `true`.

```ts
const addVisualization = async (
  viz: VisualizationChartInfo,
  event: React.MouseEvent<SVGSVGElement, MouseEvent>
) => {
  event.stopPropagation();
  setSelectedVisualizations(prev => [
    ...prev,
    { ...viz, selected: true }
  ]);
};
```


### generateDashboard Function
This asynchronous function generates a new dashboard document from the selected visualizations. For each selected visualization, it loads the source document (if not already loaded), imports the visualization into the new document, and then sets the new document as the current dashboard document.

```ts
  const generateDashboard = async () => {
    const document = new RdashDocument("Generated Dashboard");
    for (const viz of selectedVisualizations) {
      let sourceDoc = sourceDocs.get(viz.dashboardFileName);
      if (!sourceDoc) {
        try {
          sourceDoc = await RdashDocument.load(viz.dashboardFileName);
          setSourceDocs((prev) =>
            new Map(prev).set(viz.dashboardFileName, sourceDoc)
          );
        } catch (error) {
          console.error(`Failed to load document: ${viz.dashboardFileName}`, error);
          continue;
        }
      }
      if (sourceDoc) {
        document.import(sourceDoc, viz.vizId);
      }
    }
    if (JSON.stringify(document) !== JSON.stringify(dashboardDocumentRef.current)) {
      setDashboardDocument(document);
    }
  };
```


### resetDashboard Function
This function resets the dashboard by clearing the selectedVisualizations state and setting the dashboardDocument state to null.

```ts
  const resetDashboard = () => {
    setSelectedVisualizations([]);
    setDashboardDocument(null);
  };
```

### isDuplicateName Function
This asynchronous function checks if a given dashboard name is a duplicate. It sends a request to the server and returns the response.

```ts
  const isDuplicateName = async (name: string) => {
    try {
      const response = await fetch(RevealSdkSettings.serverUrl + `/dashboards/${name}/exists`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error checking duplicate name:", error);
      return false;
    }
  };
```


### saveDashboard Function

This asynchronous function is called when the dashboard is saved. It checks if the dashboard name is a duplicate or invalid, and if so, prompts the user for a new name. It then finishes the save operation, resets the dashboard, and fetches the visualization data again.

The `saveDashboard` function is an asynchronous function that handles the saving of dashboards in the Reveal BI Embedded SDK. Here's a detailed breakdown of what the function does:

1. **Check for Duplicate Names**: The function first checks if a dashboard with the same name already exists by calling the `isDuplicateName` function with the name of the dashboard to be saved. If a duplicate exists, it prompts the user with a confirmation dialog to override the existing dashboard. If the user chooses not to override, the function returns immediately.

2. **Validate Dashboard Name**: The function defines a local function `isInvalidName` that checks if the provided name is one of the predefined invalid names: "Generated Dashboard", "New Dashboard", or an empty string.

3. **Handle Save As Operation**: If the `saveAs` property of the event argument is true, or if the name of the dashboard is invalid, the function enters a loop where it prompts the user to enter a valid dashboard name. This loop continues until a valid name is entered or the operation is cancelled (when `newName` is null).

4. **Update Dashboard ID and Name**: If a new name is provided (in case of a Save As operation or if the original name was invalid), the function updates the `dashboardId` and `name` properties of the event argument with the new name.

5. **Finish Saving**: The function calls the `saveFinished` method of the event argument to indicate that the save operation is complete.

6. **Reset Dashboard and Fetch Visualization Data**: After the dashboard is saved, the function calls `resetDashboard` to reset the dashboard state, and schedules a call to `fetchVisualizationData` after a delay of 2000 milliseconds to refresh the visualization data.

This function is designed to work with the Reveal SDK's Save functionality, which provides the basic Save operation but requires developers to implement the Save As operation. This is because the Save As operation requires capturing a new file name for the dashboard from the end-user. The `saveDashboard` function handles this requirement by prompting the user for a new name when necessary. 


```objc
  const saveDashboard = async (e: SaveEventArgs) => {
    const duplicate = await isDuplicateName(e.name);
    
    if (duplicate && !window.confirm(`A dashboard with name: ${e.name} already exists. Do you want to override it?`)) {
      return;
    }

    const isInvalidName = (name: string) => name === "Generated Dashboard" || name === "New Dashboard" || name === "";

    if (e.saveAs || isInvalidName(e.name)) {
      let newName = null;

      do {
        newName = window.prompt("Please enter a valid dashboard name");
        if (newName === null) {
          return;
        }
      } while (isInvalidName(newName));

      e.dashboardId = e.name = newName;
    }

    e.saveFinished();
    resetDashboard();
    setTimeout(fetchVisualizationData, 2000);
  };
```


## Render Method
The render method of the `Builder` component returns the JSX that makes up the component's UI. It uses the `RevealView` and `VisualizationViewer` components from the `@revealbi/ui-react` package, and the `PlusIcon` component from the `@heroicons/react/20/solid` package.

### Main Section
The main section of the UI contains a RevealView component. This component is used to display and edit the current dashboard. The options prop is set to the options constant defined earlier in the component, which configures the behavior of the RevealView. The dashboard prop is set to the current dashboardDocument state, which is the current dashboard document. The onSave prop is set to the saveDashboard function, which is called when the dashboard is saved.

```ts
<main className="lg:pl-72 h-full">
  <div className="xl:pl-64 h-full" >
    <RevealView
      options={options}
      dashboard={dashboardDocument}
      onSave={saveDashboard}
    />
  </div>
</main>
```

### Aside Section

Within your \<aside\>, create a list to display your visualization data dynamically. Use the .map() function to iterate over your visualizationData array.  The aside section of the UI contains a list of visualizations and a VisualizationViewer component. Each visualization in the visualizationData state is mapped to a list item. When a list item is clicked, the selectVisualization function is called with the clicked visualization. When the add button (+) is clicked, the addVisualization function is called with the clicked visualization and the click event.

```ts
<aside className="fixed inset-y-0 left-0 hidden w-[530px] overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
  <div>
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-y-auto max-h-[520px] bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
      {visualizationData.map((viz, index) => (
        <li
          key={index}
          onClick={() => selectVisualization(viz)}
          className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
        >
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={RevealSdkSettings.serverUrl + `\\images\\` + viz.vizImageUrl}
              alt=""
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {viz.vizTitle}
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {viz.dashboardTitle}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4 cursor-pointer p-1 rounded-full hover:bg-indigo-100">
            <PlusIcon
              onClick={(event: any) => addVisualization(viz, event)}
              className="h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
            />
          </div>
        </li>
      ))}
    </ul>
  </div>
// ** Add Reveal Visualization component here
</aside>
```

Include the VisualizationViewer component from RevealBI SDK to display the selected visualization. Adjust the properties passed to this component as per your application's needs.

The VisualizationViewer component is used to display the current visualization. The dashboard prop is set to the dashboardFileName state, which is the file name of the current dashboard. The visualization prop is set to the vizId state, which is the ID of the current visualization.

```ts
  <div className="pt-4">
    <VisualizationViewer
      dashboard={dashboardFileName}
      visualization={vizId}
      style={{ height: "420px" }}
    ></VisualizationViewer>
  </div>
```

