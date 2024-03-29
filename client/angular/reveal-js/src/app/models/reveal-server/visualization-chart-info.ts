export interface VisualizationChartInfo {
  dashboardFileName: string;
  dashboardTitle: string;
  vizId: string;
  vizTitle: string;
  vizChartType: string;
  //vizImageUrl: string;
  // add this to hold the selected item for the listItemClicked in the Builder
  selected: any;
}
