import { SingleDataSet, Label, SingleOrMultiDataSet, Color } from 'ng2-charts';
import { ChartUtils, getChartTypePie, getChartTypePieOptions, getSingleDataSetChartColors} from 'ng2-charts-wrapper';

export enum TimeInterval {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTER_1 = 'QUARTER_1',
    QUARTER_2 = 'QUARTER_2',
    QUARTER_3 = 'QUARTER_3',
    QUARTER_4 = 'QUARTER_4',
    CUSTOM = 'CUSTOM'
}

export enum ChartType {
    PIE = 'pie',
    DOUGHNUT = 'doughnut',
    BAR = 'bar',
    LINE = 'line',
    RADAR = 'radar',
    POLAR = 'polarArea',
    BUBBLE = 'bubble',
    SCATTER = 'scatter',
    DYNAMIC = 'dynamic'
}

export class Chart {
    isChartLoaded: boolean;
    currentChartType: any;
    currentChartTypeOptions: any;
    chartColors: Color[];
    chartLabels: Label[];

    chartData: SingleOrMultiDataSet;
    chartDataSet: SingleOrMultiDataSetWithLabel[];

    constructor(
        currentChartType?: ChartType,
        currentChartTypeOptions?: any,
        chartColors?: Color[],
        chartLabels?: Label[]
    ) {
        this.isChartLoaded = false;
        this.currentChartType = currentChartType || getChartTypePie();
        this.currentChartTypeOptions = currentChartTypeOptions || getChartTypePieOptions();
        this.chartColors = chartColors || getSingleDataSetChartColors();
        this.chartLabels = chartLabels || [];
        this.chartData = [];
        this.chartDataSet = [];
    }
}

export class SingleOrMultiDataSetWithLabel {
    data: SingleDataSet
    label: string

    constructor(data?: SingleDataSet, label?: string) {
        this.data = data || [];
        this.label = label || '';
    }
}