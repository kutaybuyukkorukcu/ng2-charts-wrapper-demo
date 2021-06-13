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
    this.getChart(this.selectedTimeInterval.toLowerCase());
    this.chart.currentChartType = this.chartUtils.getChartTypePie();
    this.chart.currentChartTypeOptions = this.chartUtils.getChartTypePieOptions();
    this.chart.chartColors = this.chartUtils.getSingleDataSetChartColors();
    this.language = 'EN';
    this.timeIntervalDropdown = false;
    this.chartTypeDropdown = false;
    // this.singledatasetBuilder();
    // this.multidatasetBuilder();
  }

  onChangeTimeInterval(item: string) {
    this.timeIntervalDropdown = !this.timeIntervalDropdown;
    this.selectedTimeInterval = item;

    this.getChart(item.toLowerCase()); // with selected time interval

    if (this.selectedChartType == ChartType.BAR 
      || this.selectedChartType == ChartType.DOUGHNUT
      || this.selectedChartType == ChartType.PIE
    ) {
      this.chartUtils.fillGivenChartData(this.chart, this.obj);
    } else {

      if (TimeInterval.DAILY == item) {
        this.chartUtils.fillGivenChartDataSet(this.chart, this.obj, this.chartUtils.dailyTimeIntervalLabels ,this.chartUtils.getTimeIntervalDailyLabels());
      } else if (TimeInterval.WEEKLY == item) {
        this.chartUtils.fillGivenChartDataSet(this.chart, this.obj, this.chartUtils.weeklyTimeIntervalLabels ,this.chartUtils.getTimeIntervalWeeklyLabels());
      } else if (TimeInterval.MONTHLY == item) {
        this.chartUtils.fillGivenChartDataSet(this.chart, this.obj, this.chartUtils.monthlyTimeIntervalLabels ,this.chartUtils.getTimeIntervalMonthlyLabels());
      }
    }
  }

  onChangeChartType(item: string) {
    this.chartTypeDropdown = !this.chartTypeDropdown;
    this.selectedChartType = item;
    this.chart.currentChartType = item.toLowerCase();
    if (ChartType.BAR == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.BAR);
    } else if (ChartType.DOUGHNUT == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.DOUGHNUT);
    } else if (ChartType.PIE == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.PIE);
    } else if (ChartType.BUBBLE == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.BUBBLE);
    } else if (ChartType.LINE == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.LINE);
    } else if (ChartType.POLAR == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.POLAR);
    } else if (ChartType.SCATTER == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.SCATTER);
    } else if (ChartType.RADAR == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.RADAR);
    } else if (ChartType.DYNAMIC == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.DYNAMIC);
    }
  }

  public getChart(timeInterval: string) {
    this.apiCallService.getChart(timeInterval).subscribe(
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

export enum Language {
  TR = 'TR',
  EN = 'EN'
}