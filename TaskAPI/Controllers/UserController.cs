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
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
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
                    return Content<Message>(HttpStatusCode.NoContent, new Message() { message = "No Interests are Present" });
                }
                return Ok(new { interests = interests });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // POST: /api/User/RegisterUser
        /// <summary>
        /// Adds the <paramref name="user"/> into the system by passing the required Properties.
        /// </summary>
        /// <param name="user">Model with Details</param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult Register(User user)
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return Content<Message>(HttpStatusCode.Forbidden, new Message() { message = "Must pass the data in FormData" });
                }

                if (!Utilities.IfInputisArray(user.IdofInterests, out int[] idofinterests))
                {
                    ModelState.AddModelError("idofinterests", "IdofInterests Must be Provided in the form of array");
                }


                if (ModelState.IsValid)
                {
                    user.InterestsId = idofinterests;
                    string profileimageurl = Utilities.SaveFile(user.ProfileImage.Buffer, HttpContext.Current.Request.MapPath("~/Content/Images"), user.ProfileImage.FileName);
                    if (profileimageurl != null)
                    {
                        user.Profile = profileimageurl;
                        if (UserRepository.AddUser(user))
                        {
                            return Ok<Message>(new Message() { message = "User Registered Successfully" });
                        }
                        else
                        {
                            return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong while registering the User" });
                        }
                    }

                }
                return Content<Message>(HttpStatusCode.BadRequest, new Message() { message = "One or More Fields is Required", errors = ModelState.Values.SelectMany(e => e.Errors).Select(e => e.ErrorMessage) });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // GET: /api/User/Users/{id}
        /// <summary>
        /// Fetches the Single <see cref="User"/> by its id if not found returns No User Found.
        /// </summary>
        /// <param name="id">User id for fetching.</param>
        /// <returns>Single <see cref="User"/> Details</returns>
        [HttpGet]
        public IHttpActionResult Users(int id)
        {
            try
            {
                if (id == 0)
                {
                    return Content<Message>(HttpStatusCode.NotFound, new Message() { message = "User does not exist" });
                }
                User user = UserRepository.GetUsers(id).FirstOrDefault();
                if (user == null)
                {
                    return Content<Message>(HttpStatusCode.NotFound, new Message() { message = "No User Found" });
                }
                return Ok<User>(user);
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }

        // GET: /api/User/Users
        /// <summary>
        /// Used to Fetch the List of the user
        /// </summary>
        /// <returns><see cref="List{User}"/> User </returns>
        [HttpGet]
        public IHttpActionResult Users()
        {
            try
            {
                List<User> users = UserRepository.GetUsers();
                if (users.Count == 0)
                {
                    return Content<Message>(HttpStatusCode.NotFound, new Message() { message = "No User Found" });
                }
                return Ok(new { users = users });
            }
            catch (Exception)
            {
                return Content<Message>(HttpStatusCode.InternalServerError, new Message() { message = "Something Went Wrong" });
            }
        }


    }
}
