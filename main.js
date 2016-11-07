var app = angular.module('app', []);

app.controller('myCtrl', function($scope) {
    // 12 (оксана)
    // $scope.Y = [ .99, .83, .45, .39, .23, .14, .09, .03, .01 ];
    // $scope.U = [  1,   3,   5,   7,   9,   11,  13,  15,  17 ];

    // 2 (іра)
    // $scope.U = [  1,    10,    20,   30,  40,   50,   60,   70,    80 ];
    // $scope.Y = [ 3.25, 3.7,  4.12, 4.61,  5,	 5.29, 5.68, 6.43, 6.99 ];

    // 16 (мар'яна)
    // $scope.U = [ 1.5,	 2,	 2.5,	 3,	 3.5,	 4,	 4.5,	 5,	5.5 ];
    // $scope.Y = [ 9.8, 7.3, 6.4, 5.9, 4.2, 2.9, 1.7, .9,  .1 ];

    // 1 (назар)
    $scope.U = [.75,  .78,  .83,  .88, .93, .98, 1.03, 1.21, 1.45 ];
    $scope.Y = [ 1,   3.25, 4.77, 5.01, 9,  9.1, 9.56, 9.82, 10.2 ];

    // 14 (павло)
    // $scope.U = [.1,  .15,  .25,  .35, .44, .55, .68, .78,  .9 ];
    // $scope.Y = [ 6.1, 5.9, 4.9,  4.2, 3.7, 3.1, 2.5, 1.9, 1.3 ];

    // 9 (я)

    // $scope.U = [  1,   2,   3,   4,   5,   6,   7,   8,    9  ];
    // $scope.Y = [ 2.4, 2.9, 3.6, 4.2, 5.1, 5.8, 6.3, 7.8,	9.5 ];

    //
    $scope.N = $scope.U.length;

    $scope.leftHand = [
      `a_0 + a_1u`,
      `a_0 + a_1\\ln{u}`,
      `a_0 + \\frac{a_1}{u}`,
      `a_0a_1^{u_1}`,
      `a_0u^{a_1}`,
      `exp\\left(a_0 + \\frac{a_1}{u}\\right)`,
      `\\frac{1}{a_0 + a_1u}`,
      `\\frac{1}{a_0 + a_1\\ln{u}}`,
      `\\frac{u}{a_0 + a_1u}`
    ];

    $scope.functions = $scope.leftHand.map(exp => `$$y = ${exp}$$`);

    $scope.precision = 3; // values after decimal point in output
    $scope.headers = [`№`, `$$u_{cep}$$`, `$$y_{cep}$$`, `$$\\widetilde{y}$$`,
       `$$\\left|\\frac{y_{cep} - \\widetilde{y}}{\\widetilde{y}}\\right|$$`,
       'Вигляд функції'

];

    $scope.mean = function (X) {
        return _.mean(X);
    }

    $scope.geom = function (X) {
        return Math.pow(X.reduce((a, b) => a * b, 1), 1 / $scope.N);
    }

    $scope.harm = function (X) {
        return ($scope.N / X.map(x => 1 / x).reduce((a, b) => a + b, 0));
    }

    $scope.between = function (arr, el) {
      var copy = arr.slice();
      copy.push(el);
      return _.indexOf(_.sortBy(copy), el) - 1;
    }

    $scope.inverse = function (arr) {
        var fraction = `\\frac{${$scope.N}}{`
        for (let i = 0; i < $scope.N; i++) {
            if (i < $scope.N - 1) {
                fraction += `\\frac{1}{${arr[i]}} + `;
            } else {
                fraction += `\\frac{1}{${arr[i]}}`;
            }
        }
        fraction += "}";
        return fraction;
    }

    $scope.table = [
      [$scope.mean($scope.U), $scope.mean($scope.Y)], [$scope.geom($scope.U), $scope.mean($scope.Y)], [$scope.harm($scope.U), $scope.mean($scope.Y)],
      [$scope.mean($scope.U), $scope.geom($scope.Y)], [$scope.geom($scope.U), $scope.geom($scope.Y)], [$scope.harm($scope.U), $scope.geom($scope.Y)],
      [$scope.mean($scope.U), $scope.harm($scope.Y)], [$scope.geom($scope.U), $scope.harm($scope.Y)], [$scope.harm($scope.U), $scope.harm($scope.Y)]
    ];

    $scope.y_wave_formulas = [];

    $scope.table.forEach((el, index, arr) => {

      const u = el[0];
      const y = el[1];
      let y_wave;
      if (_.includes($scope.U, u)) {
        y_wave = $scope.Y[_.indexOf($scope.U, u)]
      } else {
        var i = $scope.between($scope.U, u);
        y_wave = (u - $scope.U[i]) / ($scope.U[i + 1] - $scope.U[i]) * ($scope.Y[i+1] - $scope.Y[i]) + $scope.Y[i];
      }
      $scope.y_wave_formulas.push(`$$\\left|\\frac{${$scope.table[index][1].toFixed(3)}-${y_wave.toFixed(3)}}{${y_wave.toFixed(3)}}\\right|=${Math.abs((y - y_wave) / y_wave).toFixed(3)}$$`);
      arr[index].push(y_wave);
      arr[index].push(Math.abs((y - y_wave) / y_wave));
      arr[index].push($scope.functions[index]);

    });

    $scope.minIndex = 0;

    $scope.min = $scope.table[0][3];
    for (let i = 1; i < $scope.table.length; i++) {
      if ($scope.table[i][3] <$scope. min) {
        $scope.min = $scope.table[i][3];
        $scope.minIndex = i;
      }
    }
    $scope.baseFun = `$$f(u) = ${$scope.leftHand[$scope.minIndex]}$$`;
    $scope.rightHandOfFunctional = `\\sum_{i=1}^${$scope.N} \\left(${$scope.leftHand[$scope.minIndex].replace('u', 'u_i')} - y_i\\right)^2`
    $scope.derivative = function (equation) {
        let common = `2\\cdot\\sum_{i=1}^${$scope.N} \\left(${$scope.leftHand[equation].replace('u', 'u_i')} - y_i\\right)`;
        switch (equation) {
          case 0: return [`${common}\\cdot\\left(1\\right)`, `${common}\\cdot\\left({u_i}\\right)`];
          case 1: return [`${common}\\cdot\\left(1\\right)`, `${common}\\cdot\\left({\\ln{u_i}}\\right)`];
          case 2: return [`${common}\\cdot\\left(1\\right)`, `${common}\\cdot\\left({\\frac{1}{u_i}}\\right)`];
          case 3: return [`${common}\\cdot\\left({a_1}^{u_i}\\right)`, `${common}\\cdot\\left(a_0u_i{a_1}^{u_i-1}\\right)`];
          case 4: return [`${common}\\cdot\\left(u_1^{a_1}\\right)`, `${common}\\cdot\\left({a_0u_i^{a_1}\\ln{u_i}}\\right)`];
          case 5: return [`${common}\\cdot\\left(e^{a_0+\\frac{a_1}{u_i}}\\right)`, `${common}\\cdot\\left({e^{a_0+\\frac{a_1}{u_i}}\\frac{1}{u_i}}\\right)`];
          case 6: return [`${common}\\cdot\\left({-\\frac{1}{(a_0+a_1u_i)^2}}\\right)`, `${common}\\cdot\\left(-\\frac{u_i}{(a_0+a_1u_i)^2}\\right)`];
          case 7: return [`${common}\\cdot\\left(-\\frac{1}{(a_0+a_1\\ln{u_i})^2}\\right)`, `${common}\\cdot\\left(-\\frac{\\ln{u_i}}{(a_0+a_1\\ln{u_i})^2}\\right)`];
          case 8: return [`${common}\\cdot\\left(-\\frac{u_i}{(a_0+a_1u_i)^2}\\right)`, `${common}\\cdot\\left(-\\frac{u_i^2}{(a_0+a_1u_i)^2}\\right)`];
          default: return [];

        }
    }

    $scope.functional = `$$\\mathcal{J}(a_0, a_1) =${$scope.rightHandOfFunctional}$$`;
    $scope.system = function (equation) {
      return `$$\\left\\{
      			\\begin{array}{c}
      			\\frac{\\partial\\mathcal{J}}{\\partial{a_0}}=${$scope.derivative(equation)[0]} = 0\\\\
      			\\frac{\\partial\\mathcal{J}}{\\partial{a_1}}=${$scope.derivative(equation)[1]} = 0
      			\\end{array}
      			\\right.$$`;
    }

    $scope.systemSimplified = `$$\\left\\{
          \\begin{array}{c}
          \\sum_{i=0}^9\\frac{y_i(a_0+a_1\\ln(u_i))-1}{(a_0+a_1\\ln(u_i))^3}= 0\\\\
          \\sum_{i=0}^9\\frac{y_i\\cdot\\ln(u_i)(a_0+a_1\\ln(u_i))-\\ln(u_i)}{(a_0+a_1\\ln(u_i))^3}= 0
          \\end{array}
          \\right.$$`;
    $scope.result = `$$f(u) = \\frac{1}{0.4592-0.1599\\ln(u)}$$`;

    $scope.solution = `$$\\left\\{
          \\begin{array}{c}
          a_0 = 0.4592\\\\
          a_1 = -0.1599
          \\end{array}
          \\right.$$`;
    $scope.generateFormulas = function (X, variable = 'x') {

        return {
            mean: `$$\\frac{1}{${$scope.N}}\\sum_{i=1}^${$scope.N} ${variable}_i = \\frac{${X.join(' + ')}}{${$scope.N}} = ${$scope.mean(X).toFixed(3)}$$`,
            geom: `$$\\sqrt[${$scope.N}]{\\prod_{i=1}^${$scope.N} ${variable}_i} = \\sqrt[${$scope.N}]{${X.join(' \\cdot ')}} = ${$scope.geom(X).toFixed(3)}$$`,
            harm: `$$\\frac{${$scope.N}}{\\sum_{i=1}^${$scope.N} \\frac{1}{${variable}_i}} = ${$scope.inverse(X, $scope.N)} = ${$scope.harm(X).toFixed(3)}$$`
        }
    }
});
