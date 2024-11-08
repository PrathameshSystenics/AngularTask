using System.Collections.Generic;
using System.Data.SqlClient;
using TaskAPI.Database;
using Dapper;
using TaskAPI.Models;
using System.Data;
using System.Linq;
using System;

namespace TaskAPI.Respository
{
    public static class UserRepository
    {


        public static Dictionary<string, List<string>> GetStateCities()
        {
            try
            {
                using (SqlConnection conn = Connection.GetConn())
                {
                    Dictionary<string, List<string>> dictofstatecity = conn.Query<StateCity>("spGetCitiesState", commandType: CommandType.StoredProcedure).GroupBy(e => e.State).ToDictionary(
                        group => group.Key,
                        group => group.Select(sc => sc.City).ToList());

                    return dictofstatecity;

                }
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}