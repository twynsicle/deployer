
/**
 * Utility class that takes a svn revision list and converts it into a useful set of objects for the deployer.
 * Sample Input:
 * A       Site 1\Website\test1.txt
 * A       Site 2\Website\test3.xslt
 * 
 * Sample Output:
 * {
 * 	"Site 1": [
 * 		{
 * 			"fileName":"test1.txt",
 * 			"sourceDir":"C:\\\\workspace\\misc\\deployer-test\\Site 1\\Website\\",
 * 			"destinationDir":"\\\\server1\\Websites\\Site_1\\Website\\",
 * 			"isDatabase":false,
 * 			"website":"Site 1",
 * 			"status":"A",
 * 			"requiresRecycle":false,
 * 			"deployed":""
 * 		},
 * 		{
 * 			"fileName":"test3.xslt",
 * 			"sourceDir":"C:\\\\workspace\\misc\\deployer-test\\Site 1\\Website\\",
 * 			"destinationDir":"\\\\server1\\Websites\\Site_1\\Website\\",
 * 			"isDatabase":false,
 * 			"website":"Site 1",
 * 			"status":"A",
 * 			"requiresRecycle":true,
 * 			"deployed":""
 * 		}
 * 	]
 * }
 */

app.factory('fileProcessor', function () {

	// Entry point.
	function process(revisionFiles, clientsFolder) {
		var lines = revisionFiles.split(/\r\n|\r|\n/),
			files = {},
			i,
			line;
		for (i = 0; i < lines.length; i += 1) {
			line = lines[i];
		
			if (line.length) {
				var fileData = getFileData(line.trim(), clientsFolder);
				if (!files[fileData.website]) {
					files[fileData.website] = [];
				}
				files[fileData.website].push(fileData);

				// Determine path of recycle file if not done already.
				if (fileData.requiresRecycle && !files[fileData.website].requiresRecycle) {
					files[fileData.website].requiresRecycle = true;
					files[fileData.website].recyclePath = fileData.destinationDir.replace(/^(.*\\Website[\w]*\\)(.*)$/i, '$1global.asax');
					files[fileData.website].recycling = '';
				}

				// Determine link to site.
				if (!files[fileData.website].link) {
					files[fileData.website].link = getSiteLink(fileData.website);
				}
			}
		}

		return files;
	}

	// Gets destination folder for provided path - converting repository path to equivalent server location.
	function getDestinationFolder(path) {

		//TODO implement based on repo/server setup.
		return path
			.replace(/^Site ([0-9])/, '\\\\server$1\\Websites\\Site_$1');
	}

	// Gets friendly site name from folder path, this is used for display and grouping files for the same site.
	function getWebsiteName(path) {

		//TODO implement based on how websites are grouped.
		var siteName = path.match(/^([\w ]+)/)[1];
		var mobile = /.*Website_Mobile.*/i.test(path) ? ' mobile' : '';
		
		return siteName + mobile;
	}

	// Processes single file in revision and gets required information.
	function getFileData(line, clientsFolder) {
		var path = line.substring(8, 9999),
			filename = path.match(/([A-Za-z0-9_\- .]*)$/i)[1];

		return {
			fileName: filename,
			sourceDir: (clientsFolder + path).replace(filename, ''),
			destinationDir: getDestinationFolder(path).replace(filename, ''),
			isDatabase: path.indexOf('/Database/') >= 1 || path.indexOf('\\Database\\') >= 1,
			website: getWebsiteName(path),
			status: line.substring(0, 1),
			requiresRecycle: /\.xml|\.xslt$/i.test(path),
			deployed: ''
		};
	}

	// Gets path to site from friendly name.
	function getSiteLink(name) {

		//TODO implement based on urls of sites in repo.
		var map = {
			'site 1': 'http://site1.com',
			'site 2': 'http://site2.com',
			'site 3': 'http://site3.com'
		};

		return map[name.toLowerCase()];
	}


	return {
		process: process
	};
});