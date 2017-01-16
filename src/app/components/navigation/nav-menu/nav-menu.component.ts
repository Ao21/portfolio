import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { select, selectAll } from 'd3-selection';
import { forceSimulation, forceManyBody, forceLink, forceCenter, Simulation } from 'd3-force';

import * as _ from 'lodash';

const nodes = [
  { id: '2017', size: 10 },
  { id: '2016', size: 10 },
  { id: '2015', size: 10 },
  { id: '2014', size: 10 },
  { id: '2013', size: 10 },
]


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  element: HTMLElement;
  height: number;
  width: number;
  links: any[];
  simulation: Simulation<any, any>;

  link;
  node;

  constructor(
    private el: ElementRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.element = this.el.nativeElement;

    let background = this.element.querySelector('.background');
    this.width = background.clientWidth;
    this.height = background.clientHeight;


    this.simulation = forceSimulation()
      .force("charge",
        forceManyBody()
        .strength(() => { return -1000 })
      )
      .force("link", forceLink()
        .distance(() => 50)  
        .strength(0.2)
        .id((d: any) => d.id))
      .force("center", forceCenter(this.width / 2, this.height / 2));
    this.links = this.createLinks(nodes);
    this.createNodes();

  }

  createLinks(nodeList) {
    return _.map(nodeList, (node: any, i) => {
      let target = nodeList[i + 1];
      if (!target) {
        target = nodeList[0];
      }
      return { source: node.id, target: target.id }


    }).filter((x) => x);
  }

  createNodes() {
    let container = select(this.element.querySelector('svg'))



    this.node = container.
      append("g")
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 10);

    this.simulation
      .nodes(nodes)
      .on("tick", this.ticked);

    let l: any = this.simulation.force("link");
    l.links(this.links);

  }

  ticked = () => {


    this.node
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    // this.node
    //   .attr("cx", function (d) { return d.x; })
    //   .attr("cy", function (d) { return d.y; });
  }


}
