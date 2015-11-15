using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace deployer2.Controllers {

	/// <summary>
	/// Used to fake outputs from svn in order to test locally without having to setup svn.
	/// </summary>
	public class MockSvnController : SvnController {

		public override HttpResponseMessage HeadRevisionNumber() {
			return Request.CreateResponse(HttpStatusCode.OK, "17963MP");
		}

		public override HttpResponseMessage Log(string revisionNumber) {
			return Request.CreateResponse(HttpStatusCode.OK,
				@"------------------------------------------------------------------------
				  r12345 | Name | 2015-03-05 11:52:51 +1300 (Thu, 05 Mar 2015) | 13 lines
				  
				  Title: Commit to Site - Commit Title
				  Developer: Name.
				  Auditor: Name 2.
				  Case: C-123456
				  
				  - Changes –
				  - Commit note Commit note Commit note Commit note Commit note Commit note Commit note Commit note Commit note Commit note Commit note
				  
				  - Affects –
				  - Commit Affects
				  ------------------------------------------------------------------------
				  ");
		}
		
		public override HttpResponseMessage Revision(int revisionNumber) {
			return Request.CreateResponse(HttpStatusCode.OK,
					@"A       Site 1\Website\test1.txt
					  M       Site 1\Website\test2.txt
					  D       Site 1\Website\test3.txt
					  A       Site 1\Website\test3.xslt
					  M       Site 2\Website\xslt\test.xslt
					  M       Site 2\Database\stored procedures\storedprocedure1.sql
					  D       Site 2\Database\stored procedures\storedprocedure2.sql
					  M       Site 3\Website_mobile\xslt\config.xml");
		}
	}
}
