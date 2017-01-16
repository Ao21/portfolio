import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { select, selectAll, Selection } from 'd3-selection';
import { forceSimulation, forceManyBody, forceLink, forceCenter, Simulation } from 'd3-force';
import { tree, stratify, treemap, hierarchy } from 'd3-hierarchy';
import { scaleSqrt } from 'd3-scale';
import { max, sum } from 'd3-array';
import { map } from 'd3-collection';
import { transition, Transition } from 'd3-transition';


import * as _ from 'lodash';

const nodes = [
  { id: '2017', size: 1 },
  { id: '2016', size: 2 },
  { id: '2015', size: 5 },
  { id: '2014', size: 6 },
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

  container;

  m: number = 20;
  padding: number = 15;
  maxRadius: number = 25;

  radiusScale = scaleSqrt().domain([0, max(nodes, (e: any) => e.size)]).range([1, this.maxRadius])
  radiusScaleInv = scaleSqrt().domain([0, max(nodes, (e: any) => e.size)]).range([0, this.maxRadius]).invert;
  roughCircumference = sum(_.map(nodes, (e) => this.radiusScale(e.size))) * 2 + this.padding * (nodes.length - 1);
  radius = this.roughCircumference / (Math.PI * 2);

  dataTree: any = {
    children: nodes
  };

  nodeList;

  transition = transition('transform');


  tree = tree()
    .size([360, this.radius])
    .separation((a: any, b: any) => {
      return this.radiusScale(a.data.size) + this.radiusScale(b.data.size);
    });


  constructor(
    private el: ElementRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.element = this.el.nativeElement;

    let background = this.element.querySelector('.background');
    this.width = background.clientWidth;
    this.height = background.clientHeight;

    this.width = 400;
    this.createSvg();

  }

  createSvg() {
    this.container = select('.background').append('svg')
      .attr('width', this.width + this.m * 2)
      .attr('height', this.width + this.m * 2)
      .append('g')
      .attr('transform', 'translate(' + (this.width / 2 + this.m) + ',' + (this.width / 3 + this.m) + ')');


    let map = hierarchy(this.dataTree, (d) => d.children);
    let nodes = this.tree(map);

    this.nodeList = this.container.selectAll('.node')
      .data(nodes.children)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', function (d) { return 'node-' + d.data['id']})
      .attr('transform', function (d) {
        return 'rotate(' + -(d.x + 200) / 2 + ') translate(' + d.y * 2 + ')';
      }).on('click', this.updateNodes);

    this.nodeList.append('circle').attr('r', (d: any) => { return this.radiusScale(d.data.size); });

  }

  getDistance(selectedInd, array) {
    return _.map(array, (arrItem: any, i) => {
      let distance = (selectedInd - i);
      distance = distance > 0 ? distance : -distance;
      arrItem.size = _.clamp(10 - (distance * 3), 0.5, 10);
      return arrItem;
    });
  }

  updateNodes = (d) => {
    let selectedIndex = _.findIndex(this.dataTree.children, (child: any) => { return child.id === d.data.id; });
    let nArray = this.getDistance(selectedIndex, this.dataTree.children);
    let map = hierarchy({ children: nArray }, (d) => d.children);
    let nodes = this.tree(map);


      selectAll('.node')
      .data(nodes.children)
      .transition()
      .attr('transform', function (d) {
        return 'rotate(' + -(d.x + 200) / 2 + ') translate(' + d.y * 2 + ')';
      })
    .select('circle').attr('r', (d: any) => { return this.radiusScale(d.data.size); });
  }



}
