using Kama.Bonyad.Evaluation.WebApp.Tools;
using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class UserController : BaseController
    {
        private readonly Organization.ApiClient.Interface.IUserService _userService;
        private readonly Organization.ApiClient.Interface.ITokenService _tokenService;
        private readonly Organization.ApiClient.Interface.IPositionService _positionService;

        public UserController(
            Organization.ApiClient.Interface.IUserService userService
            , Organization.ApiClient.Interface.ITokenService tokenService
            , Organization.ApiClient.Interface.IPositionService positionService)
        {
            _userService = userService;
            _tokenService = tokenService;
            _positionService = positionService;
        }
        [HttpPost]
        public async Task<JsonResult> Add(Organization.Core.Model.User model)
        {
            var result = await _userService.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Register(Organization.Core.Model.User model)
        {
            var result = await _userService.Add(model);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> SaveSettings(Organization.Core.Model.UserSetting model)
        {
            var result = await _userService.SaveSetting(model);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> GetSettings()
        {
            var result = await _userService.GetSetting();
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> Edit(Organization.Core.Model.User model)
        {
            var result = await _userService.Edit(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetToken(LoginVM model)
        {
            try
            {
                if (Session["tokenCaptcha"] != null && string.Equals(model.TokenCaptcha, Session["tokenCaptcha"].ToString(), StringComparison.CurrentCultureIgnoreCase) == false)
                    return Json(new { Success = false, Message = "حروف امنیتی را به صورت صحیح وارد کنید", Data = new { Captcha = new Captcha().Generate("tokenCaptcha") } });
                else if (model.LoginType == Organization.Core.Model.LoginType.Unknown
                    || model.LoginType == Organization.Core.Model.LoginType.نام_کاربری_و_کلمه_عبور)
                {
                    if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                        return Json(new { Success = false, Message = "لطفا نام کاربری و کلمه عبور را وارد کنید", Data = new { Captcha = new Captcha().Generate("tokenCaptcha") } });
                }

                Organization.Core.Model.Token tokenInput = new Organization.Core.Model.Token
                {
                    username = model.Username,
                    password = model.Password,
                    CellPhone = model.Cellphone,
                    SecurityStamp = model.SecurityStamp,
                    client_id = Guid.Parse(ConfigurationManager.AppSettings["ClientID"]),
                    grant_type = "password",
                    LoginType = model.LoginType
                };

                var result = await _tokenService.GetToken(tokenInput);
                if (!result.Success)
                    return Json(new { Success = false, result.Message, Data = new { Captcha = new Captcha().Generate("tokenCaptcha") } });

                Session["tokenCaptcha"] = null;

                return Json(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> GetRefreshToken(LoginVM model)
        {
            try
            {
                var result = new AppCore.Result<string>();
                var tokenInput = new Organization.Core.Model.GetRefreshTokenVM
                {
                    refresh_token = model.RefreshToken,
                    client_id = Guid.Parse(ConfigurationManager.AppSettings["ClientID"]),
                    grant_type = "refresh_token"
                };

                result = await _tokenService.GetRefreshToken(tokenInput);
                if (!result.Success)
                    return Json(AppCore.Result.Failure(message: "کاربر گرامی، زمان استفاده از سامانه به پایان رسیده است. لطفا از سامانه خارج شده و مجددا وارد شوید."));

                return Json(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetById(Organization.Core.Model.User model)
        {
            var result = await _userService.Get(model.ID);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetByUsername(Organization.Core.Model.User model)
        {
            var result = await _userService.Get(model.Username);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetByNationalCode(Organization.Core.Model.User model)
        {
            var result = await _userService.GetByNationalCode(model.NationalCode);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetByEmail(Organization.Core.Model.User model)
        {
            var result = await _userService.GetByNationalCode(model.Email);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetCurrentUser()
        {
            var result = await _userService.Get(this.CurrenUserID, null);
            var user = result.Data;
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> List(Organization.Core.Model.UserListVM model)
        {
            var result = await _userService.List(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> ForgotPassword(Organization.Core.Model.User model, string captcha = "")
        {
            try
            {
                if (Session["forgotPasswordCaptcha"] != null && string.Equals(captcha, Session["forgotPasswordCaptcha"].ToString(), StringComparison.CurrentCultureIgnoreCase) == false)
                    return Json(new { Success = false, Message = "حروف امنیتی را به صورت صحیح وارد کنید", Data = new { Captcha = new Captcha().Generate("forgotPasswordCaptcha") } });

                var user = await _userService.Get(model.Username);

                if (!user.Success)
                    return Json(new { Success = false, Message = "خطا در دریافت اطلاعات کاربر", Data = new { Captcha = new Captcha().Generate("forgotPasswordCaptcha") } });

                if (user.Data == null
                    || (user.Data.CellPhone != model.CellPhone.ToString()))
                    return Json(new { Success = false, Message = "کاربری با این مشخصات یافت نشد", Data = new { Captcha = new Captcha().Generate("forgotPasswordCaptcha") } });

                Session["forgotPasswordCaptcha"] = null;
                model.ID = user.Data.ID;
                var result = await _userService.SendSecurityCodeBySms(model);

                if (result.Success)
                    return Json(new { Success = true, Data = new { UserID = user.Data.ID } });
                else
                    return Json(new { Success = false, Message = "خطا در ارسال کد امنیتی", Data = new { } });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> SetPassword(Organization.Core.Model.SetPasswordVM model)
        {
            var result = await _userService.SetPassword(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> SetPasswordWithSecuriyStamp(Organization.Core.Model.SetPasswordWithSecuriyStampVM model)
        {
            var result = await _userService.SetPasswordWithSecuriyStamp(model);
            return Json(result);
        }


        [HttpPost]
        public JsonResult GetCaptcha(string name)
        {
            if (Session[name] != null)
                return Json(new { Success = true, Data = new { Captcha = new Captcha().Generate(name) } });
            else
                return Json(new { Success = true, Data = new { Captcha = "" } });
        }

        [HttpPost]
        public async Task<JsonResult> SendSecurityCode(Organization.Core.Model.User model, string type)
        {
            AppCore.Result result = new AppCore.Result();

            if (type == "sms")
                result = await _userService.SendSecurityCodeBySms(model);
            else if (type == "email")
                result = await _userService.SendSecurityCodeByEmail(model);

            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> VerifyCellPhone(Organization.Core.Model.VerifyCellPhoneVM model)
        {
            var result = await _userService.VerifyCellPhone(model);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> ResetPassword(Organization.Core.Model.User model)
        {
            var result = await _userService.ResetPassword(model);
            return Json(result);
        }

        [HttpPost]
        public JsonResult ValidateSecurityCode(string securityCode)
        {
            if (securityCode == Session["SecurityStamp"].ToString())
                return Json(new { Success = true, Data = new { } });
            else
                return Json(new { Success = false, Data = new { }, Message = "کد فعال‌سازی وارد شده اشتباه است" });
        }
    }

    public class LoginVM
    {
        public Organization.Core.Model.LoginType LoginType { get; set; }
        public string Cellphone { get; set; }
        public string SecurityStamp { get; set; }
        public string RefreshToken { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string TokenCaptcha { get; set; }
    }
}