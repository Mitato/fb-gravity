$(document).ready(function() {
    
    var width = 600,
        height = 600,
        radius = Math.min(width, height) / 2,
        innerRadius = 0.3 * radius;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.width; });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function(d) {
            //console.log("this is: " + d);
            //console.log(d);
            return d.name + ": <span style='color:orangered'>" + d.sentiment + "</span>";
        });

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(function (d) { 
            return (radius - innerRadius) * (d.data.sentiment_scaled / 100.0) + innerRadius; 
        });

    var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

    var svg = d3.select("#content-area").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.call(tip);

    var year = "";

    function draw(ind, file) {
        d3.json(file, function(err, data) {
            if (err) {
                console.log(err);
            }
            year = data.year;
            data = data[ind]

            var path = svg.selectAll(".solidArc")
                    .data(pie(data))
                    .enter().append("path")
                    .attr("fill", function(d) { 
                        return d.data.color; 
                    })
                    .attr("class", "solidArc")
                    .attr("stroke", "gray")
                    .attr("d", arc)
                    .on('mouseover', function(d) {
                        tip.show(d.data);
                    })
                    .on('mouseout', tip.hide);

            var outerPath = svg.selectAll(".outlineArc")
                    .data(pie(data))
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke", "gray")
                    .attr("class", "outlineArc")
                    .attr("d", outlineArc);

            setMonth(getMonth(monthInd));
        });
    }

    var monthInd = 1;
    $( "#slider-range" ).slider({
        range: "max",
        min: 1,
        max: 12,
        value: 0,
        step: 1,
        slide: function( event, ui ) {
            svg.selectAll("*").remove();
            var diff = parseInt(ui.value) - parseInt($( "#year" ).val())
            
            $( "#year" ).val( ui.value );
            monthInd += diff;
            if (monthInd > 12) {
                monthInd = 1;
            }
            
            draw(monthInd.toString(), filename)
        }
    });
    $( "#year" ).val($( "#slider-range" ).slider( "value") );

    function setMonth(month) {
        svg.selectAll(".month-val").remove();
        svg.append("svg:text")
            .attr("class", "month-val")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle") // text-align: right
            .text(month + " " + year);
    }

    function getMonth(ind) {
        var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[ind-1];
    }

    svg.append("svg:text")
        .attr("class", "month-val")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // text-align: right
        .text("Jan " + year);

    var filename = "sentiment_month_14.json"
    draw("1", filename);

    $( "#speed" ).selectmenu({
        change: function( event, data ) {
            console.log(typeof data.item.value.toString());
            if (data.item.value.toString() === "2014") {
                console.log(1);
                filename = "sentiment_month_14.json"
            }
            else if (data.item.value.toString() === "2013") {
                console.log(2);
                filename = "sentiment_month_13.json"
            }
            svg.selectAll("*").remove();
            draw(monthInd.toString(), filename)
        }
     });


});