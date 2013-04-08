var main = angular.module('chart', []);

main.directive('savingChart', function(){
	var directivedefinition = {
		scope: {
			series: '=mckSeries',
			categories: '=mckCategories'

		},
		link: function(scope, element, attrs){
			//attrs["mck-series"];
			console.log(scope["categories"]);
			console.log(scope);
			scope.$watch('series', function() {
	 			updateChart(scope.categories, scope.series.actuals, scope.series.prospects);
			});
		},
		restrict:"E"
	};

	return directivedefinition;	
})

main.factory('calculator', function(){

	return {
		getSeries: function(reliability, average, value, obs){
			var actuals = [];
			var prospects = [];
			_.each(reliability, function(elem){
				actuals.push( (average * value * obs) * elem/100 );
				prospects.push( (1.5 * average * value * obs) * elem/100 );
			});
			return {actuals: actuals, prospects:prospects};
		}
	};
})

function chartController($scope, calculator){
	$scope.averagedemand = 0;
	$scope.valueperunit = 0;
	$scope.obsolescense = 0;
	$scope.series={actuals:[], prospects:[]};
	var reliability = [75, 80, 85, 90, 95, 100];
	/*$scope.$watch('series', function() {
	 	updateChart(reliability, $scope.series.actuals, $scope.series.prospects);
	});
	*/
	$scope.categories = reliability;


	$scope.calcAndUpdateChart = function(){
		// prepare 3 series.. one for each percentage involved
		$scope.series = calculator.getSeries(reliability, $scope.averagedemand, $scope.valueperunit, $scope.obsolescense);
		

		//updateChart(reliability, actuals, prospects);
	};

}

function updateChart(categories, actuals, prospects){
	var options = {
        chart: {
            renderTo: 'chart',
            type: 'line'
        	},
        
	        title: {
	            text: "Savings per container from increasing reliability of shipping!"
	        },
    		 yAxis: {
                title: {
                    text: '$ / Container'
                }
            },
	        xAxis: {
	            categories: categories,
	            labels: {
	                style: {
	                    font: '14px "Helvetica Neue",Helvetica, Arial, sans-serif'
	                }
	            }
	        },
        	series: [{
        		name:"Actuals",
        		data: actuals
        	}, 
        	{
        		name:"prospects",
        		data: prospects
        	}]
		};

	var chart = new Highcharts.Chart(options);
}
