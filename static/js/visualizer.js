// Generated by CoffeeScript 1.4.0
(function() {
  var D3LanguageChart, D3LanguageCharts, chord_defaults, chord_diagram, colors, get_language_rank, languages, root, zeroish,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  zeroish = 1e-6;

  colors = {
    turquoise: "#1abc9c",
    green_sea: "#16a085",
    emerland: "#2ecc71",
    nephritis: "#27ae60",
    peter_river: "#3498db",
    belize_hole: "#2980b9",
    amethyst: "#9b59b6",
    wisteria: "#8e44ad",
    wet_asphalt: "#34495e",
    midnight_blue: "#2c3e50",
    sunflower: "#f1c40f",
    orange: "#f39c12",
    carrot: "#e67e22",
    pumpkin: "#d35400",
    alizarin: "#e74c3c",
    pomegranate: "#c0392b",
    clouds: "#ecf0f1",
    silver: "#bdc3c7",
    concrete: "#95a5a6",
    asbestos: "#7f8c8d"
  };

  languages = [
    {
      "name": "JavaScript",
      "rank": 0,
      "contributors": 6485,
      "contributions": 8343,
      "color": colors.belize_hole
    }, {
      "name": "Ruby",
      "rank": 1,
      "contributors": 11141,
      "contributions": 18026,
      "color": colors.alizarin
    }, {
      "name": "Java",
      "rank": 2,
      "contributors": 4311,
      "contributions": 5184,
      "color": colors.turquoise
    }, {
      "name": "Python",
      "rank": 3,
      "contributors": 6732,
      "contributions": 8785,
      "color": colors.nephritis
    }, {
      "name": "Shell",
      "rank": 4,
      "contributors": 3075,
      "contributions": 3946,
      "color": colors.wisteria
    }, {
      "name": "PHP",
      "rank": 5,
      "contributors": 6174,
      "contributions": 9082,
      "color": colors.peter_river
    }, {
      "name": "C",
      "rank": 6,
      "contributors": 6937,
      "contributions": 18460,
      "color": colors.sunflower
    }, {
      "name": "C++",
      "rank": 7,
      "contributors": 4346,
      "contributions": 5011,
      "color": colors.orange
    }, {
      "name": "Perl",
      "rank": 8,
      "contributors": 2144,
      "contributions": 3224,
      "color": colors.pomegranate
    }, {
      "name": "Objective-C",
      "short_name": "Obj-C",
      "rank": 9,
      "contributors": 2037,
      "contributions": 2830,
      "color": colors.carrot
    }
  ];

  get_language_rank = function(language) {
    return _.find(languages, function(l) {
      return l.name === language;
    }).rank;
  };

  chord_defaults = {
    width: 500,
    height: 500,
    labels: true,
    symmetric: false,
    lang: null,
    ticks: false
  };

  chord_diagram = function(prefix, el, data, opts) {
    var arc, chord, formatPercent, group, groupPath, groupText, groupTicks, innerRadius, layout, mouseout, mouseover, outerRadius, path, rank, svg, ticks;
    opts = _.defaults(opts || {}, chord_defaults);
    outerRadius = Math.min(opts.width, opts.height) / 2 - 25;
    innerRadius = outerRadius - 24;
    formatPercent = d3.format(".1%");
    arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    layout = d3.layout.chord().padding(.04).sortSubgroups(d3.descending).sortChords(d3.ascending);
    path = d3.svg.chord().radius(innerRadius);
    svg = d3.select(el).append("svg").attr("width", opts.width).attr("height", opts.height).classed("chord_diagram", true).append("g").attr("id", "circle").attr("data-prefix", prefix).attr("transform", "translate(" + opts.width / 2 + "," + opts.height / 2 + ")");
    svg.append("circle").attr("r", outerRadius);
    layout.matrix(data);
    mouseover = function(d, i) {
      return chord.classed("fade", function(p) {
        return p.source.index !== i && p.target.index !== i;
      });
    };
    mouseout = function(d, i) {
      chord.classed("fade", false);
      return svg.classed("lockfade", false);
    };
    group = svg.selectAll(".group").data(layout.groups).enter().append("g").attr("class", "group");
    group.append("title").text(function(d, i) {
      return "" + languages[i].name;
    });
    groupPath = group.append("path").attr("id", function(d, i) {
      return "" + prefix + "_group" + i;
    }).attr("d", arc).style("fill", function(d, i) {
      return languages[i].color;
    });
    if (opts.labels) {
      groupText = group.append("text").attr("x", 6).attr("dy", 15);
      groupText.append("textPath").attr("xlink:href", function(d, i) {
        return "#" + prefix + "_group" + i;
      }).text(function(d, i) {
        if ('short_name' in languages[i]) {
          return languages[i].short_name;
        } else {
          return languages[i].name;
        }
      });
      groupText.filter(function(d, i) {
        return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
      }).remove();
    }
    chord = svg.selectAll(".chord").data(layout.chords).enter().append("path").attr("class", "chord").style("fill", function(d) {
      if (opts.symmetric) {
        return colors.silver;
      } else {
        return languages[d.source.index].color;
      }
    }).attr("d", path);
    if (opts.lang != null) {
      rank = get_language_rank(opts.lang);
      svg.classed("permafade", true);
      chord.classed("fade", function(d, i) {
        return d.source.index !== rank && d.target.index !== rank;
      });
    } else {
      group.on('mouseover', mouseover);
      group.on('mouseout', mouseout);
    }
    if (opts.ticks) {
      groupTicks = function(d) {
        var k;
        k = (d.endAngle - d.startAngle) / d.value;
        return d3.range(0, d.value, 500).map(function(v, i) {
          return {
            angle: v * k + d.startAngle,
            label: i % 2 ? null : "" + (v / 1000.0) + "k"
          };
        });
      };
      ticks = svg.append("g").classed('ticks', true).selectAll("g").data(layout.groups).enter().append("g").selectAll("g").data(groupTicks).enter().append("g").attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)";
      });
      ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5).attr("y2", 0).style("stroke", "#000");
      return ticks.append("text").attr("x", 8).attr("dy", "0.35em").attr("transform", function(d) {
        var _ref;
        return (_ref = d.angle > Math.PI) != null ? _ref : {
          "rotate(180)translate(-16)": null
        };
      }).style("text-anchor", function(d) {
        var _ref;
        return (_ref = d.angle > Math.PI) != null ? _ref : {
          "end": null
        };
      }).text(function(d) {
        return d.label;
      });
    }
  };

  D3LanguageCharts = (function(_super) {

    __extends(D3LanguageCharts, _super);

    function D3LanguageCharts() {
      return D3LanguageCharts.__super__.constructor.apply(this, arguments);
    }

    D3LanguageCharts.prototype.defaults = {
      key: 'contributor_count',
      hoverindex: null
    };

    D3LanguageCharts.prototype.initialize = function() {
      this.options = _.extend(this.defaults, this.options);
      _.bindAll(this);
      this.grouped = _.groupBy(this.options.data, 'language');
      this.charts = [];
      return this.render();
    };

    D3LanguageCharts.prototype.render = function() {
      var chart, lang, repos, _ref;
      this.$el.empty();
      _ref = this.grouped;
      for (lang in _ref) {
        repos = _ref[lang];
        chart = new D3LanguageChart({
          language: lang,
          data: repos.slice(),
          fieldmap: this.options.fieldmap,
          id: "langchart_" + lang,
          key: this.options.key,
          chartgroup: this
        });
        chart.listenTo(this, 'langchart:keychanged', chart.setKey);
        chart.listenTo(this, 'langchart:hoverindexchanged', chart.sethoverindex);
        this.$el.append(chart.el);
        this.charts.push(chart);
      }
      root.charts = this.charts;
      return this;
    };

    D3LanguageCharts.prototype.setKey = function(key) {
      if (key != null) {
        this.options.key = key;
        return this.trigger('langchart:keychanged', this.options.key);
      }
    };

    D3LanguageCharts.prototype.sethoverindex = function(index) {
      this.options.hoverindex = index;
      return this.trigger('langchart:hoverindexchanged', this.options.hoverindex);
    };

    return D3LanguageCharts;

  })(Backbone.View);

  D3LanguageChart = (function(_super) {

    __extends(D3LanguageChart, _super);

    function D3LanguageChart() {
      return D3LanguageChart.__super__.constructor.apply(this, arguments);
    }

    D3LanguageChart.prototype.className = 'd3langchart';

    D3LanguageChart.prototype.defaults = {
      width: 200,
      height: 250,
      paddingY: 0,
      key: 'contributor_count',
      hoverindex: null,
      chartgroup: null
    };

    D3LanguageChart.prototype.initialize = function() {
      this.options = _.defaults(this.options, this.defaults);
      _.bindAll(this);
      this.chartheight = this.options.height - this.options.paddingY - 1;
      this.setup();
      return this.$el.append("<p class=\"name\">" + this.options.language + "</p>");
    };

    D3LanguageChart.prototype.setKey = function(key) {
      this.options.key = key;
      return this.render();
    };

    D3LanguageChart.prototype.sethoverindex = function(index) {
      this.options.hoverindex = index;
      return this.renderhoverindex();
    };

    D3LanguageChart.prototype.setup = function() {
      d3.selectAll(this.$el).append("svg").attr("width", this.options.width).attr("height", this.options.height).append('g').attr("transform", "translate(0," + this.options.paddingY + ")");
      this.render();
      return this;
    };

    D3LanguageChart.prototype.renderhoverindex = function() {
      var extents, g, marker, svg, val, x, ylog;
      extents = _.findWhere(this.options.fieldmap, {
        'name': this.options.key
      }).extents;
      svg = d3.select(this.$el[0]);
      g = svg.select('svg>g');
      ylog = d3.scale.log().domain([0.1, extents[1]]).range([this.chartheight, 0]).clamp(true);
      x = d3.scale.linear().domain([0, 199]).range([0, this.options.width]);
      if (this.options.hoverindex != null) {
        val = this.options.data[this.options.hoverindex][this.options.key];
        if (val === 0) {
          val = 0.1;
        }
        marker = g.selectAll('.hoverindex');
        if (marker[0].length === 0) {
          marker = g.append('circle').attr('class', 'hoverindex');
        }
        return marker.attr('cx', x(this.options.hoverindex)).attr('cy', ylog(val)).attr('r', 3).transition().duration(100).attr('r', 5);
      } else {
        return g.selectAll('.hoverindex').remove();
      }
    };

    D3LanguageChart.prototype.render = function() {
      var area, bars, baseline, extents, g, logarea, logline, mousemove, mouseout, set_hoverindex, svg, x, xbands, y, ylog,
        _this = this;
      extents = _.findWhere(this.options.fieldmap, {
        'name': this.options.key
      }).extents;
      y = d3.scale.linear().domain(extents).range([this.chartheight, 0]);
      ylog = d3.scale.log().domain([0.1, extents[1]]).range([this.chartheight, 0]).clamp(true);
      x = d3.scale.linear().domain([0, 199]).range([0, this.options.width]);
      xbands = d3.scale.ordinal().domain(d3.range(200)).rangeRoundBands([0, this.options.width], 0);
      svg = d3.select(this.$el[0]);
      g = svg.select('svg>g');
      mousemove = function() {
        return set_hoverindex(d3.mouse(this)[0]);
      };
      mouseout = function() {
        return set_hoverindex(null);
      };
      set_hoverindex = function(index) {
        return _this.options.chartgroup.sethoverindex(index);
      };
      svg.on('mousemove', mousemove);
      svg.on('mouseout', mouseout);
      bars = g.selectAll('.bar').data(this.options.data);
      bars.enter().append('rect').on('mouseover', function(d, i) {
        return console.log("" + d.language + " " + d.rank + " " + d.user + "/" + d.name + " " + d[_this.options.key]);
      });
      bars.attr('class', 'bar').attr('data-lang', this.options.language).transition().attr('x', function(d) {
        return xbands(d.rank);
      }).attr('y', function(d) {
        var val;
        val = d[_this.options.key];
        if (val === 0) {
          val = 0.1;
        }
        return ylog(val);
      }).attr('width', xbands.rangeBand()).attr('height', function(d) {
        var val;
        val = d[_this.options.key];
        if (val === 0) {
          val = 0.1;
        }
        return _this.chartheight - ylog(val);
      });
      baseline = g.append('rect').attr('class', 'baseline').attr('x', 0).attr('y', this.chartheight - 1).attr('width', this.options.width).attr('height', 1);
      logline = d3.svg.line().x(function(d, i) {
        return x(d.rank);
      }).y(function(d) {
        var val;
        val = d[_this.options.key];
        if (val === 0) {
          val = zeroish;
        }
        return ylog(val);
      });
      logarea = d3.svg.area().x(function(d) {
        return x(d.rank);
      }).y0(this.chartheight).y1(function(d) {
        var val;
        val = d[_this.options.key];
        if (val === 0) {
          val = zeroish;
        }
        return ylog(val);
      });
      area = d3.svg.area().x(function(d) {
        return x(d.rank);
      }).y0(this.chartheight).y1(function(d) {
        return y(d[_this.options.key]);
      });
      return this;
    };

    return D3LanguageChart;

  })(Backbone.View);

  $(function() {
    d3.json("static/data/language_adjacency.json", function(error, data) {
      chord_diagram('repos_all', ".all_polyglots>.vis", data.repos);
      chord_diagram('repos_noself', ".no_self_links>.vis", data.repos_noself);
      chord_diagram('commits_noself', ".by_commits>.vis", data.commits_noself);
      return chord_diagram('chord_commits_people_noself', ".by_people>.vis", data.people_noself, {
        symmetric: true,
        ticks: true
      });
    });
    d3.csv("static/data/repos.csv", function(error, repos) {
      return d3.json("static/data/repofields.json", function(error, fieldmap) {
        var datefields, intfields;
        intfields = _.where(fieldmap, {
          'type': 'int'
        });
        datefields = _.where(fieldmap, {
          'type': 'datetime'
        });
        _.each(repos, function(r) {
          var prop, _i, _j, _len, _len1, _ref, _ref1, _results;
          _ref = _.pluck(intfields, 'name');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            if (prop in r) {
              r[prop] = parseInt(r[prop]) || 0;
            } else {
              r[prop] = 0;
            }
          }
          _ref1 = _.pluck(datefields, 'name');
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            prop = _ref1[_j];
            if (prop in r) {
              _results.push(r[prop] = Date(r[prop]) || Date(0));
            } else {
              _results.push(r[prop] = Date(0));
            }
          }
          return _results;
        });
        root.langcharts = new D3LanguageCharts({
          data: repos,
          fieldmap: fieldmap,
          el: $(".all_languages>.vis")
        });
        root.repos = repos;
        return root.fieldmap = fieldmap;
      });
    });
    return $('a.chordlang').on('click', function(event) {
      var chord, d3svg, rank, svg;
      event.preventDefault();
      rank = get_language_rank($(this).attr('data-lang'));
      svg = $(this).closest('.row').find('#circle');
      d3svg = d3.select(svg[0]);
      d3svg.classed('lockfade', true);
      chord = d3svg.selectAll('.chord');
      return chord.classed("fade", function(p) {
        return p.source.index !== rank && p.target.index !== rank;
      });
    });
  });

}).call(this);
