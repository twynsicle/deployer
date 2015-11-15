using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace deployer2.Controllers {

	/// <summary>
	/// Performs file operations for deployer project, as requested by front end tool.
	/// </summary>
	public class DeployerController : ApiController {
		private readonly string diffToolLocation = WebConfigurationManager.AppSettings["DiffToolLocation"]; 
		private readonly string powershellPath = WebConfigurationManager.AppSettings["PowershellPath"]; 

		/// <summary>
		/// Opens provided file in windows explorer.
		/// </summary>
		/// <param name="path">Path to file.</param>
		/// <returns>Success/error message.</returns>
		[HttpGet]
		public virtual HttpResponseMessage ViewFile(string path) {
			try {
				if (!File.Exists(path)) {
					throw new Exception(String.Format("Provided file path does not exist: \n{0}", path));
				}
				Process.Start(new ProcessStartInfo {
					FileName = @"explorer",
					Arguments = String.Format("/e, /select, \"{0}\"", path)
				});
			} catch (Exception ex) {
				return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
			}
			return Request.CreateResponse(HttpStatusCode.OK);
		}


		/// <summary>
		/// Opens provided files in configured diff tool.
		/// </summary>
		/// <notes>Diff tool is configured in web.config</notes>
		/// <param name="file1">Left file of compare.</param>
		/// <param name="file2">Right file of compare.</param>
		/// <returns>Success/error message.</returns>
		[HttpGet]
		public virtual HttpResponseMessage ViewDiff(string file1, string file2) {
			try {
				if (!File.Exists(file1)) {
					throw new Exception(String.Format("Provided file path does not exist: \n{0}", file1));
				}
				if (!File.Exists(file2)) {
					throw new Exception(String.Format("Provided file path does not exist: \n{0}", file2));
				}
				Process.Start(new ProcessStartInfo {
					FileName = diffToolLocation,
					Arguments = String.Format("\"{0}\" \"{1}\"", file1, file2)
				});
			} catch (Exception ex) {
				return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
			}
			return Request.CreateResponse(HttpStatusCode.OK);
		}


		/// <summary>
		/// Copyies file from source to destination. Uses powershell to perform copy so it can fall back to
		/// owners permission set.
		/// </summary>
		/// <param name="from">Folder of source file.</param>
		/// <param name="to">Folder of destination file.</param>
		/// <param name="file">File to be copied</param>
		/// <returns>Success/error message.</returns>
		[HttpGet] public virtual HttpResponseMessage DeployFile(string from, string to, string file) {
			try {
				if (!Directory.Exists(from)) {
					throw new Exception(String.Format("Provided source path does not exist: \n{0}", from));
				}
				if (!Directory.Exists(to)) {
					throw new Exception(String.Format("Provided destination path does not exist: \n{0}", to));
				}
				if (!File.Exists(from + file)) {
					throw new Exception(String.Format("Provided file does not exist at source: \n{0}", file));
				}
				var startInfo = new ProcessStartInfo {
					FileName = String.Format("{0}", powershellPath),
					Arguments = String.Format(@"""{0}"" -from '{1}' -to '{2}'", 
						HttpContext.Current.Request.MapPath("~/powershell_scripts/copy.ps1"), from + file, to + file),
					RedirectStandardOutput = true,
					RedirectStandardError = true,
					UseShellExecute = false,
				};
				using (var process = Process.Start(startInfo)) {
					if (process == null) {
						throw new Exception("Could not load file copying process - check powershell copy script permissions are set correctly.");
					}
					process.StandardOutput.ReadToEnd();
					var error = process.StandardError.ReadToEnd();
					process.WaitForExit();
					if (error.Length > 0) {
						throw new Exception(String.Format("Error copying file: \n{0}", error));
					}
				}
			} catch (Exception ex) {
				return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
			}
			return Request.CreateResponse(HttpStatusCode.OK);
		}


		/// <summary>
		/// Appends space to end of provided global.asax file in order to cause a site to recycle.
		/// </summary>
		/// <param name="recyclePath">Path to global.asax file.</param>
		/// <returns>Success/error message.</returns>
		[HttpGet] public virtual HttpResponseMessage Recycle(string recyclePath) {
			try {
				if (!File.Exists(recyclePath)) {
					throw new Exception(String.Format("Provided recycle path does not exist: \n{0}", recyclePath));
				}
				if (!recyclePath.EndsWith("global.asax")) {
					throw new Exception(String.Format("Provided recycle path is not correct: \n{0}", recyclePath));
				}
				
				var startInfo = new ProcessStartInfo {
					FileName = String.Format("{0}", powershellPath),
					Arguments = String.Format(@"""{0}"" -recyclePath '{1}'",
						HttpContext.Current.Request.MapPath("~/powershell_scripts/recycle.ps1"), recyclePath),
					RedirectStandardOutput = true,
					RedirectStandardError = true,
					UseShellExecute = false
				};
				using (var process = Process.Start(startInfo)) {
					if (process == null) {
						throw new Exception("Could not load file copying process - check powershell copy script permissions are set correctly.");
					}
					process.StandardOutput.ReadToEnd();
					var error = process.StandardError.ReadToEnd();
					process.WaitForExit();
					if (error.Length > 0) {
						throw new Exception(String.Format("Error copying file: \n{0}", error));
					}
				}
			} catch (Exception ex) {
				return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
			}
			return Request.CreateResponse(HttpStatusCode.OK);
		}

	}
}
