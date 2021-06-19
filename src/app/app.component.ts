import { Component, OnInit } from '@angular/core';
import { Ng2ChartsWrapperComponent, Ng2ChartsWrapperService, MultiDataSetChartComponent, SingleDataSetComponent } from 'ng2-charts-wrapper';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { ApiCallService } from './apiCall.service';
import { ChartRequest } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
import { Chart, ChartType, TimeInterval, ChartUtils } from 'ng2-charts-wrapper';
// import { ChartUtils } from 'ng2-charts-wrapper';
import { concatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

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
  chartUtils!: ChartUtils;

  enumKeys: any[] = ['Daily', 'Weekly', 'Monthly'];
  chartKeys: any[] = ['Pie', 'Doughnut', 'Bar', 'Line'];
  timeIntervals: any = TimeInterval;
  chartTypes: any = ChartType;

  obj: any;
  singleDataSet$!: Observable<any>;

  language!: string;
  timeIntervalDropdown!: boolean;
  chartTypeDropdown!: boolean;

  selectedTimeInterval: string = 'Daily';
  selectedChartType: string = 'Line';

  translateService!: TranslateService;

  constructor(private apiCallService: ApiCallService, private spinner: NgxSpinnerService, translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
    this.translateService = translateService;
  } 

  ngOnInit(): void {
    this.chartUtils = new ChartUtils(this.translateService);
    this.getChart(this.selectedTimeInterval.toLowerCase(), 'multidataset');
    this.chart.currentChartType = this.chartUtils.getChartTypeLine();
    this.chart.currentChartTypeOptions = this.chartUtils.getChartTypeLineOptions();
    this.chart.chartColors = this.chartUtils.getMultiDataSetChartColors();
    this.language = 'EN';
    this.timeIntervalDropdown = false;
    this.chartTypeDropdown = false;
  }

  onChangeTimeInterval(item: string) {
    this.timeIntervalDropdown = !this.timeIntervalDropdown;
    this.selectedTimeInterval = item;

    if (this.selectedChartType == ChartType.BAR 
      || this.selectedChartType == ChartType.DOUGHNUT
      || this.selectedChartType == ChartType.PIE
    ) {
      this.chartUtils.fillGivenChartData(this.chart, this.obj);
    } else {
      if ('Daily' == item) {
        this.chart.chartDataSet = [];
        this.chartUtils.fillGivenChartDataSet(this.chart, this.obj, this.chartUtils.dailyTimeIntervalLabels ,this.chartUtils.getTimeIntervalDailyLabels());
      } else if ('Weekly' == item) {
        this.chart.chartDataSet = [];
        this.chartUtils.fillGivenChartDataSet(this.chart, this.obj, this.chartUtils.weeklyTimeIntervalLabels ,this.chartUtils.getTimeIntervalWeeklyLabels());
      } else if ('Monthly' == item) {
        this.chart.chartDataSet = [];
        this.chartUtils.fillGivenChartDataSet(this.chart, this.obj, this.chartUtils.monthlyTimeIntervalLabels ,this.chartUtils.getTimeIntervalMonthlyLabels());
      }
    }
  }

  onChangeChartType(item: string) {
    this.chartTypeDropdown = !this.chartTypeDropdown;
    this.selectedChartType = item;
    this.chart.currentChartType = item.toLowerCase();

    if (ChartType.BAR == item.toLowerCase()) {
      this.chart.currentChartType = this.chartUtils.getChartTypeBar();
      this.chart.currentChartTypeOptions = this.chartUtils.getChartTypeBarOptions();
      this.chart.chartColors = this.chartUtils.getSingleDataSetChartColors();
      this.chart.chartLabels = [];
      this.chart.chartData = [];

      this.chartTypeAndTimeInterval(ChartType.BAR);

    } else if (ChartType.DOUGHNUT == item.toLowerCase()) {
      this.chart.currentChartType = this.chartUtils.getChartTypeDoughnut();
      this.chart.currentChartTypeOptions = this.chartUtils.getChartTypeDoughnutOptions();
      this.chart.chartColors = this.chartUtils.getSingleDataSetChartColors();
      this.chart.chartLabels = [];
      this.chart.chartData = [];

      this.chartTypeAndTimeInterval(ChartType.DOUGHNUT);

    } else if (ChartType.PIE == item.toLowerCase()) {
      this.chart.currentChartType = this.chartUtils.getChartTypePie();
      this.chart.currentChartTypeOptions = this.chartUtils.getChartTypePieOptions();
      this.chart.chartColors = this.chartUtils.getSingleDataSetChartColors();
      this.chart.chartLabels = [];
      this.chart.chartData = [];

      this.chartTypeAndTimeInterval(ChartType.PIE);

    } else if (ChartType.BUBBLE == item.toLowerCase()) {
      this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(ChartType.BUBBLE);
    } else if (ChartType.LINE == item.toLowerCase()) {
      this.chart.currentChartType = this.chartUtils.getChartTypeLine();
      this.chart.currentChartTypeOptions = this.chartUtils.getChartTypeLineOptions();
      this.chart.chartColors = this.chartUtils.getMultiDataSetChartColors();
      this.chart.chartDataSet = [];

      this.chartTypeAndTimeInterval(ChartType.LINE);
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

  public chartTypeAndTimeInterval(chartType: ChartType) {

    if (this.selectedTimeInterval == 'Daily') {
      if (chartType == ChartType.BAR || chartType == ChartType.DOUGHNUT || chartType == ChartType.PIE) {
        this.getChart(this.selectedTimeInterval.toLowerCase(), 'singledataset');
      } else if (chartType == ChartType.LINE) {
        this.getChart(this.selectedTimeInterval.toLowerCase(), 'multidataset');
      }
    } else if (this.selectedTimeInterval == 'Weekly') {
      if (chartType == ChartType.BAR || chartType == ChartType.DOUGHNUT || chartType == ChartType.PIE) {
        this.getChart(this.selectedTimeInterval.toLowerCase(), 'singledataset');
      } else if (chartType == ChartType.LINE) {
        this.getChart(this.selectedTimeInterval.toLowerCase(), 'multidataset');
      }
    } else if (this.selectedTimeInterval == 'Monthly') {
      if (chartType == ChartType.BAR || chartType == ChartType.DOUGHNUT || chartType == ChartType.PIE) {
        this.getChart(this.selectedTimeInterval.toLowerCase(), 'singledataset');
      } else if (chartType == ChartType.LINE) {
        this.getChart(this.selectedTimeInterval.toLowerCase(), 'multidataset');
      }
    }
  }

  public getChart(timeInterval: string, chartTypeSet: string) {

    this.spinner.show();
    this.chart.isChartLoaded = false;

    this.apiCallService.getChart(timeInterval, chartTypeSet).subscribe(
      (payload) => {
        this.obj = payload;
      
        if (chartTypeSet == 'singledataset') {
          this.chartUtils.fillGivenChartData(this.chart, this.obj);
        } else if (chartTypeSet == 'multidataset') {
          if (timeInterval == 'daily') {
            this.chartUtils.fillGivenChartDataSet( this.chart, this.obj, this.chartUtils.dailyTimeIntervalLabels, this.chartUtils.getTimeIntervalDailyLabels(this.translateService));
          } else if (timeInterval == 'weekly') {
            this.chartUtils.fillGivenChartDataSet( this.chart, this.obj, this.chartUtils.weeklyTimeIntervalLabels, this.chartUtils.getTimeIntervalWeeklyLabels(this.translateService));
          } else if (timeInterval == 'monthly') {
            this.chartUtils.fillGivenChartDataSet( this.chart, this.obj, this.chartUtils.monthlyTimeIntervalLabels, this.chartUtils.getTimeIntervalMonthlyLabels());
          }
        }
      },
      err => {},
      () => {
        this.chart.isChartLoaded = true;
        this.spinner.hide();
      }
    )
    
    return this.singleDataSet;
  }

  public onChangeLanguage() {
    this.ngOnInit();
  }
}

export enum Language {
  TR = 'TR',
  EN = 'EN'
}