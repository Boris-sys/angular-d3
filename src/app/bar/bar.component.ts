import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {
  private svg:any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

//   ngOnInit(): void {
//     const svg = this.createSvg();
//     d3.csv("/assets/frameworks.csv").then(data => this.drawBars(data));
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
    this.drawBars(chartData);
});
}

private createSvg(): void {
  this.svg = d3.select("figure#bar")
  .append("svg")
  .attr("width", this.width + (this.margin * 2))
  .attr("height", this.height + (this.margin * 2))
  .append("g")
  .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}

private drawBars(data: any[]): void {
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.Framework))
  .padding(0.2);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 200000])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: any) => x(d.Framework))
  .attr("y", (d: any) => y(d.Stars))
  .attr("width", x.bandwidth())
  .attr("height", (d: any) => this.height - y(d.Stars))
  .attr("fill", "#d04a35");
}
}
