import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxIconComponent } from 'igniteui-angular';
import { Subject, takeUntil } from 'rxjs';
import { VisualizationChartInfo } from '../models/reveal-server/visualization-chart-info';
import { RevealServerService } from '../services/reveal-server.service';
import { environment } from '../../environments/environment';
import { RdashDocument } from '@revealbi/dom';

declare let $: any;

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxIconComponent, NgFor],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit, OnDestroy {
 
  private destroy$: Subject<void> = new Subject<void>();
  public visualizationId?: string;
  public selectedVisualization?: VisualizationChartInfo;
  public revealServerVisualizationChartInfo: VisualizationChartInfo[] = [];


  // Variables for Generate Dashboard
  dashboardDocument: RdashDocument | string | null = "";
  vizCollection: VisualizationChartInfo[] = [];
  sourceDocs: Map<string, RdashDocument> = new Map();

  // Correctly reference the revealSingleViz and revealDashboard elements
  @ViewChild('revealSingleViz') public revealSingleViz!: ElementRef;
  @ViewChild('revealDashboard') public revealDashboard!: ElementRef;

  // variables to store the revealView and dashboardin the listItemClick method
  public revealView: any;
  public dashboard: any;

  // add the envornment variable for use in the HTML to set the IMAGE_URL
  public environment = environment;

  // Add a variable to store the selected item in the listItemClick method
  prevSelected: any;
  dashboard1: any;
  revealView1: any;

  constructor(
    private revealServerService: RevealServerService,
  ) {}

  ngOnInit() {
      this.loadVisualizationChartInfo();
    }
    

  loadVisualizationChartInfo() {
    this.revealServerService.getVisualizationChartInfoList().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.revealServerVisualizationChartInfo = data;
        // Add this to select the first item in the list when the page loads
        if (this.revealServerVisualizationChartInfo.length > 0) {
          setTimeout(() => this.listItemClick(this.revealServerVisualizationChartInfo[0]), 0);
        }
      },
      error: (_err: any) => this.revealServerVisualizationChartInfo = []
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Get the item.visualizationID and Filename to load the single visualization
  public async listItemClick(item: VisualizationChartInfo) {
   if (this.prevSelected) {
      this.prevSelected.selected = false;
    }
      item.selected = true;
      this.prevSelected = item;

    this.selectedVisualization = item;

    this.dashboard = await $.ig.RVDashboard.loadDashboard(item.dashboardFileName);
    this.revealView = new $.ig.RevealView(this.revealSingleViz.nativeElement);
    this.revealView.dashboard = this.dashboard;
    this.revealView.singleVisualizationMode = true;
    this.revealView.maximizedVisualization = this.dashboard.visualizations.getById(item.vizId);
  }

  public iconClick(item: VisualizationChartInfo, event: MouseEvent) {    
    // call stopPropagation to prevent the event from bubbling up the DOM tree
    event.stopPropagation();

    // Check if the item clicked is different from the currently selected item
    if (!this.selectedVisualization || this.selectedVisualization.vizId!== item.vizId) {
      console.log("Item Clicked:", item);
      this.listItemClick(item);
    }

    if (this.selectedVisualization) {
      this.vizCollection.push(this.selectedVisualization);
      this.generateDashboard();
    } else {
      console.error('Selected visualization is undefined');
    }
  }
  
  private async generateDashboard(): Promise<void> {
    console.log("Add Generated Dashboard");
    const document = new RdashDocument("Generated Dashboard");
    for (const viz of this.vizCollection) {
      let sourceDoc = this.sourceDocs.get(viz.dashboardFileName);
      if (!sourceDoc) {
        try {
          sourceDoc = await RdashDocument.load(viz.dashboardFileName);
          this.sourceDocs.set(viz.dashboardFileName, sourceDoc);
        } catch (error) {
          console.error(`Failed to load document: ${viz.dashboardFileName}`, error);
          continue;
        }
      }
      if (sourceDoc) {
        document.import(sourceDoc, viz.vizId);
      }
    }
    if (!this.dashboardDocument) { 
      this.setupRevealView();
    }    
    this.revealView1.dashboard = await document.toRVDashboard();
  }

  private setupRevealView() {
    this.revealView1 = new $.ig.RevealView(this.revealDashboard.nativeElement);
    this.revealView1.hoverTooltipsEnabled = true;
    this.revealView1.interactiveFilteringEnabled = true;
    this.revealView1.startInEditMode = true;
  
    this.revealView1.onSave = async (rv: any, args: any) => {
      console.log("Save event triggered");
      const isInvalidName = (name: string) => {
        return name === "Generated Dashboard" || name === "New Dashboard" || name === "";
    };

    console.log("Dashboard Name: " + args.name);
    console.log("Dashboard Id: " + args.dashboardId)

    if (args.saveAs || isInvalidName(args.name)) {
      let newName: string | null;
        do {
            newName = prompt("Please enter a valid dashboard name");
            if (newName === null) {
                return; 
            }
        } while (isInvalidName(newName)); 

        this.isDuplicateName(newName).then(isDuplicate => {
            if (isDuplicate === 'true') {
                if (!window.confirm("A dashboard with name: " + newName + " already exists. Do you want to override it?")) {
                    return; 
                }
            }
            args.dashboardId = args.name = newName!;
            args.saveFinished();
            setTimeout(() => {this.loadVisualizationChartInfo(); }, 2000);
        });
    } else {
      args.saveFinished(); 
      setTimeout(() => {this.loadVisualizationChartInfo(); }, 2000);
    }
  };

    this.revealView1.onMenuOpening = (rv: any, args: any) => {
      console.log("Menu opening event triggered");

      
      if (args.menuLocation === $.ig.RVMenuLocation.Dashboard) {
      
        // Hide Export options
        for (let i = 0; i < args.menuItems.length; i++) {
          if(args.menuItems[i].title === "Export") args.menuItems[i].isHidden = true;
        }

        const menuItem = new $.ig.RVMenuItem("Clear / Reset", 
              new $.ig.RVImage(environment.IMAGE_URL + "custom.png", "Icon"), () => {
                this.resetDashboard();
            })
            args.menuItems.push(menuItem);
      }
    };
  }

  private isDuplicateName(name: string): Promise<string> {
    return fetch(`${environment.BASE_URL}/dashboards/${name}/exists`).then(resp => resp.text());
  }

  resetDashboard() {
    this.vizCollection = [];
    this.dashboardDocument = null;
    this.revealView1.dashboard = null;
  }
}