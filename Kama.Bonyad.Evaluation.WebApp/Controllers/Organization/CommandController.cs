using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    [Authorize]
    public class CommandController : BaseController
    {
        public CommandController(Organization.ApiClient.Interface.ICommandService commandService)
        {
            _commandService = commandService;
        }

        readonly Organization.ApiClient.Interface.ICommandService _commandService;

        [HttpPost]
        public async Task<JsonResult> Add(Organization.Core.Model.Command model)
        {
            var result = await _commandService.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Edit(Organization.Core.Model.Command model)
        {
            var result = await _commandService.Edit(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Remove(Guid id)
        {
            var result = await _commandService.Delete(id);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(Organization.Core.Model.CommandListVM model)
        {
            var result = await _commandService.List(model);
            return Json(result);
        }
    }
}