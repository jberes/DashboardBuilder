import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public sdkUrl: string = 'https://localhost:7218/';
}
