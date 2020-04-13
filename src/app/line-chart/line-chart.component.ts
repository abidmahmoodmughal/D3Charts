import { Component, OnInit } from '@angular/core';


import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';

import * as d31 from 'd3';

import * as moment from 'moment';

import *  as  data from '../../assets/new.json';

@Component({
	selector: 'app-line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: ['./line-chart.component.css']
})


export class LineChartComponent implements OnInit {


	title = 'Line Chart';
	selected = 0;
	data: any[] = data.points;
	selectedTimeOption = 60;


	private margin = { top: 20, right: 20, bottom: 110, left: 40 };
	private margin2 = { top: 430, right: 20, bottom: 30, left: 40 };
	private width: number;
	private height: number;
	private height2: number;

	private x: any;
	private x2: any;
	private y: any;
	private y2: any;
	private svg: any;
	private xAxis: any;
	private xAxis2: any;
	private yAxis: any;


	private context: any;
	private brush: any;
	private zoom: any;
	private area2: d3Shape.Area<[number, number]>;
	private focus: any;


	private line: d3Shape.Line<[number, number]>; // this is line defination
	private area: d3Shape.Area<[number, number]>; // this is line defination  

	private svgClosedBar:any;
	private xClosedBar: any;
	private x2ClosedBar: any;
	private yClosedBar: any;
	private y2ClosedBar: any;
	
	private xAxisClosedBar: any;
	private xAxis2ClosedBar: any;
	private yAxisClosedBar: any;


	private contextClosedBar: any;
	private brushClosedBar: any;
	private zoomClosedBar: any;
	private area2ClosedBar: d3Shape.Area<[number, number]>;
	private focusClosedBar: any;


	private lineClosedBar: d3Shape.Line<[number, number]>; // this is line defination
	private areaClosedBar: d3Shape.Area<[number, number]>; // this is line defination


	constructor() {
		// configure margins and width/height of the graph  

		this.width = 960 - this.margin.left - this.margin.right;
		this.height = 500 - this.margin.top - this.margin.bottom;
		this.height2 = 500 - this.margin2.top - this.margin2.bottom;
	}

	ngOnInit() {
		console.log(this.selected)
		this.buildSvg();
		this.addXandYAxis();
		this.drawLineAndPath();

		this.addXandYAxisClosedBar();
		this.drawLineAndPathClosedBar();
	}

	onChangeObj(newObj) {
		//console.log(newObj);
		this.selected = parseInt(newObj.target.value);
		
		d3.selectAll("svg").remove();
		
		var svg = d3.select("app-line-chart").append("svg").attr("id","areaLineChartSVG").attr("width", "960").attr("height", "560"),
			inner = svg.append("g");

		 svg = d3.select("app-line-chart").append("svg").attr("id","closedBarChartSVG").attr("width", "960").attr("height", "560"),

		this.buildSvg();
		this.addXandYAxis();
		this.drawLineAndPath();

		this.addXandYAxisClosedBar();
		this.drawLineAndPathClosedBar();
	}

	onChangeObjTimeDropDown(newObj){		
		this.selectedTimeOption = parseInt(newObj.target.value);
		
		if(this.selectedTimeOption===10 ||this.selectedTimeOption===30){
			this.data = data.points.slice(0,this.selectedTimeOption);
		}
		else if(this.selectedTimeOption===60){
			this.data = data.points;
		}
		
		d3.selectAll("svg").remove();
		
		var svg = d3.select("app-line-chart").append("svg").attr("id","areaLineChartSVG").attr("width", "960").attr("height", "560"),
			inner = svg.append("g");

		 svg = d3.select("app-line-chart").append("svg").attr("id","closedBarChartSVG").attr("width", "960").attr("height", "560"),

		this.buildSvg();
		this.addXandYAxis();
		this.drawLineAndPath();
		
		this.addXandYAxisClosedBar();
		this.drawLineAndPathClosedBar();
	}

	private buildSvg() {
		
		this.svg = d3.select('#areaLineChartSVG')
			.style("stroke", "#000")
			.style("fill", "#4682b3");

			this.svgClosedBar = d3.select('#closedBarChartSVG')
			.style("stroke", "#000")
			.style("fill", "#4682b3");
	}
	private addXandYAxis() {
		// range of data configuring  
		this.x = d3Scale.scaleTime().range([0, this.width]);

		this.x2 = d3Scale.scaleTime().range([0, this.width]);

		this.y = d3Scale.scaleLinear().range([this.height, 0]);

		this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);

		// Configure the X Axis 
		// chart axis
		this.xAxis = d3Axis.axisBottom(this.x).tickFormat(d31.timeFormat("%H:%M:%S"));
		// brush axis
		this.xAxis2 = d3Axis.axisBottom(this.x2).tickFormat(d31.timeFormat("%H:%M:%S"));

		this.yAxis = d3Axis.axisLeft(this.y);

		// Configure the Y Axis  

		this.brush = d3Brush.brushX()
			.extent([[0, 0], [this.width, this.height2]])
			.on('brush end', this.brushed.bind(this));

		this.zoom = d3Zoom.zoom()
			.scaleExtent([1, Infinity])
			.translateExtent([[0, 0], [this.width, this.height]])
			.extent([[0, 0], [this.width, this.height]])
			.on('zoom', this.zoomed.bind(this));

		var inputDateFormat = d31.timeParse("%a %b %d %Y %H:%M:%S");

		/*
		this.area = d3Shape.area()
			.curve(d3Shape.curveMonotoneX)
			.x((d: any) => this.x(moment(inputDateFormat(data.starttime), "hh:00:00")
				.add(d.time, 'minutes'))
			)
			.y0(this.height)
			.y1((d: any) => this.y(d["Array"][this.selected]));

		this.area2 = d3Shape.area()
			.curve(d3Shape.curveMonotoneX)
			.x((d: any) => this.x2(moment(inputDateFormat(data.starttime), "hh:00:00")
				.add(d.time, 'minutes')))
			.y0(this.height2)
			.y1((d: any) => this.y2(d["Array"][this.selected]));
			*/

		this.svg.append('defs').append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('width', this.width)
			.attr('height', this.height);

		this.focus = this.svg.append('g')
			.attr('class', 'focus')
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

		this.context = this.svg.append('g')
			.attr('class', 'context')
			.attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');
	}

	private brushed() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
		let s = d3.event.selection || this.x2.range();
		this.x.domain(s.map(this.x2.invert, this.x2));
		
		this.focus.selectAll('.bars').remove();//.attr('d', this.area);
		// re generate bars
		var inputDateFormat = d31.timeParse("%a %b %d %Y %H:%M:%S"); 
		this.focus.append("g").selectAll(".barsG")//.append("g")
		.data(this.data).enter().append("rect")
		.attr("x",(d:any)=>{
			return this.x(moment(inputDateFormat(data.starttime), "hh:00:00")
			.add(d.time, 'minutes'));
		})
		.attr("y",(d:any)=>{
			return this.y(d["Array"][this.selected]);
		})
		.attr("class","bars")
		.attr("height",(d:any)=>{
			console.log("this.height "+this.height+"  this.y(d[Array][this.selected] => "+this.y(d["Array"][this.selected]));
			return this.height-this.y(d["Array"][this.selected]);
		})
		.style("fill", "steelblue")
		.style("width", this.width/this.data.length);

		this.focus.select('.axis--x').call(this.xAxis);
		this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
			.scale(this.width / (s[1] - s[0]))
			.translate(-s[0], 0));
	}

	private zoomed() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
		let t = d3.event.transform;
		this.x.domain(t.rescaleX(this.x2).domain());
		this.focus.select('.area').attr('d', this.area);
		this.focus.select('.axis--x').call(this.xAxis);
		this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
	}

	private drawLineAndPath() {

		var inputDateFormat = d31.timeParse("%a %b %d %Y %H:%M:%S");  // Wed Apr 01 2020 15:30:00 GMT-0500 (Eastern Daylight Time)

        var endDate = inputDateFormat(data.starttime);
		endDate.setMinutes(endDate.getMinutes()+this.selectedTimeOption);

		this.x.domain([inputDateFormat(data.starttime), endDate]);
		
		this.y.domain([0, d3Array.max(this.data, (d: any) => { return d["Array"][this.selected]; })])

		this.x2.domain(this.x.domain());
		this.y2.domain(this.y.domain());
		
		// create bars
		this.focus.append("g").selectAll(".barsG")//.append("g")
		.data(this.data).enter().append("rect")
		.attr("x",(d:any)=>{
			return this.x(moment(inputDateFormat(data.starttime), "hh:00:00")
			.add(d.time, 'minutes'));
		})
		.attr("y",(d:any)=>{
			return this.y(d["Array"][this.selected]);
		})
		.attr("class","bars")
		.attr("height",(d:any)=>{
			console.log("this.height "+this.height+"  this.y(d[Array][this.selected] => "+this.y(d["Array"][this.selected]));
			return this.height-this.y(d["Array"][this.selected]);
		})
		.style("fill", "steelblue")
		.style("width",this.width/this.data.length);
		
		this.focus.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + this.height + ')')
			.call(this.xAxis);

		this.focus.append('g')
			.attr('class', 'axis axis--y')
			.call(this.yAxis);

		// create brush bars
		this.context.append("g").selectAll(".barsG")//.append("g")
		.data(this.data).enter().append("rect")
		.attr("x",(d:any)=>{
			return this.x(moment(inputDateFormat(data.starttime), "hh:00:00")
			.add(d.time, 'minutes'));
		})
		.attr("y",(d:any)=>{
			return this.y2(d["Array"][this.selected]);
		})
		.attr("class","bars")
		.attr("height",(d:any)=>{
			console.log("this.height "+this.height+"  this.y(d[Array][this.selected] => "+this.y2(d["Array"][this.selected]));
			return this.height2-this.y2(d["Array"][this.selected]);
		})
		.style("fill", "steelblue")
		.style("width",this.width/this.data.length);

		this.context.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + this.height2 + ')')
			.call(this.xAxis2);

		this.context.append('g')
			.attr('class', 'brush')
			.call(this.brush)
			.call(this.brush.move, this.x.range());

		this.svg.append('rect')
			.style("fill", "transparent")
			.attr('class', 'zoom')
			.attr('width', this.width)
			.attr('height', this.height)
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
			.call(this.zoom);
	}

	// Closed bar chart functions
	private addXandYAxisClosedBar() {
		// range of data configuring  
		this.xClosedBar = d3Scale.scaleTime().range([0, this.width]);

		this.x2ClosedBar = d3Scale.scaleTime().range([0, this.width]);

		this.yClosedBar = d3Scale.scaleLinear().range([this.height, 0]);

		this.y2ClosedBar = d3Scale.scaleLinear().range([this.height2, 0]);

		// Configure the X Axis 
		// chart axis
		this.xAxisClosedBar = d3Axis.axisBottom(this.x).tickFormat(d31.timeFormat("%H:%M:%S"));
		// brush axis
		this.xAxis2ClosedBar = d3Axis.axisBottom(this.x2).tickFormat(d31.timeFormat("%H:%M:%S"));

		this.yAxisClosedBar = d3Axis.axisLeft(this.y);

		// Configure the Y Axis  

		this.brushClosedBar = d3Brush.brushX()
			.extent([[0, 0], [this.width, this.height2]])
			.on('brush end', this.brushed.bind(this));

		this.zoomClosedBar = d3Zoom.zoom()
			.scaleExtent([1, Infinity])
			.translateExtent([[0, 0], [this.width, this.height]])
			.extent([[0, 0], [this.width, this.height]])
			.on('zoom', this.zoomed.bind(this));

		var inputDateFormat = d31.timeParse("%a %b %d %Y %H:%M:%S");

		this.svgClosedBar.append('defs').append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('width', this.width)
			.attr('height', this.height);

		this.focusClosedBar = this.svgClosedBar.append('g')
			.attr('class', 'focus')
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

		this.contextClosedBar = this.svgClosedBar.append('g')
			.attr('class', 'context')
			.attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');
	}

	private brushedClosedBar() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
		let s = d3.event.selection || this.x2.range();
		this.xClosedBar.domain(s.map(this.x2.invert, this.x2));
		this.focusClosedBar.select('.area').attr('d', this.area);
		this.focusClosedBar.select('.axis--x').call(this.xAxis);
		this.svgClosedBar.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
			.scale(this.width / (s[1] - s[0]))
			.translate(-s[0], 0));
	}

	private zoomedClosedBar() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
		let t = d3.event.transform;
		this.xClosedBar.domain(t.rescaleX(this.x2ClosedBar).domain());
		this.focusClosedBar.select('.area').attr('d', this.areaClosedBar);
		this.focusClosedBar.select('.axis--x').call(this.xAxisClosedBar);
		this.contextClosedBar.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
	}

	private drawLineAndPathClosedBar() {

		var inputDateFormat = d31.timeParse("%a %b %d %Y %H:%M:%S");  // Wed Apr 01 2020 15:30:00 GMT-0500 (Eastern Daylight Time)

		var endDate = inputDateFormat(data.starttime);
		endDate.setMinutes(endDate.getMinutes()+this.selectedTimeOption);

		//this.x.domain([inputDateFormat(data.starttime), endDate]);

		this.xClosedBar.domain([inputDateFormat(data.starttime), endDate]);
		
		this.yClosedBar.domain([0, d3Array.max(this.data, (d: any) => { return d["Array"][this.selected]; })])

		this.x2ClosedBar.domain(this.xClosedBar.domain());
		this.y2ClosedBar.domain(this.yClosedBar.domain());

		// Generate bards for 2nd chart
		/*
		this.focusClosedBar.append('path')
			.datum(this.data)
			.attr('class', 'area')
			.attr("clip-path", "url(#clip)")
			.attr('d', this.areaClosedBar);*/

		// create bars
		this.focusClosedBar.append("g").selectAll(".barsG")//.append("g")
		.data(this.data).enter().append("rect")
		.attr("x",(d:any)=>{
			return this.xClosedBar(moment(inputDateFormat(data.starttime), "hh:00:00")
			.add(d.time, 'minutes'));
		})
		.attr("y",(d:any)=>{
			return this.yClosedBar(d["Array"][this.selected]);
		})
		.attr("class","bars")
		.attr("height",(d:any)=>{
			console.log("this.height "+this.height+"  this.y(d[Array][this.selected] => "+this.yClosedBar(d["Array"][this.selected]));
			return this.height-this.yClosedBar(d["Array"][this.selected]);
		})
		.style("fill", "steelblue")
		.style("width",this.width/this.data.length);


		this.focusClosedBar.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + this.height + ')')
			.call(this.xAxisClosedBar);

		this.focusClosedBar.append('g')
			.attr('class', 'axis axis--y')
			.call(this.yAxisClosedBar);

			/*
		this.contextClosedBar.append('path')
			.datum(this.data)
			.attr('class', 'area')
			.attr('d', this.area2ClosedBar);*/
		
		// brush of 2nd chart
		this.contextClosedBar.append("g").selectAll(".barsG")//.append("g")
		.data(this.data).enter().append("rect")
		.attr("x",(d:any)=>{
			return this.xClosedBar(moment(inputDateFormat(data.starttime), "hh:00:00")
			.add(d.time, 'minutes'));
		})
		.attr("y",(d:any)=>{
			return this.y2ClosedBar(d["Array"][this.selected]);
		})
		.attr("class","bars")
		.attr("height",(d:any)=>{
			console.log("this.height "+this.height+"  this.y(d[Array][this.selected] => "+this.yClosedBar(d["Array"][this.selected]));
			return this.height2-this.y2ClosedBar(d["Array"][this.selected]);
		})
		.style("fill", "steelblue")
		.style("width",this.width/this.data.length);

		this.contextClosedBar.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + this.height2 + ')')
			.call(this.xAxis2ClosedBar);

		this.contextClosedBar.append('g')
			.attr('class', 'brush')
			.call(this.brushClosedBar)
			.call(this.brush.move, this.xClosedBar.range());

		this.svgClosedBar.append('rect')
			.style("fill", "transparent")
			.attr('class', 'zoom')
			.attr('width', this.width)
			.attr('height', this.height)
			.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
			.call(this.zoomClosedBar);
	}
}  
