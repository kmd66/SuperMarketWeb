using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Kama.Bonyad.Evaluation.WebApp.Tools;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    [CustomJsonFilter]
    //[CustomAntiforgery]
    public class BaseController : Controller
    {
        protected Guid CurrenUserID
            => User.Identity.GetUserId().Value;

        protected Guid ApplicationID
            => new Guid(System.Configuration.ConfigurationManager.AppSettings["ApplicationID"]);

        protected Organization.Core.Model.UserType UserType
            => User.Identity.GetUserType();
    }
}