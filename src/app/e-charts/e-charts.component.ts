import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as echarts from 'echarts';
import ECharts = echarts.ECharts;

@Component({
  selector: 'app-e-charts',
  templateUrl: './e-charts.component.html',
  styleUrl: './e-charts.component.css',
})
export class EChartsComponent implements AfterViewInit, OnDestroy {
  // @ViewChild('chartContainer') chartContainer: ElementRef;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  myChart: ECharts | undefined;
  data: any;
  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.getDataFromAPI();
    window.addEventListener('resize', this.resizeChart);
  }

  getDataFromAPI(): void {
    this.http.get<any>('https://localhost:8080/api/sample-chart').subscribe(
      (response) => {
        this.data = response;
        this.initChart();
        console.log(this.data);
        console.log(this.data.data.map((e: any) => e.name));
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  private initChart(): void {
    const dom = this.chartContainer.nativeElement;
    this.myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    });
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        data: this.data.data.map((e: any) => e.name),
        // data: [
        //   'Direct',
        //   'Marketing',
        //   'Search Engine',
        //   'Email',
        //   'Union Ads',
        //   'Video Ads',
        //   'Baidu',
        //   'Google',
        //   'Bing',
        //   'Others',
        // ],
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          label: {
            position: 'inner',
            fontSize: 14,
          },
          labelLine: {
            show: false,
          },
          // data: [
          //   { value: 1548, label: 'Search Engine' },
          //   { value: 775, label: 'Direct' },
          //   { value: 679, label: 'Marketing', selected: true },
          // ],
          data: this.data.data.slice(0, 3),
        },
        {
          name: 'Access From',
          type: 'pie',
          radius: ['45%', '60%'],
          labelLine: {
            length: 30,
          },
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,

            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                align: 'center',
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0,
              },
              b: {
                color: '#4C5058',
                fontSize: 14,
                fontWeight: 'bold',
                lineHeight: 33,
              },
              per: {
                color: '#fff',
                backgroundColor: '#4C5058',
                padding: [3, 4],
                borderRadius: 4,
              },
            },
          },
          // data: [
          //   { value: 1048, name: 'Baidu' },
          //   { value: 335, name: 'Direct' },
          //   { value: 310, name: 'Email' },
          //   { value: 251, name: 'Google' },
          //   { value: 234, name: 'Union Ads' },
          //   { value: 147, name: 'Bing' },
          //   { value: 135, name: 'Video Ads' },
          //   { value: 102, name: 'Others' },
          // ],
          data: this.data.data,
        },
      ],
    };

    this.myChart.setOption(option);
  }

  private resizeChart = () => {
    if (this.myChart) {
      this.myChart.resize();
    }
  };

  ngOnDestroy(): void {
    if (this.myChart) {
      window.removeEventListener('resize', this.resizeChart);
      this.myChart.dispose();
    }
  }
}
