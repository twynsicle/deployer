'use strict';

angular.module('deployer.view1', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/view1', {
			templateUrl: 'view1/view1.html',
			controller: 'View1Ctrl'
		});
	}])

	.controller('View1Ctrl', ['$scope', 'deployerService', 'fileProcessor', '$timeout', '$q', function ($scope, deployerService, fileProcessor, $timeout, $q) {

		$scope.revisionNumber = '';
		$scope.files = {};
		$scope.logMessage = '';
		$scope.showResults = false;
		$scope.revisionLoading = false;
		$scope.headRevisionNumber = 0;
		$scope.errors = {};

		// Fetches all of the data required for the requested revision number.
		$scope.getRevision = function(revisionNumber) {
			if (!revisionNumber) return;
			if (isNaN(parseInt(revisionNumber))) {
				showError('Revision must be a valid number.');
				return
			}
			revisionNumber = parseInt(revisionNumber);

			// Clear existing data.
			$scope.files = {};
			$scope.logMessage = '';

			$scope.showResults = false;
			$scope.revisionLoading = true;

			$q.all([
				deployerService.getHeadRevisionNumber(),
				deployerService.getLog(revisionNumber),
				deployerService.getRevisionSummary(revisionNumber),
				deployerService.getClientFolder()
			]).then(function (data) {
				var headNumber = data[0],
					log = data[1],
					revisionFiles = data[2],
					clientsFolder = data[3];

				//  Check revision head of current repo up to date - if not, user will be deploying files that are out of date.
				if (parseInt(headNumber, 10) < revisionNumber) {
					showError('SVN head less than searched revision number, remember to update your repo if deploying for another developer.');
					$scope.revisionLoading = false;
					return;
				}
				$scope.headRevisionNumber = data[0];

				if (!clientsFolder.length) {
					showError('Clients folder could not be correctly retrieved, ensure that it is correctly set in web.config.');
					$scope.revisionLoading = false;
					return;
				}

				// Show log.
				$scope.logMessage = trimLog(log);

				// Cancel loading icon.
				$scope.revisionLoading = false;

				$scope.files = fileProcessor.process(revisionFiles, clientsFolder);
	
				$scope.showResults = true;

			}, function (data) {
				showError(data.Message);
				$scope.revisionLoading = false;
			});
		};
		$scope.getRevision(17941);

		// --------------------------------------------------------------------
		// Events
		// --------------------------------------------------------------------

		// Opens file in windows explorer.
		$scope.viewFile = function (filePath) {
			deployerService.viewFile(filePath)
				.then(function () {}, function (error) {
					showError(error);
				});
		};

		// Opens diff for the source and destination file.
		$scope.viewDiff = function (file1, file2) {
			deployerService.viewDiff(file1, file2)
				.then(function(data) {}, function(error) {
					showError(error);
				});
		};

		// Copies source file to the destination.
		$scope.deployFile = function (file, from, to, fileName) {
			file.deploying = 'deploying';
			deployerService.deployFile(from, to, fileName)
				.then(function() {
					file.deployed = 'deployed';
					// Let the deploying icon slide away before stopping.
					$timeout(function() {file.deploying = '';}, 500, true);

				}, function(error) {
					file.deploying = '';
					showError(error);
				});
		};

		// Recycles website attached to files in group.
		$scope.recycle = function (website, recyclePath) {
			website.recycling = 'recycling';
			deployerService.recycle(recyclePath)
				.then(function() {
					website.recycled = 'recycled';
					// Let the recycling icon slide away before stopping.
					$timeout(function() {website.recycling = '';}, 500, true);
				}, function(error) {
					website.recycling = '';
					showError(error);
				});

		};

		// Marks the UI for the current file so that users can see what file they're operating on.
		$scope.focusFile = function (file) {
			angular.forEach($scope.files, function (site) {
				angular.forEach(site, function (file) {
					file.focused = '';
				});
			});
			file.focused = 'focused';
		};

		// --------------------------------------------------------------------
		// Error Handling.
		// --------------------------------------------------------------------
		function showError(message) {

			var id = 'error-' + Object.keys($scope.errors).length + 1;
			$scope.errors[id] = {message: message.trim()};
			$timeout(function() {$scope.errors[id].remove = 'remove';}, 31000, true);
		}

		// --------------------------------------------------------------------
		// Utilities.
		// --------------------------------------------------------------------

		// Prepare log file for display.
		function trimLog(log) {
			var lines = log.split(/\r\n|\r|\n/);
			lines = lines.slice(3, lines.length - 2);

			// Trim any empty spaces at the end.
			var i = lines.length - 1;
			while (!lines[i].length && i > 0) {
				i -= 1;
			}
			lines = lines.slice(0, i + 1);

			return lines.join('\n');
		}


	}]);