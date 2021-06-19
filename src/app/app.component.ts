import { Component, OnInit } from '@angular/core';
import { Ng2ChartsWrapperComponent, Ng2ChartsWrapperService, MultiDataSetChartComponent, SingleDataSetComponent } from 'ng2-charts-wrapper';
import { Observable } from 'rxjs';
import { ApiCallService } from './apiCall.service';
import { ChartRequest } from 'ng2-charts-wrapper';
import MultiDataSetChartResponse = ChartRequest.MultiDataSetChartResponse;
import SingleDataSetChartResponse = ChartRequest.SingleDataSetChartResponse;
import { Chart, ChartType, TimeInterval, SingleOrMultiDataSetWithLabel } from 'ng2-charts-wrapper';
import { ChartUtils } from 'ng2-charts-wrapper';
import { concatMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { SingleDataSet, Label, Color } from 'ng2-charts';
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
  chartKeys: any[] = ['Pie', 'Doughnut', 'Bar'];
  timeIntervals: any = TimeInterval;
  chartTypes: any = ChartType;

  obj: any;
  singleDataSet$!: Observable<any>;

  language!: string;
  timeIntervalDropdown!: boolean;
  chartTypeDropdown!: boolean;

  selectedTimeInterval: string = 'Weekly';
  selectedChartType: string = 'Line';

  translate: TranslateService;

  constructor(private apiCallService: ApiCallService, private spinner: NgxSpinnerService, translateService: TranslateService) {
    // this.translateService = translateService;
    translateService.setDefaultLang('en');
    translateService.use('en');
    this.translate = translateService;
  } 

  ngOnInit(): void {
    this.chartUtils = new ChartUtils(this.translate);
    this.getChart(this.selectedTimeInterval.toLowerCase());
    this.chart.currentChartType = this.chartUtils.getChartTypeLine();
    this.chart.currentChartTypeOptions = this.chartUtils.getChartTypeLineOptions();
    // this.chart.chartColors = this.chartUtils.getSingleDataSetChartColors();
    this.chart.chartColors = this.chartUtils.getMultiDataSetChartColors();
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

    this.spinner.show();
    this.chart.isChartLoaded = false;

    this.apiCallService.getChart(timeInterval).subscribe(
      (payload) => {
        this.obj = payload;
        // this.chartUtils.fillGivenChartData(this.chart, this.obj);
        this.fillGivenChartDataSet( this.chart, this.obj, this.weeklyTimeIntervalLabels, this.getTimeIntervalWeeklyLabels(this.translate) );
      },
      err => {},
      () => {
        this.chart.isChartLoaded = true;
        this.spinner.hide();
      }
    )
    
    return this.singleDataSet;
  }
  
  public singledatasetBuilder() {
    const data = this.apiCallService.getChartDataSet('singledataset');
  }

  public multidatasetBuilder() {
    const data = this.apiCallService.getChartDataSet('multidataset');
  }

  public onChangeLanguage() {
    this.ngOnInit();
  }

  fillGivenChartDataSet(chart: Chart, multiDataSetChartResponse: MultiDataSetChartResponse[], timeIntervalFields: number[], timeIntervalLabels: Label[]) {
    let isTimeIntervalPresent = false;
    let singleDataSet: SingleDataSet = [];


    multiDataSetChartResponse.forEach((chartDataSet: MultiDataSetChartResponse) => {

        singleDataSet = [];
        timeIntervalFields.forEach((timeInterval) => {
            isTimeIntervalPresent = false;
            chartDataSet.multiDataSet.forEach((item) => {
                if (timeInterval == item.data) {
                    singleDataSet.push(item.timeInterval);
                    isTimeIntervalPresent = true;
                }
            });

            if (isTimeIntervalPresent == false) {
                singleDataSet.push(0);
            }
        });

        chart.chartDataSet.push(new SingleOrMultiDataSetWithLabel(singleDataSet, chartDataSet.label));
    });

    chart.chartLabels = timeIntervalLabels;
    chart.isChartLoaded = true;
  }

  weeklyTimeIntervalLabels: number[] = this.getWeeklyTimeIntervalLabels();

  public getWeeklyTimeIntervalLabels(): number[] {
      let aDayInMilliseconds = 24 * 60 * 60 * 1000;
      let datesOfAWeek = [];
      let currentDate = new Date();
      let monday = new Date(currentDate.getTime() - (currentDate.getDay() - 1) * aDayInMilliseconds);
      let sunday = new Date(monday.getTime() + 6 * aDayInMilliseconds);
      datesOfAWeek.push(monday.getDate());
      for (let i = 1; i < 6; i++){
          datesOfAWeek.push(new Date(monday.getTime() + i * aDayInMilliseconds).getDate());
      }
      datesOfAWeek.push(sunday.getDate());
      return datesOfAWeek;
  }

  public getTimeIntervalWeeklyLabels(translate?: TranslateService): Label[] {
        
    let daysOfAWeek: Label[] = [
        'timeInterval.week.monday',
        'timeInterval.week.tuesday',
        'timeInterval.week.wednesday',
        'timeInterval.week.thursday',
        'timeInterval.week.friday',
        'timeInterval.week.saturday',
        'timeInterval.week.sunday'
    ];
    let weeks: Label[] = [];

    daysOfAWeek.forEach(item => {
        weeks.push(
            translate != undefined ? translate.instant(item) : this.translate.instant(item)
        );
    })

    return weeks;
}
}

export enum Language {
  TR = 'TR',
  EN = 'EN'
}