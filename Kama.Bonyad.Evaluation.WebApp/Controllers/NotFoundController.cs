using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class NotFoundController : BaseController
    {
        // GET: NotFound
        public ActionResult Index()
        {
            return View();
        }
    }
}