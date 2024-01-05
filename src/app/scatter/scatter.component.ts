import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
// Adopted from Scatterplot example on D3 Graph Gallery:
// https://www.d3-graph-gallery.com/graph/scatter_tooltip.html

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent implements OnInit {
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

//   ngOnInit(): void {
//     this.createSvg();
//     d3.csv("/assets/frameworks.csv").then(data => this.drawPlot(data));
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
    this.drawPlot(chartData);
});
}

  private createSvg(): void {
    this.svg = d3.select("figure#scatter")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawPlot(data: any[]): void {
    // Add X axis
    const x = d3.scaleLinear()
    .domain([2009, 2017])
    .range([ 0, this.width ]);
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([ this.height, 0]);
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // Add dots
    const dots = this.svg.append('g');
    dots.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d: any) => x(d.Released))
    .attr("cy",  (d: any) => y(d.Stars))
    .attr("r", 7)
    .style("opacity", .5)
    .style("fill", "#69b3a2");

    // Add labels
    dots.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text( (d: any) => d.Framework)
    .attr("x", (d: any) => x(d.Released))
    .attr("y", (d: any)  => y(d.Stars))
}
}
