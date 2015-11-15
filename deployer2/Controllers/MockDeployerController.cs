using System.Net.Http;

namespace deployer2.Controllers {

	/// <summary>
	/// Used to redirect file paths to local file paths to allow testing without access to servers.
	/// </summary>
	public class MockDeployerController : DeployerController {

		public override HttpResponseMessage ViewFile(string path) {
			path = @"C:\workspace\misc\deployer-test\test.txt";
			return base.ViewFile(path);
		}

		public override HttpResponseMessage ViewDiff(string file1, string file2) {
			file1 = @"C:\workspace\misc\deployer-test\test.txt";
			file2 = @"C:\workspace\misc\deployer-test\test2.txt";
			return base.ViewDiff(file1, file2);
		}

		public override HttpResponseMessage DeployFile(string from, string to, string file) {
			from = @"C:\workspace\misc\deployer-test\";
			to = @"C:\workspace\misc\deployer-test\destination\";
			file = @"test.txt";
			return base.DeployFile(from, to, file);
		}

		public override HttpResponseMessage Recycle(string recyclePath) {
			recyclePath = @"C:\workspace\misc\deployer-test\global.asax";
			return base.Recycle(recyclePath);
		}
	}
}
