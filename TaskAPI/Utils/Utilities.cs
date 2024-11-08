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

        public static bool CheckIfInputsAreNull(Type type, string[] excludeProperties, NameValueCollection form,out string propertynull)
        {
            foreach (var prop in type.GetProperties())
            {
                string name = prop.Name.ToLower();

                if (!excludeProperties.Contains(name))
                {
                    if (string.IsNullOrWhiteSpace(form.Get(name)) || prop.PropertyType == typeof(int[]) && !(name.StartsWith("[") && name.EndsWith("]")))
                    {
                        propertynull = name;
                        return true;
                    }
                }
            }
            propertynull = string.Empty;
            return false;
        }
    }
}