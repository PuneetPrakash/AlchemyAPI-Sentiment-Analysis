queue()
 //  seems like mongodb is not free at heroku, using static json 
 //   .defer(d3.json, "/alchemiapi/sentimentanalysis")
 //   .defer(d3.json, "/stackoverflow/sentimentanalysis")
    .defer(d3.json, "static/sentimentjson/twitter.json")
    .defer(d3.json, "static/sentimentjson/stackoverflow.json")
    .await(makeGraphs);

function makeGraphs(error, twitterJson, stackoverflowJson) {
	
	var twittersentimentProjects = twitterJson;
	var stackoverflowsentimentProjects = stackoverflowJson;

	//Create a Crossfilter instance
	var ndx1 = crossfilter(twittersentimentProjects);
	var ndx2 = crossfilter(stackoverflowsentimentProjects);

	//Define Dimensions
	var twittersentimentScoreDim = ndx1.dimension(function(d) { return d["score"]; });
	var stackovrsentimentScoreDim = ndx2.dimension(function(d) { return d["score"]; });

	//Calculate metrics
	var numTweetsBySentimentScore = twittersentimentScoreDim.group();
	var numQuestionsBySentimentScore = stackovrsentimentScoreDim.group();

    //Charts
	var tweetChart = dc.barChart("#tweet-chart");
	var stackoverflwChart = dc.barChart("#stacko-chart");

	tweetChart
		.width(600)
		.height(500)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.x(d3.scale.linear().domain([-1,1]))
		.dimension(twittersentimentScoreDim)
		.group(numTweetsBySentimentScore)
    	.yAxisLabel("Number of Tweets")
    	.xAxisLabel("Sentiment Score")
    	 .on('renderlet', function(chart) {
        chart.selectAll('rect').on("click", function(d) {
            console.log("click!", d);
       		 });
    	});

	stackoverflwChart
		.width(600)
		.height(500)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.x(d3.scale.linear().domain([-1,1]))
		.dimension(stackovrsentimentScoreDim)
		.group(numQuestionsBySentimentScore)
    	.yAxisLabel("Number of Questions")
    	.xAxisLabel("Sentiment Score")
    	 .on('renderlet', function(chart) {
        chart.selectAll('rect').on("click", function(d) {
            console.log("click!", d);
       		 });
    	});
		

    dc.renderAll();

};