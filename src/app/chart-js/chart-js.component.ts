import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-js',
  templateUrl: './chart-js.component.html',
  styleUrl: './chart-js.component.css',
})
export class ChartJsComponent implements OnInit {
  data: any = [];
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        label: 'My First Dataset',
        data: this.data.data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.getDataFromAPI();
  }

  getDataFromAPI(): void {
    this.http.get<any>('https://localhost:8080/api/sample-chart').subscribe(
      (response) => {
        this.data = response;
        this.chartData.labels = this.data.data.map((e: any) => e.name);
        this.chartData.datasets[0].data = this.data.data;
        console.log(this.data);
        console.log(this.data.data.map((e: any) => e.name));
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
