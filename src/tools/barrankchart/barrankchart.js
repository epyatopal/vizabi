import * as utils from 'base/utils';
import Tool from 'base/tool';

import BarRankChartComponent from './barrankchart-component';
import {
  timeslider,
  buttonlist
} from 'components/_index';

var BarRankChart = Tool.extend('BarRankChart', {

  //Run when the tool is created
  init: function(config, options) {

    this.name = "barrankchart";

    this.components = [{
      component: BarRankChartComponent, 
      placeholder: '.vzb-tool-viz', 
      model: ["state.time", "state.entities", "state.marker", "language", "ui"] 
    }, {
      component: timeslider,
      placeholder: '.vzb-tool-timeslider',
      model: ["state.time"]
    }, {
      component: buttonlist,
      placeholder: '.vzb-tool-buttonlist',
      model: ['state', 'ui', 'language']
    }];

    //constructor is the same as any tool
    this._super(config, options);
  }

});

export default BarRankChart;