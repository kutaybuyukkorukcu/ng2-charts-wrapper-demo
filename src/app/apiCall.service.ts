import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimeInterval } from 'ng2-charts-wrapper';
import { DataSetType } from "./app.component";
@Injectable({
    providedIn: 'root'
})
export class ApiCallService {

    url: string = 'assets/chart-data.json';

    constructor(private httpClient: HttpClient) { }

    public getChart(timeInterval: TimeInterval, dataSetType: DataSetType): Observable<any> {

        const chart = dataSetType + '-' + timeInterval.toLowerCase()
        return this.httpClient.get<any>(this.url).pipe(
            map((chartResponse) => (chartResponse[chart]))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        
          console.log(`${operation} failed: ${error.message}`);
    
          return of(result as T);
        };
    }
}