import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { select, selectAll, Selection } from 'd3-selection';
import { forceSimulation, forceManyBody, forceLink, forceCenter, Simulation } from 'd3-force';
import { tree, stratify, treemap, hierarchy } from 'd3-hierarchy';
import { scaleSqrt } from 'd3-scale';
import { max, sum } from 'd3-array';
import { map } from 'd3-collection';
import { transition, Transition } from 'd3-transition';
import { Vector, getClockwiseOrCounter, sampleVectors, distanceBetweenVectors} from './../../../core/util/vectors';

import * as _ from 'lodash';

const nodes = [
  { id: '2017', size: 10 },
  { id: '2016', size: 8 },
  { id: '2015', size: 6 },
  { id: '2014', size: 4 },
  { id: '2013', size: 2 },
  { id: '2012', size: 1 }

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

  radiusScale = scaleSqrt().domain([0, max(nodes, (e: any) => e.size)]).range([0, this.maxRadius])
  radiusScaleInv = scaleSqrt().domain([0, max(nodes, (e: any) => e.size)]).range([0, this.maxRadius]).invert;
  roughCircumference = sum(_.map(nodes, (e) => this.radiusScale(e.size))) * 2 + this.padding * (nodes.length - 1);
  radius = this.roughCircumference / (Math.PI * 2);

  dataTree: any = {
    children: nodes
  };

  nodeList;

  transition = transition('transform');

  centerVector: Vector;  
  initialPoint: Vector;
  vectorMap: Vector[] = [];

  distanceTravelled: number = 0;


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
    this.container = select('svg')
      .attr('width', 250)
      .attr('height', 250)
      .append('g')
      .attr('transform', 'translate(' + (250 / 2) + ',' + (250 / 2) + ')');


    let map = hierarchy(this.dataTree, (d) => d.children);
    let nodes = this.tree(map);

    this.nodeList = this.container.selectAll('.node')
      .data(nodes.children)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', function (d) { return 'node-' + d.data['id'] })
      .attr('transform', function (d) {
        return 'rotate(' + -(d.x + 200) / 2 + ') translate(' + d.y * 2 + ')';
      }).on('click', this.updateNodes);

    this.nodeList.append('circle').attr('r', (d: any) => { return this.radiusScale(d.data.size); });

  }

  getDistance(selectedInd, array) {
    return _.map(array, (arrItem: any, i) => {
      let distance = (selectedInd - i);
      distance = distance > 0 ? distance : -distance;
      arrItem.size = _.clamp(10 - (distance * 2), 0, 10);
      return arrItem;
    });
  }

  updateNodes = (d) => {
    let selectedIndex = _.findIndex(this.dataTree.children, (child: any) => { return child.id === d.data.id; });
    let nArray = this.getDistance(selectedIndex, this.dataTree.children);
    let map = hierarchy({ children: nArray }, (d) => d.children);
    let nodes = this.tree(map);

    // select('.background svg')
    //   .transition()
    //   .style('transform', `rotate(-${(nArray.length - selectedIndex - 1) * 32}deg)`);

    selectAll('.node')
      .data(nodes.children)
      .transition()
      .attr('transform', function (d) {
        return 'rotate(' + -(d.x + 200) / 2 + ') translate(' + d.y * 2 + ')';
      })
      .select('circle').attr('r', (d: any) => { return this.radiusScale(d.data.size); });
  }

  onPanStart = ($event: HammerInput) => {
    
    let boundingRect = this.el.nativeElement.getBoundingClientRect();
    let top = boundingRect.top;
    let height = boundingRect.height;
    let right = boundingRect.right;
    let centerX = (right / 2);
    let centerY = (top + height) / 2;

    this.centerVector = new Vector(centerX, centerY);

    // let center = new Vector()
    this.vectorMap[0] = new Vector($event.center.x, $event.center.y);

  }
  onPanEnd($event) {

  }


  rotateNode() {
    
  }
  onPan = ($event: HammerInput) => {
    if (!this.initialPoint) {
      this.initialPoint = new Vector($event.center.x, $event.center.y)
    }
    if (this.vectorMap.length < 6) {
      return this.vectorMap[this.vectorMap.length] = new Vector($event.center.x, $event.center.y);
    }
    let average = sampleVectors(this.centerVector, this.vectorMap);
    let svg: HTMLElement = this.el.nativeElement.querySelector('svg');
    let dist = distanceBetweenVectors(this.initialPoint, new Vector($event.center.x, $event.center.y));
    if (average) {
      this.distanceTravelled = this.distanceTravelled + dist;
    } else {
        this.distanceTravelled = this.distanceTravelled - dist;
    }
    svg.style.transform = `rotate(${this.distanceTravelled}deg)`;
    this.vectorMap = [];
    this.initialPoint = null;
  }






}
