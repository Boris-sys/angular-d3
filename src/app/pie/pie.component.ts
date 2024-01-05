import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
// Adopted from Basic pie chart example on D3 Graph Gallery:
// https://www.d3-graph-gallery.com/graph/pie_basic.html

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;  constructor() { }

  // ngOnInit(): void {
  //   this.createSvg();
    
  //   d3.csv("/assets/frameworks.csv").then(data => this.createColors(data));
  //   d3.csv("/assets/frameworks.csv").then(data => this.drawChart(data));
  // }


  ngOnInit(): void {
    this.createSvg();
    // Fetch JSON from an external endpoint
    type ChartDataType ={
      Framework: string,
      Stars: number,
      Released: number
    }
     d3.json('https://json.extendsclass.com/bin/6d2e8e7128ed').then(data=> {
      const chartData = data as ChartDataType[];
      this.createColors(chartData);
      this.drawChart(chartData);
  });
}

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}
private createColors(data: any[]): void {
  this.colors = d3.scaleOrdinal()
  .domain(data.map(d => d.Stars.toString()))
  .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
}
private drawChart(data: any[]): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('text')
  .text((d: any)=> d.data.Framework)
  .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}

}

