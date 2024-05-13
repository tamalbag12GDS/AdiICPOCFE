import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
@Component({
  selector: 'app-d3-js',
  templateUrl: './d3-js.component.html',
  styleUrl: './d3-js.component.css',
})
export class D3JsComponent implements OnInit {
  private data: any[] = [];
  private svg: any;
  private width = 750;
  private height = 400;
  private radius!: number;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }
  private fetchData(): void {
    this.http.get<any[]>('https://localhost:8080/api/sample-chart').subscribe(
      (data) => {
        this.data = data;
        this.createSvg();
        this.drawPie();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  private createSvg(): void {
    this.radius = Math.min(this.width, this.height) / 2;
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);
  }

  private drawPie(): void {
    const pie = d3.pie().value((d: any) => d.values);
    const arc = d3.arc().innerRadius(0).outerRadius(this.radius);
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const arcs = this.svg
      .selectAll('arc')
      .data(pie(this.data[0].data))
      .enter()
      .append('g');

    arcs
      .append('path')
      .attr('d', <any>arc)
      .attr('fill', (d: any, i: any) => colors(i));

    arcs
      .append('text')
      .attr('transform', (d: any) => 'translate(' + arc.centroid(d) + ')')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.names);
  }
}
