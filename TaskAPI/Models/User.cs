using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaskAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string PhoneNo { get; set; }
        public string Profile { get; set; }

        public List<Interests> Interests { get; set; }

        public int[] IdofInterests { get; set; }
    }
}