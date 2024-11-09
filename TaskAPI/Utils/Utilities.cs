using System;
using System.IO;
using System.Linq;

namespace TaskAPI.Utils
{
    public static class Utilities
    {
        /// <summary>
        /// Used to Check if the String passed can be converted to array of <see cref="int[]"/> also returns the Converted Array through out.
        /// </summary>
        /// <param name="array">String to be converted to Array of <see cref="int[]"/></param>
        /// <param name="convertedarray">converts the <see langword="string"/> Array into the <see cref="int[]"/></param>
        /// <returns><see langword="true"/> if <paramref name="array"/> can be converted into <see cref="int[]"/></returns>
        public static bool IfInputisArray(string array, out int[] convertedarray)
        {
            try
            {
                if (!String.IsNullOrWhiteSpace(array) && (array.StartsWith("[") && array.EndsWith("]")))
                {
                    convertedarray = array.Trim('[', ']').Split(',').Select(int.Parse).ToArray();
                    return true;
                }
                convertedarray = new int[] { };
                return false;
            }
            catch (Exception)
            {
                convertedarray = new int[] { };
                return false;
            }
        }

        /// <summary>
        /// Saves the file into the Given Path. 
        /// </summary>
        /// <param name="buffers">Buffer of file to save</param>
        /// <param name="savePath">The Path where to save the File</param>
        /// <param name="filename">The Filename with its extension.</param>
        /// <returns><see langword="string"/> of the Saved File otherwise <see langword="null"/></returns>
        public static string SaveFile(byte[] buffers, string savePath, string filename)
        {
            try
            {
                string extension = Path.GetExtension(filename);
                string newFilename = Guid.NewGuid().ToString() + extension;
                string fullpath = Path.Combine(savePath, newFilename);
                File.WriteAllBytes(fullpath, buffers);
                return newFilename;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}