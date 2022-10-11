using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System.Web.Http;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Kama.Bonyad.Evaluation.WebApp.Startup), "Starting")]
[assembly: WebActivatorEx.PostApplicationStartMethod(typeof(Kama.Bonyad.Evaluation.WebApp.Startup), "Started")]
[assembly: WebActivatorEx.ApplicationShutdownMethod(typeof(Kama.Bonyad.Evaluation.WebApp.Startup), "Stop")]

[assembly: OwinStartup(typeof(Kama.Bonyad.Evaluation.WebApp.Startup))]

namespace Kama.Bonyad.Evaluation.WebApp
{
    public class Startup
    {
        private static void registerTools(AppCore.IOC.IContainer container)
        {
            container.RegisterType<AppCore.IObjectSerializer, Tools.ObjectSerializer>();
            container.RegisterType<Tools.IEventLogger, Tools.Logger>();
            container.RegisterType<Organization.ApiClient.Interface.IOrganizationHostInfo, ServiceHost.OrganizationHost>();
            container.RegisterType<Evaluation.ApiClient.Interface.IEvaluationHostInfo, ServiceHost.EvaluationHost>();
        }

        public static void Starting()
        {
            var container = IOC.Activator.Instance.ActiveMvc(new System.Reflection.Assembly[] { System.Reflection.Assembly.GetExecutingAssembly() });
            registerTools(container);
            AppCore.IOC.Loader.Load(container, System.Web.Hosting.HostingEnvironment.MapPath("~/bin"));
        }

        public static void Started()
        {

        }

        public static void Stop()
            => IOC.Activator.Instance.Deactivate();

        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions { });
            WebApiConfig.Register(config);
            RouteConfig.RegisterRoutes(System.Web.Routing.RouteTable.Routes);
            app.UseWebApi(config);
        }
    }
}