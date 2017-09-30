var cntxt = "Sgo. del Estero";

    //scroll
    var scroll_height = $('.container').height() - 20;
    var scroll_resize = document.getElementsByClassName("input-range")[0];
    scroll_resize.style.width = scroll_height + 'px';

d3.csv("../data/elecciones.csv", function(csv) {

    //valor del scroll
    var range = $('.input-range'),
        value = $('.range-value');
    value.html(range.attr('value'));

    // console.log("CSV", csv);

    var
        // Extract years from the dataset
        years = d3.keys(csv[0]).filter(function(d) { return d.match(/^\d/) }), // Return numerical keys
        // Extract names of countries from the dataset
        countries = csv.map(function(d) { return d["Provincia"] }),
        // Return true for countries without start/end values
        missing = function(d) { return !d.start || !d.end; }

        font_size = 14,
        margin = 20,
        width = window.innerWidth - 30,
        height = countries.length * 2 *font_size + margin,
        chart = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-50 0 400 1200");


    // Update the chart graphics based on new data for selected year
    var update = function(d,i) {
        range.on('input', function() {
            value.html(this.value);
            cntxt = data[this.value].label;
            updateBreadcrum();
        });

        window.
        // Extract country names and start/end values from the dataset
        data = csv

            .map(function(d) {
                var r = {
                    label: d["Provincia"],
                    start: d3.round(parseFloat(d['2011']), 3),
                    end: d3.round(parseFloat(d['2015']), 3),
                    dif: d3.round(parseFloat(d['Diferencia']), 1)
                };
                console.log(r);
                return r;
            })

            .filter(function(d) { return (!isNaN(d.start) && !isNaN(d.end)); })

            // Sort in descending order
            .sort(function(a, b) {
                return d3.max([a.start, a.end]) > d3.max([b.start, b.end]) ?
                    -1 :
                    d3.max([a.start, a.end]) < d3.max([b.start, b.end]) ?
                    1 : 0;
            }),
            // Compute the minimum and maximum value in the dataset
            extent = [csv.map(function(d) {
                return d3.entries(d)
                    .filter(function(d) { return d.key.match(/^\d/); })
                    .map(function(d) { return d.value; })
            })]; 

             //scales
            var y = d3.scale.linear()
                      .domain([0, countries.length])
                      .range([margin, height]);

           var slope = d3.scale.linear()
                    // .domain([d3.extent(data, function(d){return d.start;})[1], d3.extent(data, function(d){return d.end;})[0]])
                .domain([Math.round(d3.extent(data, function(d) { return d.start; })[1]), Math.round(d3.extent(data, function(d) { return d.end; })[0])])
                // .domain([81, 15])
                    // .range([d3.extent(data, function(d){return d.start;})[0],d3.extent(data, function(d){return d.end;})[1]])
                .range([margin+15, height]);

            var year_scale = d3.scale.linear()
                .domain([parseInt(d3.first(years)), parseInt(d3.last(years))])
                .clamp(true)           


        // //Go through the list of countries in order, adding additional space as necessary.
        var min_h_spacing = font_size, // 1.2 is standard font height:line space ratio
            previousY = 0,
            thisY,
            additionalSpacing;
        // // //Preset the Y positions (necessary only for the lower side)
        // // //These are used as suggested positions.
        data.forEach(function(d) {
            d.startY = slope(d.start);
            d.endY = slope(d.end);
        })

        data
        .sort(function(a,b) {
          if (a.end == b.end) return 0;
          return (a.end < b.end) ? -1 : +1;
        })
      .forEach(function(d) {
          thisY = d.endY; //position "suggestion"
          additionalSpacing = d3.max([0, d3.min([(min_h_spacing - (thisY - previousY)), min_h_spacing])]);
  
          //Adjust all Y positions lower than this end's original Y position by the delta offset to preserve slopes:
          data.forEach(function(dd) {
            if (dd.startY >= d.endY) dd.startY += additionalSpacing;
            if (dd.endY >= d.endY) dd.endY += additionalSpacing; 
          });
          
          previousY = thisY;
      });
      //Loop over the lower side (left) values, adding space to both sides if there's a collision
      previousY = 0;
      data
      .sort(function(a,b) {
         if (a.startY == b.startY) return 0;
         return (a.startY < b.startY) ? -1 : +1;
      })
      .forEach(function(d) {
        thisY = d.startY; //position "suggestion"
        additionalSpacing = d3.max([0, d3.min([(min_h_spacing - (thisY - previousY)), min_h_spacing])]);
        //Adjust all Y positions lower than this start's original Y position by the delta offset to preserve slopes:
        data.forEach(function(dd) {
          if (dd.endY >= d.startY) dd.endY += additionalSpacing;
          if (dd.startY >= d.startY) dd.startY += additionalSpacing;
        });       
        previousY = thisY;
      });

        // Countries
        var country = chart.selectAll("g.country")
            .data(data);

        country
            .enter()
            .append("g")
            .attr("class", "country");

        country
            .classed("missing", function(d) { return missing(d); }); 

        country
            .on("click", function(d, i) {
                cntxt = d.label;
                updateBreadcrum();  
                range.val(i)              
            })


        updateBreadcrum();

        function updateBreadcrum() {
            country
                .classed("over", 0)
                .filter(function(d) { return d.label == cntxt; })
                .classed("over", 1)
        } 

         // ** Left column
        var left_column = country
            .selectAll("text.label.start")
            .data(function(d) { return [d]; });

        left_column
            .enter()
            .append("text")
            .classed("label start", true)
            .attr("xml:space", "preserve")
            .style("font-size", font_size)
            .attr("x", 80)
            .attr("y", 0)


        left_column
            .attr("y", function(d, i) { return d.startY; })
            .text(function(d) { return d.label + "   "; });


        left_column
            .append("tspan")
            .attr("alignment-baseline", "preserve")
            .attr("x", 80)
            .attr("y", function(d,i) { return d.startY + font_size; } )
            .text(function(d) { return d3.round(d.start, 2) + "%"; })

        // ** Right column
        var right_column = country
            .selectAll("text.label.end")
            .data(function(d) { return [d]; });

        right_column
            .enter()
            .append("text")
            .classed("label end", true)
            .attr("xml:space", "preserve")
            .style("font-size", font_size)
            .attr("x", width - 70)
            .attr("y", 0);

        right_column
            .attr("y", function(d,i) { return d.endY; })
            .text(function(d) { return d3.round(d.end, 2) + "%   " });       

        //lineas verticales
        var vertical_line_start = d3.select(".country")
            .selectAll("vertical_line")
            .data(function(d) { return [d]; });

        var vertical_line_end = d3.select(".country")
            .selectAll("vertical_line")
            .data(function(d) { return [d]; });

        vertical_line_start
            .enter()
            .append("line")
            .classed("vertical_line", true)
            .attr("x1", 80)
            .attr("x2", 80)
            .attr("y1", function(d, i) { return d.start && d.end ? d3.extent(data, function(d) { return d.startY;})[0] : null; })
            .attr("y2", function(d, i) { return d.start && d.end ? d3.extent(data, function(d) { return d.startY; })[1] : null; });

        vertical_line_end
            .enter()
            .append("line")
            .classed("vertical_line", true)
            .attr("x1", width - 80)
            .attr("x2", width - 80)
            .attr("y1", function(d, i) { return d.start && d.end ? Math.round(d3.extent(data, function(d) { return d.endY;})[0]) : null; })
            .attr("y2", function(d, i) { return d.start && d.end ? Math.round(d3.extent(data, function(d) { return d.endY;})[1]) : null; });         
                 
        // ** Slope lines
        var line = country
            .selectAll("line.slope")
            .data(function(d) { return [d]; })

        line
            .enter()
            .append("line")
            .attr("x1", 80)
            .attr("x2", width - 80)
            .attr("opacity", 0)
            .attr("y1", 0)
            .attr("y2", 0);

        line
            .classed("slope", function(d) { return d.start || d.end; })
            .attr("opacity", function(d) {
                if (d.dif < -15) { return 1; } else if (d.dif < -10) { return 0.5; } else { return 0.2; };
            })
            .attr("y1", function(d, i) { return d.start && d.end ? Math.round( d.startY - font_size/2 +8) : null; })
            .attr("y2", function(d, i) { return d.start && d.end ? Math.round( d.endY  - font_size/2 + 8) : null; });


        var line_circle_start = line.enter().append("g");
        var line_circle_end = line.enter().append("g");

        line_circle_start
            .append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("cx", 80)
            .attr("cy", function(d) {
                return d.start && d.end ? d.startY : null;
            })

        line_circle_end
            .append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("cx", width - 80)
            .attr("cy", function(d) {
                return d.start && d.end ? d.endY : null;
            })

        var middle_line = line.enter().append("g").attr("class", "circle_dif");

        middle_line
            .append("rect")
            .attr("width", 85)
            .attr("height", 40)
            .attr("rx", 10)
            .attr("x", function(d) {
                return Math.round((width -80)/ 2)
            })
            .attr("y", function(d) {
                return Math.round((d.endY - font_size*4.5 + d.startY + font_size) / 2)
            })

        middle_line
            .append('text')
            .text(function(d) { return d.dif + '%' })
            .attr("x", function(d) {
                return Math.round((width) / 2 +3)
            })
            .attr("y", function(d) {
                return Math.round((d.endY + d.startY)/2)
            })
            .attr({ "text-anchor": "middle", "class": "node-group" });       

        return chart;
    };

    return update(d3.first(years), d3.last(years));
}, {});