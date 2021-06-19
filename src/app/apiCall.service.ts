import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, retry, concatMap } from 'rxjs/operators';
import { ChartRequest, ChartType } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;

@Injectable({
    providedIn: 'root'
})
export class ApiCallService {
    constructor(private httpClient: HttpClient) {}

    getChartDataSet(dataset: string, chartType?: ChartType): Observable<any> {

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

    // public getChart(): Observable<any> {
    //     return this.httpClient.get<any>('http://localhost:3000/singledataset')
    //     .pipe(
    //         retry(1),
    //         catchError(this.handleError<any>());
    //     );
    //     // pipe(retry(1), catchError(err => { return throwError(err) }));
    // }

    public examplePromise = (val: any) => new Promise(() => {return val;});

    public returnValue = (item: any) =>
        new Promise(res => 
            setTimeout(() => 
                res(` ${item} returned value`), 1000
            )
        );

    public getChart(timeInterval: string, chartType: string): Observable<any> {

        let url = 'http://localhost:3000/';

        // Using scuffed endpoint because of mock api.
        url = url + timeInterval + '-' + chartType;

        return this.httpClient.get<any>(url);
            // .pipe(
                // tap(_ => console.log('yo')),
                // concatMap(res => { return res;}),
                // concatMap(res => this.returnValue(res))
                // catchError(this.handleError<any>())
                // concatMap(val => this.examplePromise(val))
                
            // )
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        
          console.log(`${operation} failed: ${error.message}`);
    
          return of(result as T);
        };
    }
}