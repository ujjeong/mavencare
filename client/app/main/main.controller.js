'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    $http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
        $scope.meds = meds.data;
    });

    $window.setInterval(function () {
        $scope.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        $scope.$apply();
    }, 1000);

    $scope.checkTime = function(m){
    	var t = new Date("Tue Aug 24 2016 12:00:46 GMT-0400 (EDT)");
    	
    	/*
			Checks each medication time with current time

			- If current time is 5 min prior to medication time, "Mark as complete" button is enabled
				-> status = beforeFive
			- If medication time is the same as current time or current time is passed, calm-beep sound will be palyed for 5 minutes.
			  Friendly warning will be shown
				-> status = onTime
			- If current time is 5 min passed for medication time, sharp-beep sound will be played and 'URGENT' icon will be displayed
				-> status = aboutToGetMissed
			- If current time has passsed 6 mins of medication time, sharp-beep sound will be stopped and medication will be marked as 'missed'
			  Missed medication will be separated
			  	-> status = missed

		*/
    	if(!m.completed && ( Date.parse(moment()) - Date.parse(m.time) ) >= 360000){
    		return 'missed';
    	}
    	else if(!m.completed && ( Date.parse(moment()) - Date.parse(m.time) ) >= 300000 && ( Date.parse(moment()) - Date.parse(m.time) ) <= 360000){
    		return 'aboutToGetMissed';
    	}
    	else if(!m.completed && ( Date.parse(moment()) - Date.parse(m.time) ) >= 0 && ( Date.parse(moment()) - Date.parse(m.time) ) <= 300000){
    		return 'onTime';
    	}
    	else if(!m.completed && (Date.parse(m.time) - Date.parse(moment())) <= 300000 && (Date.parse(m.time) - Date.parse(moment())) >= 0){
    		return 'beforeFive';
    	}
    	else{
    		return 'notTimeYet';
    	}
	};
});


/*
	Ctrl for datepicker

	- Receives date from html and points it to /api/medications
	- Returns corresponding medications based on Date

*/	
angular.module('medicationReminderApp').controller('DatepickerCtrl', function ($scope, $http) {

	$scope.today = function() {
		$scope.dt = moment();
	};
	$scope.currentDate = moment($scope.dt).format('MMMM Do, YYYY');
	$scope.today();
	$scope.repeatArray = [1];
	$scope.showWeeks = false;

	$scope.getMeds = function(){
		var start = moment($scope.dt).format('MM/DD/YYYY'),
        	end = moment($scope.dt).add(1, 'day').format('MM/DD/YYYY');
		
		$http.get('/api/medications?start=' + start + '&end=' + end).then(function (meds) {
			$scope.$parent.meds = meds.data;
			$scope.currentDate = moment($scope.dt).format('MMMM Do, YYYY');
	    });
	};

  $scope.dateOptions = {
    'year-format': '"yyyy"',
    'starting-day': 1
  };
});

/*
	Ctrl for updating medication

	- PUT request to /api/medications/:id
	- Updates corresponding medications based on medication ID
	
*/
angular.module('medicationReminderApp').controller('UpdateMedCtrl', function ($scope, $http){
	$scope.updateMeds = function(m){
		m.completed = !m.completed;
		$http.put('/api/medications/' + m._id, m).then(function (meds) {
			$scope.$parent.meds = meds.data;
	    });
	};
});