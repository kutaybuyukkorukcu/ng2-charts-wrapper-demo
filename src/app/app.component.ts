import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Ng2ChartsWrapperComponent, Ng2ChartsWrapperService, MultiDataSetChartComponent, SingleDataSetComponent } from 'ng2-charts-wrapper';
import { ApiCallService } from './apiCall.service';
import { ChartRequest } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
import { Chart, ChartType, TimeInterval, ChartUtils } from 'ng2-charts-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common'
import { BehaviorSubject, Observable, VirtualTimeScheduler, fromEvent, merge } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ng-ready-charts';

  singleDataSet!: SingleDataSetChartResponse;
  multiDataSet!: MultiDataSetChartResponse;

  isSingleDataSetChartPresent: boolean = true;

  TimeInterval: typeof TimeInterval = TimeInterval;
  Language: typeof Language = Language;
  ChartType: typeof ChartType = ChartType;
  chart: Chart = new Chart();
  chartUtils!: ChartUtils;

  enumKeys: TimeInterval[] = [TimeInterval.DAILY, TimeInterval.WEEKLY, TimeInterval.MONTHLY];
  chartKeys: ChartType[] = [ChartType.PIE, ChartType.DOUGHNUT, ChartType.BAR, ChartType.LINE];
  
  chartResponse!: any;

  singleDataSet$!: Observable<any>;

  preferredLanguage: Language = Language.EN;
  timeIntervalDropdown: boolean = false;
  chartTypeDropdown: boolean = false;

  selectedTimeInterval: TimeInterval = TimeInterval.DAILY;
  selectedChartType: ChartType = ChartType.PIE;

  translateService!: TranslateService;

  @ViewChild(SingleDataSetComponent, { static : false}) singleDataSetChart!: ElementRef;
  @ViewChild(MultiDataSetChartComponent, { static : false}) multiDataSetChart!: ElementRef;

  @ViewChildren('onChangeDropdowns', { read: ElementRef }) onChangeDropdowns!: ElementRef[];

  constructor(private apiCallService: ApiCallService, private spinner: NgxSpinnerService, translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
    this.translateService = translateService;
  }

  ngOnInit(): void {
    this.chartUtils = new ChartUtils(this.translateService);
    
    this.chart = new Chart(
      this.chartUtils.getChartTypePie(),
      this.chartUtils.getChartTypePieOptions(),
      this.chartUtils.getSingleDataSetChartColors() 
    );

    this.getChart(this.selectedTimeInterval, this.selectedChartType);
  }

  ngAfterViewInit(): void {

    let controlDropdownClicks: Observable<any>[] = this.onChangeDropdowns
      .map((onChangeDropdown: ElementRef) => fromEvent(onChangeDropdown.nativeElement, 'click'));

  }

  onChangeTimeInterval(item: TimeInterval) {
    this.timeIntervalDropdown = !this.timeIntervalDropdown;
    this.selectedTimeInterval = item;

    this.chart.chartData = [];
    this.chart.chartDataSet = [];
    
    this.getChart(item, this.selectedChartType);
  }

  onChangeChartType(item: ChartType) {
    this.chartTypeDropdown = !this.chartTypeDropdown;
    this.selectedChartType = item;
    
    this.chart.currentChartType = item;
    this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(item);
    
    if (item == ChartType.BAR || ChartType.PIE || ChartType.DOUGHNUT) {
      this.chart.chartColors = this.chartUtils.getSingleDataSetChartColors();
    } else {
      this.chart.chartColors = this.chartUtils.getMultiDataSetChartColors();
    }

    this.chart.chartData = [];
    this.chart.chartDataSet = [];

    this.getChart(this.selectedTimeInterval, item);
  }

  public getChart(timeInterval: TimeInterval, chartType: ChartType) {

    this.spinner.show();
    this.chart.isChartLoaded = false;

    const datasetType = this.isChartTypeSingleOrMultiDataSet(chartType);

    this.apiCallService.getChart(timeInterval, datasetType).subscribe(
      (payload) => {
        this.chartResponse = payload;
      
        if (datasetType == DataSetType.SINGLE_DATASET) {
          this.chartUtils.fillGivenChartData(this.chart, this.chartResponse);
        } else if (datasetType == DataSetType.MULTI_DATASET) {
          if (timeInterval == TimeInterval.DAILY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, this.chartResponse, this.chartUtils.dailyTimeIntervalLabels, this.chartUtils.getTimeIntervalDailyLabels(this.translateService));
          } else if (timeInterval == TimeInterval.WEEKLY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, this.chartResponse, this.chartUtils.weeklyTimeIntervalLabels, this.chartUtils.getTimeIntervalWeeklyLabels(this.translateService));
          } else if (timeInterval == TimeInterval.MONTHLY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, this.chartResponse, this.chartUtils.monthlyTimeIntervalLabels, this.chartUtils.getTimeIntervalMonthlyLabels());
          }
        }
      },
      err => {},
      () => {
        this.chart.isChartLoaded = true;
        this.spinner.hide();
      }
    )
  }

  public onChangeLanguage(language: Language) {
    this.ngOnInit();
  }

  public isChartTypeSingleOrMultiDataSet(chartType?: ChartType): DataSetType {

    if (chartType == ChartType.PIE || ChartType.BAR || ChartType.DOUGHNUT) {
      return DataSetType.SINGLE_DATASET;
    }

    return DataSetType.MULTI_DATASET;
  }
}

export enum Language {
  TR = 'TR',
  EN = 'EN'
}

export enum DataSetType {
  SINGLE_DATASET = 'singledataset',
  MULTI_DATASET = 'multidataset'
}