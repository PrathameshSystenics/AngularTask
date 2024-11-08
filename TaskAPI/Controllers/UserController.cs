using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using TaskAPI.Models;
using TaskAPI.Respository;
using TaskAPI.Utils;

namespace TaskAPI.Controllers
{
    public class UserController : ApiController
    {

        // GET: /api/User/GetStateAndCity
        /// <summary>
        /// Getting the State as well as its City in the Dictionary
        /// </summary>
        /// <returns>Null if Some Error Occured other wise dictionary of key as state and list of string</returns>
        [HttpGet]
        public IHttpActionResult GetStateAndCity()
        {
            try
            {
                Dictionary<string, List<string>> statecity = UserRepository.GetStateCities();

                if (statecity == null)
                {
                    return Content<Message>(HttpStatusCode.NoContent, new Message() { message = "No City or State Found" });
                }
                return Ok(statecity);
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong", status = "Failed" });
            }
        }

        // GET: /api/user/Interests
        /// <summary>
        /// Getting the List of interests with its id
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult Interests()
        {
            try
            {
                List<Interests> interests = UserRepository.GetInterests();
                if (interests.Count == 0)
                {
                    return Content<Message>(HttpStatusCode.NoContent, new Message() { message = "No Interests are Present", status = "Failed" });
                }
                return Ok(new { interests = interests });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong", status = "Failed" });
            }
        }

        // POST: /api/User/RegisterUser
        [HttpPost]
        public IHttpActionResult Register()
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Must pass the data in FormData" });
                }
                else if (Utilities.CheckIfInputsAreNull(typeof(User), new string[] { "id", "interests", "profile" }, HttpContext.Current.Request.Form,out string property))
                {
                    return Content<Message>(HttpStatusCode.UnsupportedMediaType, new Message() { message = string.IsNullOrWhiteSpace(property)?"One or more fields are empty":$"{property} Field is required" });
                }

                User user = new User()
                {
                    FirstName = HttpContext.Current.Request.Form.Get("firstname"),
                    LastName = HttpContext.Current.Request.Form.Get("lastname"),
                    Age = Convert.ToInt32(HttpContext.Current.Request.Form.Get("age")),
                    Address = HttpContext.Current.Request.Form.Get("address"),
                    City = HttpContext.Current.Request.Form.Get("city"),
                    DateOfBirth = Convert.ToDateTime(HttpContext.Current.Request.Form.Get("dateofbirth")),
                    Email = HttpContext.Current.Request.Form.Get("email"),
                    Gender = HttpContext.Current.Request.Form.Get("gender"),
                    IdofInterests = HttpContext.Current.Request.Form.Get("idofinterests").Trim('[', ']')
                      .Split(',').ToList()
                      .Select(int.Parse)
                      .ToArray(),
                    Password = HttpContext.Current.Request.Form.Get("password"),
                    PhoneNo = HttpContext.Current.Request.Form.Get("phoneno"),
                    State = HttpContext.Current.Request.Form.Get("state"),
                };

                return Ok<Message>(new Message() { message = "User Registered Successfully", result = user });

            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong", status = "Failed" });
            }
        }


    }
}
