using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class SmsSecurityStampController : BaseController
    {
        public SmsSecurityStampController(Organization.ApiClient.Interface.ISmsSecurityStampService smsSecurityStampService)
        {
            _smsSecurityStampService = smsSecurityStampService;
        }

        readonly Organization.ApiClient.Interface.ISmsSecurityStampService _smsSecurityStampService;

        [HttpPost]
        public async Task<JsonResult> Send(Organization.Core.Model.SmsSecurityStamp model)
        {
            var result = await _smsSecurityStampService.Send(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Verify(Organization.Core.Model.SmsSecurityStamp model)
        {
            var result = await _smsSecurityStampService.Verify(model);
            if (result.Success)
                Session["tokenCaptcha"] = null;
            return Json(result);
        }
    }
}