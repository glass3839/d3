function graph(data){
    // erase graph
    d3.select("#graph").selectAll("g").remove();

    // サイズ周辺の設定を変数で管理
    var outer = document.getElementById("outer");
    var margin = {top: 20, right: 20, bottom: 130, left: 40};
    width = parseInt(d3.select("#outer").style("width")) - margin.left - margin.right
    height = parseInt(d3.select("#outer").style("height")) - margin.top - margin.bottom

    // SVGを作成
    var svg = d3.select("#graph")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x軸のスケールを設定
    var xline = data[0]
    var xScale = d3.scaleTime()
        .domain([moment(xline[0].date), moment(xline[xline.length - 1].date)])
        .range([0, width]);

    // Count最大値を求める
    yMax = 0;
    for(var i=0; i<data.length; i++){
        tmpyMax = Math.max(...data[i].map(c => c.count));
        if(yMax < tmpyMax){
            yMax = tmpyMax;
        }
    }
    // y軸のスケールを設定
    var yScale = d3.scaleLinear()
        .domain([yMax, 0])
        .range([0, height])
        .nice();
    
    // 目盛り位置
    var xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%y/%m/%d"))
        .ticks(d3.timeDay, 1);
    var yAxis = d3.axisLeft(yScale);
    
    // x軸を描画
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    // y軸を描画
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis); 

    // カラー
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    // 凡例
    areas = [];
    for(var i=0; i<data.length; i++){
        areas.push(data[i][0].area)
    }

    // 折れ線グラフ描画関数
    var line = d3.line()
        .x(function(d,i) { return xScale(moment(d.date)); })
        .y(function(d,i) { return yScale(d.count); })
        .curve(d3.curveCatmullRom.alpha(0.5));

    // 凡例表示
    legendSpace = width/areas.length    
    for(var i=0; i<areas.length; i++){
        svg.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)
            .attr("y", height + (margin.bottom/2))
            .attr("class", "legend")
            .style("fill", colors(i))
            .text(areas[i]);
        svg.append("circle")
            .attr("cx", (legendSpace/2)+i*legendSpace - 15)
            .attr("cy", height + (margin.bottom/2)-5)
            .attr("r", 5)
            .attr("fill", colors(i))
            svg.append("line")
            .attr("x1",(legendSpace/2)+i*legendSpace - 25)
            .attr("x2",(legendSpace/2)+i*legendSpace - 5)
            .attr("y1",height + (margin.bottom/2)-5)
            .attr("y2",height + (margin.bottom/2)-5)
            .attr("stroke-width",2)
            .attr("stroke", colors(i));
    }

    // 折れ線グラフを描画
    for(var i=0; i<data.length; i++){
        //グラフ描画
        svg.append("path")
            .datum(data[i])
            .attr("d",line)
            .attr("fill","none")
            .attr("stroke",colors(i));
    }
    
    // 折れ線グラフの頂点に印をつける
    function test(i){ 
        svg.selectAll("temp")
            .data(data[i])
            .enter()
            .append('circle')
            .attr("cx",line.x())
            .attr("cy",line.y())
            .attr("r",3)
            .attr("fill",colors(i))
            .on("mouseenter", function(d) {
                d3.select('.js_toolTip').style("top", (event.pageY - 20)+"px").style("left",(event.pageX)+"px")
                .text(d.count)
                .style("display", "inline-block")
                .style("color", colors(i));
            })
            .on("mouseout", function(d){
                d3.select('.js_toolTip').style("display", "none");
            });
    }
    for(var i=0; i<data.length; i++){
        test(i)
    }
}

function table(dataset){
    var names = d3.keys(dataset[0]);

    var table = d3.select("#table")
        .append("table")
        .attr("border", "1") // 枠線表示;
    
    table.append("thead")
        .append("tr")
        .selectAll("th")
        .data(names)
        .enter()
        .append("th")
        .text(function(d) { return d; });
     
    table.append("tbody")
        .selectAll("tr")
        .data(dataset)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function(row) { return d3.entries(row); })
        .enter()
        .append("td")
        .text(function(d) { return d.value; });
}

var data = 
[
    [
        {area: 'A', date: '20180401', count: 10},
        {area: 'A', date: '20180402', count: 13},
        {area: 'A', date: '20180403', count: 15},
        {area: 'A', date: '20180404', count: 17},
        {area: 'A', date: '20180405', count: 19},
        {area: 'A', date: '20180406', count: 10},
        {area: 'A', date: '20180407', count: 35},
    ]
    ,[
        {area: 'B', date: '20180401', count: 20},
        {area: 'B', date: '20180402', count: 10},
        {area: 'B', date: '20180403', count: 21},
        {area: 'B', date: '20180404', count: 11},
        {area: 'B', date: '20180405', count: 29},
        {area: 'B', date: '20180406', count: 39},
        {area: 'B', date: '20180407', count: 3},
    ]
    ,[
        {area: 'C', date: '20180401', count: 12},
        {area: 'C', date: '20180402', count: 11},
        {area: 'C', date: '20180403', count: 12},
        {area: 'C', date: '20180404', count: 11},
        {area: 'C', date: '20180405', count: 12},
        {area: 'C', date: '20180406', count: 13},
        {area: 'C', date: '20180407', count: 13},
    ]
];

graph(data)
d3.select(window).on('resize', function(){
    graph(data)
})

var dataset = [
    { "name": "A", "para1": 0, "para2": 5 },
    { "name": "B", "para1": 1, "para2": 6 },
    { "name": "C", "para1": 2, "para2": 7 },
    { "name": "D", "para1": 3, "para2": 8 },
    { "name": "E", "para1": 4, "para2": 9 }
  ]
  table(dataset)