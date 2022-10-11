namespace Kama.Bonyad.Evaluation.WebApp.Tools
{
    public interface IEventLogger : AppCore.EventLogger.IEventLogger
    {
    }

    public class Logger : AppCore.EventLogger.WindowsEventLogger, IEventLogger
    {
        public Logger()
            : base("Kama.Bonyad.Evaluation.Web")
        {
        }
    }
}