var b = JXG.JSXGraph.initBoard('box', {axis: true, boundingbox: [-1, 3000, 50, -1]});

b.create('axis', [[0, 0], [1,0]], { name:'час', withLabel: true, label: {
    position: 'rt',
    offset: [-15, 20]
  }
});

b.create('axis', [[0, 0], [0, 1]], { name:'FV', withLabel: true, label: {
    position: 'rt',
    offset: [-20, 0]
  }
});


var app = angular.module('calc', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

app.constant("moment", moment);

app.controller('calculatorCtrl', function ($scope, $filter) {

  $scope.options = {
    showWeeks: false
  };

  $scope.pv = 1000;
	$scope.fv = 2000;
  $scope.n = 1;
  $scope.d = 0.1;

  $scope.graph;

  $scope.difference = function () {
    var a = moment($scope.start);
    var b = moment($scope.end);
    return b.diff(a, 'days');
  }

	$scope.evaluate = function () {
    console.log('evaluate');
		switch ($('input[name=unknown]:checked').val()) {
			case 'pv': $scope.pv = $scope.fv * Math.pow(1 - $scope.d, $scope.n); break;
			case 'fv': $scope.fv = $scope.pv / Math.pow(1 - $scope.d, $scope.n); break;
			case 'n': $scope.n = Math.log($scope.pv / $scope.fv) / Math.log(1 - $scope.d); break;
			case 'd': $scope.d = Math.pow($scope.pv / $scope.fv, 1 / $scope.n) - 1; break;
		}
    b.removeObject($scope.graph);
		$scope.graph = b.create('functiongraph', [ x => $scope.pv / Math.pow(1 - $scope.d, x), 0], {strokeColor:'#0effe0', strokeWidth: 3});
	}
});
