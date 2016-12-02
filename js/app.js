var app = angular.module("NTPApp", ['ngRoute'])

.config(function($routeProvider) {

    $routeProvider
        .when("/menu1", {
            templateUrl: "templates/menu1.html",
            controller: "menuOneController"
        })

    .when("/menu2", {
        templateUrl: "templates/menu2.html",
        controller: "menuTwoController"
    })

    .when("/menu3", {
        templateUrl: "templates/menu3.html",
        controller: "menuThreeController"
    })

    .when("/menu4", {
        templateUrl: "templates/menu4.html",
        controller: "menuFourController"
    })

    .when("/menu5", {
        templateUrl: "templates/menu5.html",
        controller: "menuFiveController"
    })
})

.controller('AppCtrl', function($scope) {

    $scope.workers = new Array();

    $scope.broadcast = function() {
        $scope.$broadcast('broadToChild', $scope.workers); // вниз!
    }

    $scope.$on('emitFromChild', function(event, fromChild) {
        $scope.workers.push(fromChild);
        $scope.broadcast();
    });

    $scope.$on('checkFromChild', function(event) {
        $scope.broadcast();
    });

    $scope.$on('AddSalary', function(event, args) {
        $scope.workers[args.index].salary = +$scope.workers[args.index].salary;
        $scope.workers[args.index].salary += args.summ;
        console.log('salary has been added');
        $scope.broadcast();
    });

    $scope.$on('RemoveSalary', function(event, args) {
        $scope.workers[args.index].salary -= args.summ;
        console.log('salary has been removed');
        $scope.broadcast();
    });
})

.controller('menuOneController', function($scope) {
    $scope.ChildWorkers = new Array();

    $scope.$emit('checkFromChild');
    $scope.$on('broadToChild', function(event, fromParent) {
        $scope.ChildWorkers = fromParent.slice();
    });

    $scope.lastname;
    $scope.id;


    function NewWorker(lastname, id) {
        this.lastname = lastname;
        this.id = id;
        this.salary = 0;
    }

    $scope.createWorkers = function() {
        var worker = new NewWorker($scope.lastname, $scope.id);
        $scope.$emit('emitFromChild', worker); // вверх!
    }
})


.controller('menuTwoController', function($scope) {
    $scope.ChildWorkers = new Array();

    $scope.$emit('checkFromChild');
    $scope.allWorkers = function() {
        $scope.$emit('checkFromChild'); // вверх!
    }

    $scope.$on('broadToChild', function(event, fromParent) {
        $scope.ChildWorkers = fromParent.slice();
    });
})


.controller('menuThreeController', function($scope) {
    $scope.currentWorker;
    $scope.AddSum;
    $scope.ChildWorkers = new Array();

    $scope.$on('broadToChild', function(event, fromParent) {
        $scope.ChildWorkers = fromParent.slice();
    });


    function findWorkerIndex() {
        $scope.$emit('checkFromChild'); // вверх!
        var index;
        for (var i = 0; i < $scope.ChildWorkers.length; i++) {
            if ($scope.ChildWorkers[i].lastname === $scope.currentWorker) {
                index = i;
            }
        }
        return index;
    }

    $scope.addSalary = function() {
        var index = findWorkerIndex($scope.currentWorker);
        var summ = ($scope.AddSum) * 1;
        if (typeof summ === 'number') {
            $scope.$emit('AddSalary', {
                index: index,
                summ: summ
            }); // вверх!
        }
        else {
            console.log('Workers salary summ is not a number!!!');
        }
    }
})


.controller('menuFourController', function($scope) {
    $scope.ChildWorkers = new Array();
    $scope.removeSum;
    $scope.currentWorker;
    $scope.$on('broadToChild', function(event, fromParent) {
        $scope.ChildWorkers = fromParent.slice();
    });

    function findWorkerIndex() {
        $scope.$emit('checkFromChild'); // вверх!
        console.log($scope.currentWorker);
        var index;
        for (var i = 0; i < $scope.ChildWorkers.length; i++) {
            if ($scope.ChildWorkers[i].lastname === $scope.currentWorker) {
                index = i;
            }
        }
        return index;
    }

    $scope.removeSalary = function() {
        var index = findWorkerIndex();
        var summ = ($scope.removeSum) * 1;

        // Сделать нормально
        if ($scope.ChildWorkers[index].salary == 0) {
            console.log('Unable to remove salary');
        }
        else {
            if ($scope.ChildWorkers[index].salary > summ) {
                $scope.$emit('RemoveSalary', {
                    index: index,
                    summ: summ
                });
            }
            else {
                console.log('Unable to remove salary');
            }
        }
    }

})


.controller('menuFiveController', function($scope) {
    $scope.ChildWorkers = new Array();
    $scope.VacationList = new Array();
    var uniq = new Array();
    $scope.VacationWorkers = function() {
        $scope.$emit('checkFromChild'); // вверх!
        $scope.VacationList.length = 0;
        uniq.length = 0;
        var len = Math.floor(Math.random() * $scope.ChildWorkers.length) + 1;

        for (var i = 0; i < len; i++) {
            uniq.push(Math.floor(Math.random() * $scope.ChildWorkers.length));
        }

        uniq = ArrNoDupe(uniq);
        for (var i = 0; i < uniq.length; i++) {
            $scope.VacationList.push($scope.ChildWorkers[uniq[i]]);
        }
    }

    function ArrNoDupe(a) {
        var temp = {};
        for (var i = 0; i < a.length; i++)
            temp[a[i]] = true;
        var r = [];
        for (var k in temp)
            r.push(k * 1);
        return r;
    }
    $scope.$on('broadToChild', function(event, fromParent) {
        $scope.ChildWorkers = fromParent.slice();
    });


});
