import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisualizationChartInfo } from '../models/reveal-server/visualization-chart-info';

const API_ENDPOINT = 'https://localhost:7218';

@Injectable({
  providedIn: 'root'
})
export class RevealServerService {
  constructor(
    private http: HttpClient
  ) { }

  public getVisualizationChartInfoList(): Observable<VisualizationChartInfo[]> {
    return this.http.get<VisualizationChartInfo[]>(`${API_ENDPOINT}/dashboards/visualizations`);
  }
}
