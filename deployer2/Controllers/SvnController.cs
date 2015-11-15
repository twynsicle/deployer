using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Web.Configuration;
using System.Web.Http;

namespace deployer2.Controllers {

	/// <summary>
	/// Retrieves information from local svn repository.
	/// Target repository is the repo this project is located in.
	/// </summary>
	public class SvnController : ApiController {
		private readonly string clientFolder = WebConfigurationManager.AppSettings["ClientFolder"];

		/// <summary>
		/// Gets head revision number - this is the highest current revision the local repository is tracking.
		/// </summary>
		/// <returns>Head revision number</returns>
		[HttpGet]
		public virtual HttpResponseMessage HeadRevisionNumber() {
			try {
				var result = CallSvn("svnrevision", null);
				return Request.CreateResponse(HttpStatusCode.OK, result);
			} catch (Exception ex) {
				return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
			}
		}


		/// <summary>
		/// Gets log message for provided revision number.
		/// </summary>
		/// <param name="revisionNumber">SVN revision number.</param>
		/// <returns>Log message</returns>
		[HttpGet]
		public virtual HttpResponseMessage Log(string revisionNumber) {
			try {
				var result = CallSvn("svn", String.Format("log -r{0}", revisionNumber));
				return Request.CreateResponse(HttpStatusCode.OK, result);
			} catch (Exception ex) {
				return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
			}
		}


		/// <summary>
		/// Gets information about a provided revision number. Equivalent to calling diff --summarize.
		/// </summary>
		/// <param name="revisionNumber">SVN revision number.</param>
		/// <returns>
		/// Sample output:
		/// A       Site 1\Website\test1.txt
		/// M       Site 1\Website\test2.txt
		/// D       Site 2\Website\test3.txt
		/// </returns>
		[HttpGet]
		public virtual HttpResponseMessage Revision(int revisionNumber) {
			try {
				var result = CallSvn("svn", String.Format("diff --summarize -r{0}:{1}", revisionNumber, revisionNumber - 1));
				return Request.CreateResponse(HttpStatusCode.OK, result);
			} catch (Exception ex) {
				return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
			}
		}


		/// <summary>
		/// Returns the location of the repo we are using.
		/// </summary>
		/// <returns>Folder path to clients repo</returns>
		[HttpGet]
		public virtual HttpResponseMessage ClientFolder() {
			return Request.CreateResponse(HttpStatusCode.OK, clientFolder);

		}


		/// <summary>
		/// Utility function to get information from svn.
		/// </summary>
		/// <param name="svnProcess">Command</param>
		/// <param name="arguments">Command arguments</param>
		/// <returns>Output from command</returns>
		private string CallSvn(string svnProcess, string arguments) {
			var startInfo = new ProcessStartInfo {
				FileName = svnProcess,
				WorkingDirectory = clientFolder,
				Arguments = arguments,
				RedirectStandardOutput = true,
				UseShellExecute = false
			};
			using (var process = Process.Start(startInfo)) {
				if (process == null) {
					throw new Exception(String.Format("Unknown Error: Could not start {0} with arguments {1}", svnProcess, arguments));
				}
				using (var reader = process.StandardOutput) {
					var result = reader.ReadToEnd();
					return result;
				}
			}

		}
	}
}
