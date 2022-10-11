using System;
using System.Collections.Generic;
using System.Reflection;
using UserType = Kama.Organization.Core.Model.UserType;

namespace Kama.Bonyad.Evaluation.WebApp
{
    public static class Extensions
    {
        public static Guid? ToGuid(this string s)
        {
            if (string.IsNullOrWhiteSpace(s))
                return null;

            Guid result = Guid.Empty;
            if (Guid.TryParse(s, out result))
                return result;
            else
                return null;
        }

        public static Guid? GetUserId(this System.Security.Principal.IIdentity identity)
        {
            var claimIdentity = identity as System.Security.Claims.ClaimsIdentity;
            return claimIdentity.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value?.ToGuid();
        }

        public static Guid? GetOrganizationId(this System.Security.Principal.IIdentity identity)
        {
            var claimIdentity = identity as System.Security.Claims.ClaimsIdentity;
            return claimIdentity.FindFirst("OrganizationID")?.Value?.ToGuid();
        }

        public static UserType GetUserType(this System.Security.Principal.IIdentity identity)
        {
            UserType result = UserType.Unknown;
            var claimIdentity = identity as System.Security.Claims.ClaimsIdentity;
            Enum.TryParse(claimIdentity.FindFirst("UserType")?.Value, out result);
            return result;
        }
    }
}