import Component from 'base/component';

/*!
 * VIZABI BUBBLE SIZE slider
 * Reusable bubble size slider
 */


var min = 0.1,
  max = 100;

var BubbleSize = Component.extend({

  /**
   * Initializes the timeslider.
   * Executed once before any template is rendered.
   * @param config The options passed to the component
   * @param context The component's parent
   */
 init: function (config, context) {
      this.template = this.template || "bubblesize.html";

      this.model_expects = [{
        name: "size",
        type: "size"
      }];

      this.field = config.field || 'max';
      var _this = this;
      this.model_binds = {
        'change:size': function(evt) {
          if(evt.indexOf(_this.field) > -1) {
            //_this.sliderEl.node().value = _this.model.size[_this.field];
          }
        }
      };
      //contructor is the same as any component
      this._super(config, context);
     },

    /**
     * Executes after the template is loaded and rendered.
     * Ideally, it contains HTML instantiations related to template
     * At this point, this.element and this.placeholder are available as a d3 object
     */
    readyOnce: function () {

      var value = this.model.size[this.field],
      _this = this;
      this.element = d3.select(this.element);
      this.indicatorEl = this.element.select('#vzb-bs-indicator');
      this.sliderEl = this.element.selectAll('#vzb-bs-slider');
      d3.selectAll('.vzb-dialog-sublabel').remove();

    var margin = {top: 200, right: 50, bottom: 200, left: 10},
      width = 250 - margin.left - margin.right,
      height = 500 - margin.bottom - margin.top;

    var x = d3.scale.linear()
      .domain([0, 100])
      .range([0, 200])
      .clamp(true);

    var brush = d3.svg.brush()
      .x(x)
      .extent([0, 0])
      .on("brush", brushed);

    var brush_two = d3.svg.brush()
    .x(x)
    .extent([0, 0])
    .on("brush", brushed_two);


    var svg = d3.select("#slider3").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 113)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + 54 + ")");
 
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height / 2 + ")")
            .call(d3.svg.axis()
                    .scale(x)
                    .tickSize(0)
                    .tickPadding(12))
            .select(".domain")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })

      var slider = svg.append("g")
        .attr("class", "slider")
        .call(brush);

    var my_text=svg.append("text")
          .attr("y",1)
          .attr("font-size","15px")
              .text("1.4B");
    var my_text1=svg.append("text")
          .attr("y",27)
          .attr("font-size","15px")
          .text("0");

    slider.selectAll(".extent,.resize")
          .remove();

    var handle = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("r", 9);



    slider
        .call(brush.event)
        .call(brush.extent([60, 60]))
        .call(brush.event);

    var circle_one = svg.append("circle")
        .attr("class", "first_circle")
        .attr("cx", "60")
        .attr("cy", "50")
        .attr("stroke", "#143764")
        .attr("stroke-width", "1")
        .attr("fill", "transparent")
      .attr("r", "60");

    function brushed() {

      var value = brush.extent()[0];
      var b1_value = brush.extent()[0]; 
      var b2_value = brush_two.extent()[0];

      if(b1_value > b2_value){

          if (d3.event.sourceEvent) { 
            value = x.invert(d3.mouse(this)[0]);

            _this.field="max";
            _this.slideHandler(Math.round(value)/100); 
            brush.extent([value, value]);
          }

          handle.attr("cx", x(value));
           my_text.attr("x", x(value));
           d3.select(".first_circle")
          .attr("cx", Math.round(value))
          .attr("r", Math.round(value));
      }
    }



    var slider_two = svg.append("g")
        .attr("class", "slider_two")
        .call(brush_two);

    slider_two.selectAll(".extent,.resize")
        .remove();

    var handle_two = slider_two.append("circle")
        .attr("class", "handle_two")
        .attr("transform", "translate(0," + height / 2 + ")")
        .attr("cx",62)
        .attr("r", 9);

    var circle_two = svg.append("circle")
    .attr("class", "second_circle")
    .attr("cx", "29")
    .attr("cy", "50")
    .attr("stroke", "#143764")
    .attr("stroke-width", "1")
    .attr("fill", "transparent")
    .attr("r", "33");


    slider_two
        .call(brush_two.event)
        .call(brush_two.extent([40, 40]))
        .call(brush_two.event);
     
    function brushed_two() {

      var value = brush_two.extent()[0]; 
        if (d3.event.sourceEvent) { // not a programmatic event
          value = x.invert(d3.mouse(this)[0]);
          _this.slideHandler(Math.round(value)/100);
          _this.field="min";  
          brush_two.extent([value, value]);
        }

        handle_two.attr("cx", x(value));
        my_text1.attr("x", x(value));
        d3.select(".second_circle")
        .attr("cx", Math.round(value))
        .attr("r", Math.round(value));

      }
    d3.select("#slider3 svg + svg").remove()
    },
    modelReady: function () {
      this.indicatorEl.text(this.model.size[this.field]);
    },

    slideHandler: function (val) {
      //this._setValue(+d3.event.target.value);
      this._setValue(val);
    },

    /**
     * Sets the current value in model. avoid updating more than once in framerate
     * @param {number} value
     */
    _setValue: function (value) {
      var frameRate = 50;

      //implement throttle
      //TODO: use utils.throttle
      var now = new Date();
      if (this._updTime != null && now - this._updTime < frameRate) return;
      this._updTime = now;

      this.model.size[this.field] = value;
    }
});

export default BubbleSize;