import { Component, OnInit } from '@angular/core';
import { Ng2ChartsWrapperComponent, Ng2ChartsWrapperService, MultiDataSetChartComponent, SingleDataSetComponent } from 'ng2-charts-wrapper';
import { Observable } from 'rxjs';
import { ApiCallService } from './apiCall.service';
import { ChartRequest } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
import { Chart, ChartType, TimeInterval } from 'ng2-charts-wrapper';
// import { ChartUtils } from 'ng2-charts-wrapper';
import { ChartUtils } from './chartUtils';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-ready-charts';

  singleDataSet!: SingleDataSetChartResponse;
  multiDataSet!: MultiDataSetChartResponse;

  isSingleDataSetChartPresent: boolean = true;

  TimeInterval: typeof TimeInterval = TimeInterval;
  Language: typeof Language = Language;
  ChartType: typeof ChartType = ChartType;
  chart: Chart = new Chart();
  chartUtils: ChartUtils = new ChartUtils();

  enumKeys: any[] = ['Daily', 'Weekly', 'Monthly'];
  chartKeys: any[] = ['Pie', 'Doughnut', 'Bar'];
  timeIntervals: any = TimeInterval;
  chartTypes: any = ChartType;

  obj: any;
  singleDataSet$!: Observable<any>;

  language!: string;
  timeIntervalDropdown!: boolean;
  chartTypeDropdown!: boolean;

  selectedTimeInterval: string = 'Daily';
  selectedChartType: string = 'Pie';

  constructor(private apiCallService: ApiCallService) {} 

  ngOnInit(): void {
    this.getChart();
    this.chart.currentChartType = this.chartUtils.getChartTypePie();
    this.chart.currentChartTypeOptions = this.chartUtils.getChartTypePieOptions();
    this.chart.chartColors = this.chartUtils.getSingleDataSetChartColors();
    this.language = 'EN';
    this.timeIntervalDropdown = false;
    this.chartTypeDropdown = false;
    // this.singledatasetBuilder();
    // this.multidatasetBuilder();
  }

  onChangeTimeInterval(item: any) {
    this.timeIntervalDropdown = !this.timeIntervalDropdown;
    this.selectedTimeInterval = item;
  }

  onChangeChartType(item: any) {
    this.chartTypeDropdown = !this.chartTypeDropdown;
    this.selectedChartType = item;
  }

  public getChart() {
    this.apiCallService.getChart().subscribe(
      (payload) => {
        this.obj = payload;
        this.chartUtils.fillGivenChartData(this.chart, this.obj);
      }
    )

    console.log(this.obj);
    return this.singleDataSet;
  }
  
  public singledatasetBuilder() {
    const data = this.apiCallService.getChartDataSet('singledataset');

    console.log(data);
  }

  public multidatasetBuilder() {
    const data = this.apiCallService.getChartDataSet('multidataset');

    console.log(data);
  }

  public onChangeLanguage() {
    this.ngOnInit();
  }
}

// export class ChartController {
//   pieChart: Chart;
//   doughnutChart: Chart;
//   barChart: Chart;
//   lineChart: Chart;
// }

export enum Language {
  TR = 'TR',
  EN = 'EN'
}