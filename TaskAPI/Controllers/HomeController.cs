using System.Net.Http;
using System.Web.Http;
using System.Net;

namespace TaskAPI.Controllers
{
    public class HomeController : ApiController
    {
        // GET: /api/Test
        [HttpGet]
        public HttpResponseMessage Test()
        {
            return Request.CreateResponse<object>(HttpStatusCode.OK, new { message = "The Api is Working" });
        }
    }
}
