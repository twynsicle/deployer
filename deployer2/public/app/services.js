// Switch between mock test endpoint and live endpoint.
//var root = '/api/';
var root = '/api/mock';

/**
 * Boilerplate for api calls required by the app.
 */
app.service('deployerService', ['$http', '$q', function($http, $q) {

	// ------------------------------------------------------------------------
	// Svn
	// ------------------------------------------------------------------------
	function getHeadRevisionNumber() {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'svn/headrevisionnumber'})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	function getRevisionSummary(revisionNumber) {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'svn/revision',
			params: {revisionnumber: revisionNumber}})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	function getLog(revisionNumber) {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'svn/log',
			params: { revisionnumber: revisionNumber }})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	function getClientFolder() {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'svn/clientfolder'})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	// ------------------------------------------------------------------------
	// Deployer
	// ------------------------------------------------------------------------
	function viewFile(path) {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'deployer/viewfile',
			params: {path: path}})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	function viewDiff (file1, file2) {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'deployer/viewdiff',
			params: {file1: file1, file2: file2}})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	function deployFile (from, to, file) {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'deployer/deployfile',
			params: {from: from, to: to, file: file}})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	function recycle (recyclePath) {
		var deferred = $q.defer();
		$http({
			method: 'get',
			url: root + 'deployer/recycle',
			params: {recyclepath: recyclePath}})
			.success(function (response) { deferred.resolve(response); })
			.error(function (response) { deferred.reject(response); });
		return deferred.promise;
	}

	// ------------------------------------------------------------------------
	// Declare public functions.
	// ------------------------------------------------------------------------
	return ({
		getRevisionSummary: getRevisionSummary,
		getHeadRevisionNumber: getHeadRevisionNumber,
		getLog: getLog,
		getClientFolder: getClientFolder,
		viewDiff: viewDiff,
		deployFile: deployFile,
		viewFile: viewFile,
		recycle: recycle
	});

}]);


