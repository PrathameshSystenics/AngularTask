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

        /// <summary>
        /// Getting the State and Cities from the Database and returing it in the form of Dictionary
        /// </summary>
        /// <returns>Dictionary of key as state and list of city for related key.</returns>
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

        /// <summary>
        /// The List of Interest from the database
        /// </summary>
        /// <returns>List of Interest Class</returns>
        public static List<Interests> GetInterests()
        {
            try
            {
                using (SqlConnection conn = Connection.GetConn())
                {
                    return conn.Query<Interests>("spGetInterests", commandType: CommandType.StoredProcedure).ToList();
                }
            }
            catch (Exception)
            {
                return new List<Interests>();
            }
        }



        public static bool AddUser(User user)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@interesttable", ToDataTable(user.IdofInterests).AsTableValuedParameter("interests"), DbType.Object);
                parameters.Add("@FirstName", user.FirstName, DbType.String);
                parameters.Add("@LastName", user.LastName, DbType.String);
                parameters.Add("@Email", user.Email, DbType.String);
                parameters.Add("@Password", user.Password, DbType.String);
                parameters.Add("@DateOfBirth", user.DateOfBirth, DbType.DateTime);
                parameters.Add("@Age", user.Age, DbType.Int32);
                parameters.Add("@Gender", user.Gender, DbType.String);
                parameters.Add("@State", user.State, DbType.String);
                parameters.Add("@City", user.City, DbType.String);
                parameters.Add("@Address", user.Address, DbType.String);
                parameters.Add("@PhoneNo", user.PhoneNo, DbType.String);
                parameters.Add("@Profile", user.Profile, DbType.String);
                parameters.Add("@issuccess", dbType: DbType.Int32, direction: ParameterDirection.Output);

                using (SqlConnection conn = Connection.GetConn())
                {
                    conn.Open();

                    int rowsaffected = conn.Execute("spAddUser", parameters, commandType: CommandType.StoredProcedure);
                    return parameters.Get<int>("@issuccess") == 1;
                }

            }
            catch (Exception)
            {
                return false;
            }
        }

        public static DataTable ToDataTable(int[] interestsid)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add(new DataColumn("interestid"));

            //Adding the rows into the datatable
            foreach (int id in interestsid)
            {
                dt.Rows.Add(id);
            }
            return dt;
        }
    }
}