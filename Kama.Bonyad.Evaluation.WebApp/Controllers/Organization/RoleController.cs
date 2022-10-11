using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    [Authorize]
    public class RoleController : BaseController
    {
        public RoleController(Organization.ApiClient.Interface.IRoleService roleService)
        {
            _roleService = roleService;
        }

        readonly Organization.ApiClient.Interface.IRoleService _roleService;

        [HttpPost]
        public async Task<JsonResult> Add(Organization.Core.Model.Role model)
        {
            model.ApplicationID = this.ApplicationID;
            var result = await _roleService.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Edit(Organization.Core.Model.Role model)
        {
            var result = await _roleService.Edit(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Remove(Organization.Core.Model.Role model)
        {
            var result = await _roleService.Delete(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(Organization.Core.Model.RoleListVM model)
        {
            var result = await _roleService.List(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Guid id)
        {
            var result = await _roleService.Get(id);
            return Json(result);
        }
    }
}