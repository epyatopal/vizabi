define([
    'd3',
    'lodash',
    'models/hook'
], function(d3, _, Hook) {

    //constant time formats
    var time_formats = {
        "year": d3.time.format("%Y"),
        "month": d3.time.format("%Y-%m"),
        "week": d3.time.format("%Y-W%W"),
        "day": d3.time.format("%Y-%m-%d"),
        "hour": d3.time.format("%Y-%m-%d %H"),
        "minute": d3.time.format("%Y-%m-%d %H:%M"),
        "second": d3.time.format("%Y-%m-%d %H:%M:%S")
    };

    var Axis = Hook.extend(   {

        /**
         * Initializes the color hook
         * @param {Object} values The initial values of this model
         * @param parent A reference to the parent model
         * @param {Object} bind Initial events to bind
         */
        init: function(values, parent, bind) {

            this._type = "axis";
            values = _.extend({
                use: "value",
                value: undefined
            }, values);
            this._super(values, parent, bind);
        },

        /**
         * Validates a color hook
         */
        validate: function() {

            var possibleScales = ["log", "linear", "pow"];
            if (!this.scale || (this.hook === "indicator" && possibleScales.indexOf(this.scale) === -1)) {
                this.scale = 'linear'; 
            }

            if (!this.unit && this.hook === "indicator") {
                this.unit = 1;
            }

            if (this.hook !== "indicator" && this.scale !== "ordinal") {
                this.scale = "ordinal";
            }

            //TODO: add min and max to validation

        },
        /**
         * Gets tick values for this hook
         * @returns {Number|String} value The value for this tick
         */
        getTick: function(tick_value) {
            var value = tick_value;
            if (this.hook == "indicator") {
                value = parseFloat(value) / this.unit;
            }
            else if(this.hook == "property" && _.isDate(tick_value)) {
                //TODO: generalize for any time unit
                value = time_formats["year"](tick_value);
            }
            return value;
        },

        /**
         * Gets the domain for this hook
         * @returns {Array} domain
         */
        getDomain: function() {
            var domain,
                scale = this.scale || "linear";

            switch (this.hook) {
                case "indicator":
                    var limits = this.getLimits(this.value),
                        margin = (limits.max - limits.min) / 10;
                    domain = [(limits.min - margin), (limits.max + margin)];
                    if(scale == "log") {
                        domain = [limits.min/2, (limits.max + limits.max/2)];
                    }

                    break;
                case "property":
                    domain = this.getUnique(this.value);
                    break;
                case "value":
                default:
                    domain = [this.value];
                    break;
            }

            return d3.scale[scale]().domain(domain);
        }

    });

    return Axis;
});