import { StytchB2BUIClient } from "https://www.unpkg.com/@stytch/vanilla-js@2.0/dist/b2b/index.esm.js";

// Replace this value with the public token found it your Stytch Dashboard.
const STYTCH_PUBLIC_TOKEN = "{{YOUR_TOKEN_HERE}}";

// Export stytch so that the other scripts in this application can interact with it.
export const stytch = new StytchB2BUIClient(STYTCH_PUBLIC_TOKEN);

/*
Session logic

The logic below listens to the existence of a Stytch Session to:
- redirect newly authenticated traffic to /profile.
- redirect unauthenticated traffic to /profile.
- redirect the user back to login if they log out.
*/
const ROUTES = {
  LOGIN: "/",
  AUTHENTICATE: "/authenticate",
  PROFILE: "/profile",
};

const PROTECTED_ROUTES = [ROUTES.PROFILE];
const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.AUTHENTICATE];

// On page load, we check for the existence of a cached session.
let cachedSession = stytch.session.getSync();
// If there is no session, and we are on a protected route then redirect the user to Login.
if (!cachedSession && PROTECTED_ROUTES.includes(window.location.pathname)) {
  window.location.href = ROUTES.LOGIN;
}

const unsubscribe = stytch.session.onChange((session) => {
  if (session) {
    if (PUBLIC_ROUTES.includes(window.location.pathname)) {
      window.location.href = ROUTES.PROFILE;
    }
  } else {
    if (PROTECTED_ROUTES.includes(window.location.pathname)) {
      window.location.href = ROUTES.LOGIN;
    }
  }
});

// On page close unsubscribe the onChange listener.
window.addEventListener("beforeunload", () => {
  unsubscribe && unsubscribe();
});
