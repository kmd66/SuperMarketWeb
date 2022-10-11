using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.ServiceHost
{
    using WebConfig = System.Web.Configuration.WebConfigurationManager;
    public class EvaluationHost : ApiClient.Interface.IEvaluationHostInfo
    {
        public string Host
            => WebConfig.AppSettings["EvaluationHost"];

        public IDictionary<string, string> GetDefaultHeaders()
        {
            var strHeaders = WebConfig.AppSettings["EvaluationHostHeaders"];
            var items = strHeaders.Split(',')
                                  .Select(e => { var segments = e.Split(':'); return new Tuple<string, string>(segments[0], segments[1]); });

            string use_ip = HttpContext.Current.Request.Headers["X-Forwarded-For"];

            if (string.IsNullOrWhiteSpace(use_ip))
                use_ip = HttpContext.Current.Request.UserHostAddress;

            var headers = new Dictionary<string, string>();

            headers.Add("X-Forwarded-For", use_ip);
            var urlHelper = new UrlHelper(HttpContext.Current.Request.RequestContext);
            headers.Add("App-URL", string.Format("{0}://{1}", urlHelper.RequestContext.HttpContext.Request.Url.Scheme, urlHelper.RequestContext.HttpContext.Request.Url.Authority));
            headers.Add("ApplicationID", WebConfig.AppSettings["ApplicationID"]);
            headers.Add("user-agent", HttpContext.Current.Request.UserAgent);

            foreach (var item in items)
                headers.Add(item.Item1, item.Item2);

            var authHeader = HttpContext.Current.Request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authHeader))
                headers.Add("Authorization", $"{authHeader}");

            return headers;
        }
    }
}