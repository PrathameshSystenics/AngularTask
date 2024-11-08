using System.Diagnostics;
using System.Net.Http;
using System.Web.Http;

namespace TaskAPI.Controllers
{
    public class TestController : ApiController
    {

        [HttpPost]
        public IHttpActionResult UploadImage()
        {
            Trace.WriteLine("Uploaded the image");
            if (Request.Content.IsMimeMultipartContent())
            {
                return Ok(new { message = "yes it is" });
            }

            return Ok(new { message="Uploaded the Image"});

        }
    }
}
