using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using static Kama.Bonyad.Evaluation.WebApp.Controllers.HomeController;

namespace Kama.Bonyad.Evaluation.WebApp
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            MvcHandler.DisableMvcResponseHeader = true;
        }

        //protected void Session_Start(object sender, EventArgs e)
        //{
        //    //Session.Timeout = 120;
        //    //if (Shared.onlineUserCount == 0)
        //    //    Shared.onlineUserCount = 1;
        //    //else
        //    //    Shared.onlineUserCount += 1;
        //}

        //protected void Application_BeginRequest(object sender, EventArgs e)
        //{

        //}

        //protected void Application_AuthenticateRequest(object sender, EventArgs e)
        //{

        //}

        //protected void Application_Error(object sender, EventArgs e)
        //{

        //}

        //protected void Session_End(object sender, EventArgs e)
        //{
        //    //Shared.onlineUserCount -= 1;
        //}

        //protected void Application_End(object sender, EventArgs e)
        //{

        //}

        //protected void Application_EndRequest(object sender, System.EventArgs e)
        //{
        //    // If the user is not authorised to see this page or access this function, send them to the error page.
        //    if (Response.StatusCode == 401)
        //    {
        //        Response.ClearContent();
        //        Response.Write("{\"Code\": 401, \"Success\": false, \"Message\": \"زمان اعتبار شما به پایان رسیده، مجددا وارد سامانه شوید\"}");
        //        Response.ContentType = "text/html";
        //    }
        //}
    }
}
