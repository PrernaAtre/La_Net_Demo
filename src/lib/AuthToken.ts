import { NextPageContext } from "next";
import nookies from "nookies";

const cookieAge = 60 * 60 * 24; // 24 hours

class AuthToken {
  static get(context?: NextPageContext) {
    const cookies = nookies.get(context);
    return cookies.token;
  }

  static remove() {
    nookies.destroy(null, "token");
  }

  static set(token: string, ctx?: NextPageContext) {
    // Mostly executed on client end, no need context
    nookies.set(ctx || null, "token", token, {
      maxAge: cookieAge,
      path: "/",
    });
  }
}

export default AuthToken;
