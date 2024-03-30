import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisualizationChartInfo } from '../models/reveal-server/visualization-chart-info';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RevealServerService {
  constructor(
    private http: HttpClient
  ) { }

  public getVisualizationChartInfoList(): Observable<VisualizationChartInfo[]> {
    const API_ENDPOINT = environment.BASE_URL;
    return this.http.get<VisualizationChartInfo[]>(`${API_ENDPOINT}/dashboards/visualizations`);
  }
}
