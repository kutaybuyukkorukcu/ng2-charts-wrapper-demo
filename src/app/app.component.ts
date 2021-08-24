import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { ApiCallService } from './apiCall.service';
import { Chart, ChartType, ChartUtils, TimeInterval } from 'ng2-charts-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ng-charts';

  isSingleDataSetChartPresent: boolean = true;
  isMultiDataSetChartPresent: boolean = true;

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
  selectedChartType = new BehaviorSubject(ChartType.PIE);
  translateService!: TranslateService;
  
  filteredWeeks: any;

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
      TimeInterval.DAILY,
      this.chartUtils.getSingleDataSetChartColors() 
    );


      const currentYear: number = new Date().getFullYear();
      const currentMonth: number = new Date().getMonth();

      const weeks: any[] = [],
        firstDate: Date = new Date(currentYear, currentMonth, 1),
        lastDate: Date = new Date(currentYear, currentMonth + 1, 0),
        numDays: number = lastDate.getDate();
    
      let dayOfWeekCounter = firstDate.getDay();
    
      for (let date = 1; date <= numDays; date++) {
        if (dayOfWeekCounter === 0 || weeks.length === 0) {
          weeks.push([]);
        }
        weeks[weeks.length - 1].push(date);
        dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
      }
    
      this.filteredWeeks = weeks
        .filter((w) => !!w.length);

    this.getChart(this.selectedTimeInterval, this.selectedChartType.value);
  }

  ngAfterViewInit(): void {

    let controlDropdownClicks: Observable<any>[] = this.onChangeDropdowns
      .map((onChangeDropdown: ElementRef) => fromEvent(onChangeDropdown.nativeElement, 'click'));

    this.selectedChartType.subscribe(val => {
      const dataset = this.isChartTypeSingleOrMultiDataSet(val);

      this.isSingleDataSetChartPresent = dataset == DataSetType.SINGLE_DATASET ? true : false;
      this.isMultiDataSetChartPresent = dataset == DataSetType.MULTI_DATASET ? true : false;
    });
  }

  onChangeTimeInterval(item: TimeInterval) {
    this.timeIntervalDropdown = !this.timeIntervalDropdown;
    this.selectedTimeInterval = item;
    this.chart.currentTimeInterval = item;

    this.chart.chartData = [];
    this.chart.chartDataSet = [];
    
    this.getChart(item, this.selectedChartType.value);
  }

  onChangeChartType(item: ChartType) {
    this.chartTypeDropdown = !this.chartTypeDropdown;
    this.selectedChartType.next(item);
    
    this.chart.currentChartType = item;
    this.chart.currentChartTypeOptions = this.chartUtils.getCurrentChartTypeOptions(item);
    
    if (item == ChartType.BAR || 
      item == ChartType.PIE || 
      item == ChartType.DOUGHNUT
    ) {
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

        this.chart = this.chartUtils.resetChartByChartType(this.chart, chartType);
      
        if (datasetType == DataSetType.SINGLE_DATASET) {
          this.chartUtils.fillGivenChartData(this.chart, this.chartResponse);
        } else if (datasetType == DataSetType.MULTI_DATASET) {
          if (timeInterval == TimeInterval.DAILY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, this.chartResponse, this.chartUtils.dailyTimeIntervalLabels, this.chartUtils.getTimeIntervalDailyLabels(this.translateService));
          } else if (timeInterval == TimeInterval.WEEKLY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, this.chartResponse, this.chartUtils.weeklyTimeIntervalLabels, this.chartUtils.getTimeIntervalWeeklyLabels(this.translateService));
          } else if (timeInterval == TimeInterval.MONTHLY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, this.chartResponse, this.chartUtils.monthlyTimeIntervalLabels, this.chartUtils.getTimeIntervalMonthlyLabels(this.translateService));
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

    this.preferredLanguage = language;
    this.selectedChartType.next(ChartType.PIE);
    this.selectedTimeInterval = TimeInterval.DAILY;
    
    this.chart = new Chart(
      this.chartUtils.getChartTypePie(),
      this.chartUtils.getChartTypePieOptions(),
      this.chart.currentTimeInterval,
      this.chartUtils.getSingleDataSetChartColors() 
    );

    this.getChart(TimeInterval.DAILY, ChartType.PIE);
    
    this.translateService.use(language.toLowerCase());
  }

  public isChartTypeSingleOrMultiDataSet(chartType?: ChartType): DataSetType {

    if (chartType == ChartType.PIE || 
      chartType == ChartType.BAR || 
      chartType == ChartType.DOUGHNUT
    ) {
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