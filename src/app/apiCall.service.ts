import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, retry, concatMap } from 'rxjs/operators';
import { ChartRequest, ChartType } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
import { TimeInterval, DataSetType } from "./app.component";
@Injectable({
    providedIn: 'root'
})
export class ApiCallService {
    constructor(private httpClient: HttpClient) {}

    getChartDataSet(dataset: string): Observable<any> {

        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        
        return this.httpClient.get(
            `http://localhost:3000/` + dataset,
            {
                headers: headers
            }
        ).pipe(
            map((data: any) => {
                return data;
            }), catchError(err => {
                return throwError('yo')
            })
        )
    }

    public examplePromise = (val: any) => new Promise(() => {return val;});

    public returnValue = (item: any) =>
        new Promise(res => 
            setTimeout(() => 
                res(` ${item} returned value`), 1000
            )
        );

    public getChart(timeInterval: TimeInterval, chartType: DataSetType): Observable<any> {

        let url = 'http://localhost:3000/';

        // Using scuffed endpoint because of mock api.
        url = url + timeInterval.toLowerCase() + '-' + chartType;

        return this.httpClient.get<any>(url);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        
          console.log(`${operation} failed: ${error.message}`);
    
          return of(result as T);
        };
    }
}