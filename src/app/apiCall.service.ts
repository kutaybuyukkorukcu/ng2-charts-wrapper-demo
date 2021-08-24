import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, retry, concatMap } from 'rxjs/operators';
import { ChartRequest, ChartType, TimeInterval } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
import { DataSetType } from "./app.component";
import { environment } from '../environments/environment.prod';
@Injectable({
    providedIn: 'root'
})
export class ApiCallService {

    url!: string;

    constructor(private httpClient: HttpClient) {
        this.url = environment.API_URL;    
    }

    public examplePromise = (val: any) => new Promise(() => {return val;});

    public returnValue = (item: any) =>
        new Promise(res => 
            setTimeout(() => 
                res(` ${item} returned value`), 1000
            )
        );

    public getChart(timeInterval: TimeInterval, chartType: DataSetType): Observable<any> {

        return this.httpClient.get<any>(
            this.url + timeInterval.toLowerCase() + '-' + chartType
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        
          console.log(`${operation} failed: ${error.message}`);
    
          return of(result as T);
        };
    }
}