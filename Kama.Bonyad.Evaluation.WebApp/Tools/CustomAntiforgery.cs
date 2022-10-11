using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp
{
    public class CustomAntiforgery : AuthorizeAttribute
    {
        public CustomAntiforgery() { }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            HttpContext context = HttpContext.Current;
            string requestFormToken = httpContext.Request.Headers["__antiForgeryFormToken"];
            HttpCookie requestCookieToken = httpContext.Request.Cookies["__antiForgeryCookieToken"];
            var formTokens = (List<string>)context.Session["antiForgeryFormToken"];
            var cookieTokens = (List<string>)context.Session["antiForgeryCookieToken"];

            bool validFormToken = false;
            bool validCookieToken = false;
            if (formTokens != null)
                for (int i = 0; i < formTokens.Count; i++)
                {
                    if (requestFormToken == formTokens[i])
                    {
                        validFormToken = true;
                        break;
                    }
                }
            if (cookieTokens != null)
                for (int i = 0; i < cookieTokens.Count; i++)
                {
                    if (requestCookieToken.Value == cookieTokens[i])
                    {
                        validCookieToken = true;
                        break;
                    }
                }

            if (validFormToken && validCookieToken)
                return true;
            else
                return false;
        }
    }
}