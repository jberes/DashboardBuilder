import { RevealView, VisualizationViewer } from "@revealbi/ui-react";
import React, { useState, useEffect, useRef } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { RdashDocument } from "@revealbi/dom";
import { RevealSdkSettings, RevealViewOptions, SaveEventArgs } from "@revealbi/ui";

export interface VisualizationChartInfo {
  selected?: boolean;
  dashboardFileName: string;
  dashboardTitle: string;
  vizId: string;
  vizTitle: string;
  vizChartType: string;
  vizImageUrl: string;
}

const options: RevealViewOptions = {
  canEdit: true,
  canSaveAs: true,
  startInEditMode: true,
  dataSourceDialog:
  {
    showExistingDataSources: true,
  },
}

export default function Builder() {
  const [dashboardFileName, setDashboardFileName] = useState<string | unknown>("");
  const [vizId, setVizId] = useState<string | number>("");
  const [visualizationData, setVisualizationData] = useState<VisualizationChartInfo[]>([]);
  const [selectedVisualizations, setSelectedVisualizations] = useState<VisualizationChartInfo[]>([]);
  const [dashboardDocument, setDashboardDocument] = useState<RdashDocument | null>(null);
  const [sourceDocs, setSourceDocs] = useState(new Map());

  const dashboardDocumentRef = useRef(dashboardDocument);
  dashboardDocumentRef.current = dashboardDocument;

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

  const fetchVisualizationData = async () => {
    const response = await fetch(RevealSdkSettings.serverUrl + `/dashboards/visualizations`);
    const data = await response.json();
    setVisualizationData(data);
  };

  const selectVisualization = (viz: VisualizationChartInfo) => {
    setDashboardFileName(viz.dashboardFileName);
    setVizId(viz.vizId);
  };

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

  const resetDashboard = () => {
    setSelectedVisualizations([]);
    setDashboardDocument(null);
  };

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

  return (
    <>
      <main className="lg:pl-72 h-full">
        <div className="xl:pl-64 h-full" >
          <RevealView
            options={options}
            dashboard={dashboardDocument}
            onSave={saveDashboard}
          />
        </div>
      </main>

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
        <div className="pt-4">
          <VisualizationViewer
            dashboard={dashboardFileName}
            visualization={vizId}
            style={{ height: "420px" }}
          ></VisualizationViewer>
        </div>
      </aside>
    </>
  );
}