namespace TaskAPI.Models
{
    public class Message
    {
        public string message { get; set; }

        public string status { get; set; } = "";

        public dynamic result { get; set; } = "";

    }
}