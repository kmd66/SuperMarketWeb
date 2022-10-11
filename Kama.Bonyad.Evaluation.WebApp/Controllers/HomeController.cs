using System.Collections.Generic;
using System.Security.Claims;
using System.Web.Helpers;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class HomeController : BaseController
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetOnlineUsersCount()
        {
            return Json(new { Success = true, Data = new { OnlineUserCount = 16 } });
        }

        [HttpPost]
        public ActionResult Init()
        {
            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
            if (System.Web.HttpContext.Current.User.Identity.GetUserId() != null)
            {
                ViewBag.Strings = new InsideStrings
                {
                    AppName = "سامانه ارزیابی"
                    , Help = "راهنمای سامانه"
                    , ChangePosition = "تغییر جایگاه سازمانی"
                    , HomePage = "صفحه‌اصلی"
                    , Theme = "تم‌سامانه"
                    , FullScreen = "تمام‌صفحه"
                    , Messages = "پیام‌ها"
                    , Exit = "خروج"
                };
                return View("~/Views/Inside/Index.cshtml");
            }
            else
                return View("~/Views/Outside/Index.cshtml");
        }

        [HttpPost]
        public JsonResult IsAuthenticated()
        {
            if (System.Web.HttpContext.Current.User.Identity.GetUserId() != null)
                return Json(new { Success = true, Data = new { Authenticated = true } });
            else
                return Json(new { Success = true, Data = new { Authenticated = false } });
        }

        //public static class Shared
        //{
        //    public static int onlineUserCount { get; set; }
        //}
        public class InsideStrings
        {
            public string AppName { get; set; }
            public string Help { get; set; }
            public string ChangePosition { get; set; }
            public string HomePage { get; set; }
            public string Theme { get; set; }
            public string FullScreen { get; set; }
            public string Messages { get; set; }
            public string Exit { get; set; }
        }
    }
}