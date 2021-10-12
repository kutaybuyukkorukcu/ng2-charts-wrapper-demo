import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { ApiCallService } from './apiCall.service';
import { Chart, ChartType, ChartUtils, TimeInterval, ChartRequest } from 'ng2-charts-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  isSingleDataSetChartPresent: boolean = true;
  isMultiDataSetChartPresent: boolean = true;

  TimeInterval: typeof TimeInterval = TimeInterval;
  Language: typeof Language = Language;
  ChartType: typeof ChartType = ChartType;
  chart: Chart = new Chart();
  chartUtils!: ChartUtils;

  enumKeys: TimeInterval[] = [TimeInterval.DAILY, TimeInterval.WEEKLY, TimeInterval.MONTHLY];
  chartKeys: ChartType[] = [ChartType.PIE, ChartType.DOUGHNUT, ChartType.BAR, ChartType.LINE];

  singleDataSet$!: Observable<any>;

  preferredLanguage: Language = Language.EN;
  timeIntervalDropdown: boolean = false;
  chartTypeDropdown: boolean = false;

  selectedTimeInterval: TimeInterval = TimeInterval.DAILY;
  selectedChartType = new BehaviorSubject(ChartType.PIE);
  
  filteredWeeks: any;

  @ViewChildren('onChangeDropdowns', { read: ElementRef }) onChangeDropdowns!: ElementRef[];

  constructor(private apiCallService: ApiCallService, private spinner: NgxSpinnerService, public translateService: TranslateService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {

    const languageCode = this.getBrowserLanguage(true);
    if (languageCode == Language.EN.toLowerCase()) {
      this.preferredLanguage = Language.EN;
    } else if (languageCode == Language.TR.toLowerCase()) {
      this.preferredLanguage = Language.TR;
    }

    this.translateService.setDefaultLang(languageCode);
    this.translateService.use(languageCode);

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

    this.getChart();
  }

  ngAfterViewInit(): void {

    let controlDropdownClicks: Observable<any>[] = this.onChangeDropdowns
      .map((onChangeDropdown: ElementRef) => fromEvent(onChangeDropdown.nativeElement, 'click'));

    this.selectedChartType
      .pipe(take(1))
      .subscribe(val => {
      const dataset = this.isChartTypeSingleOrMultiDataSet(val);

      this.isSingleDataSetChartPresent = dataset == DataSetType.SINGLE_DATASET ? true : false;
      this.isMultiDataSetChartPresent = dataset == DataSetType.MULTI_DATASET ? true : false;
      this.cdRef.detectChanges();
    });
  }

  onChangeTimeInterval(item: TimeInterval) {
    this.timeIntervalDropdown = !this.timeIntervalDropdown;
    this.selectedTimeInterval = item;
    this.chart.currentTimeInterval = item;

    this.chart.chartData = [];
    this.chart.chartDataSet = [];
    
    this.getChart();
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

    this.getChart();
  }

  public getChart() {

    this.spinner.show();
    this.chart.isChartLoaded = false;

    const datasetType: DataSetType = this.isChartTypeSingleOrMultiDataSet(this.selectedChartType.value);

    this.apiCallService
      .getChart(this.selectedTimeInterval, datasetType)
      .pipe(take(1))
      .subscribe(
      (payload: SingleDataSetChartResponse | MultiDataSetChartResponse[]) => {

        this.chart = this.chartUtils.resetChartByChartType(this.chart, this.selectedChartType.value);
      
        if (datasetType == DataSetType.SINGLE_DATASET) {
          this.chartUtils.fillGivenChartData(this.chart, (payload as SingleDataSetChartResponse));
        } else if (datasetType == DataSetType.MULTI_DATASET) {
          if (this.selectedTimeInterval == TimeInterval.DAILY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, (payload as MultiDataSetChartResponse[]), this.chartUtils.dailyTimeIntervalLabels, this.chartUtils.getTimeIntervalDailyLabels(this.translateService));
          } else if (this.selectedTimeInterval == TimeInterval.WEEKLY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, (payload as MultiDataSetChartResponse[]), this.chartUtils.weeklyTimeIntervalLabels, this.chartUtils.getTimeIntervalWeeklyLabels(this.translateService));
          } else if (this.selectedTimeInterval == TimeInterval.MONTHLY) {
            this.chartUtils.fillGivenChartDataSet(this.chart, (payload as MultiDataSetChartResponse[]), this.chartUtils.monthlyTimeIntervalLabels, this.chartUtils.getTimeIntervalMonthlyLabels(this.translateService));
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
    
    this.chart = new Chart(
      this.chartUtils.getChartTypePie(),
      this.chartUtils.getChartTypePieOptions(),
      this.chart.currentTimeInterval,
      this.chartUtils.getSingleDataSetChartColors() 
    );

    this.getChart();
    
    this.translateService.use(language.toLowerCase());
  }

  public getBrowserLanguage(returnOnlyCode: boolean): string {
    if (navigator.languages != undefined) 
      return returnOnlyCode == true ? navigator.languages[1].split('-')[0] : navigator.languages[0];
    return returnOnlyCode == true ? navigator.language.split('-')[0] : navigator.language;
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