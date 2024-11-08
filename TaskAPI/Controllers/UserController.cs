using System.Collections.Generic;
using System.Web.Http;
using TaskAPI.Respository;
using System.Net;
using TaskAPI.Models;

namespace TaskAPI.Controllers
{
    public class UserController : ApiController
    {

        // GET: /api/User/GetStateAndCity
        public IHttpActionResult GetStateAndCity()
        {
            Dictionary<string, List<string>> statecity = UserRepository.GetStateCities();

            if (statecity == null)
            {
                return Content<Message>(HttpStatusCode.NoContent, new Message() { message = "No City or State Found" });
            }
            return Ok(statecity);
        }
    }
}
