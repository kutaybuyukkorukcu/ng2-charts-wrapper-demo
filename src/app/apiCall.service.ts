import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, retry, concatMap } from 'rxjs/operators';
import { ChartRequest, ChartType, TimeInterval } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
import { DataSetType } from "./app.component";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiCallService {

    url!: string | undefined;

    constructor(private httpClient: HttpClient) {
        if (environment.production == true) {
            this.url = `process.env.API_URL`;
        } else {
            this.url = 'http://localhost:3000/';
        }
    }

    public examplePromise = (val: any) => new Promise(() => {return val;});

    public returnValue = (item: any) =>
        new Promise(res => 
            setTimeout(() => 
                res(` ${item} returned value`), 1000
            )
        );

    public getChart(): Observable<any> {

        return this.httpClient.get<any>(
            this.url + 'dataset'
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        
          console.log(`${operation} failed: ${error.message}`);
    
          return of(result as T);
        };
    }
}