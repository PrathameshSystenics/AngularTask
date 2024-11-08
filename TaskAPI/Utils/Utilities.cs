using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web;

namespace TaskAPI.Utils
{
    public static class Utilities
    {

        public static bool CheckIfInputsAreNull(Type type, string[] excludeproperties, NameValueCollection form)
        {

            List<PropertyInfo> props = type.GetProperties().ToList();


            foreach (PropertyInfo prop in props)
            {
                string name = prop.Name.ToLower();
                if (!excludeproperties.Contains(name)){

                    if (!String.IsNullOrWhiteSpace(form.Get(name)))
                    {
                    }
                    Trace.WriteLine(form.Get(name));
                    Trace.WriteLine(form.Get(name));
                }
            }

            return true;

        }
    }
}