import * as msal from "@azure/msal-browser";

import { AAD_TENANT, AAD_APPLICATION } from "../../config";

// The scope means "current application only", so Microsoft Graph access is not granted
const AAD_SCOPES = [`${AAD_APPLICATION}/.default`]

const msalConfig: msal.Configuration = {
  auth: {
    clientId: AAD_APPLICATION,
    authority: `https://login.microsoftonline.com/${AAD_TENANT}`,
    navigateToLoginRequestUrl: false,
    redirectUri: '/login'
  },
  cache: {
    cacheLocation: 'localStorage'
  }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

const login = async () => {
  try {
    if (location.pathname === '/login') {
      const loginResult = await msalInstance.handleRedirectPromise()
      msalInstance.setActiveAccount(loginResult.account)
      location.href = loginResult.state
    } else {
      await msalInstance.acquireTokenRedirect({ scopes: AAD_SCOPES, state: location.href });
    }
  } catch (e) {
    console.log("login:", e);
    return null;
  }
};

const renewLogin = async () => {
  try {
    return await msalInstance.acquireTokenSilent({
      scopes: AAD_SCOPES
    });
  } catch (e) {
    console.log("renewLogin:", e);
    return null;
  }
};

const verify = async (loginResult: msal.AuthenticationResult) => {
  console.log(loginResult);

  const response = await fetch("http://localhost:5550/", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idToken: loginResult.idToken })
  });

  console.log("server verified: ", await response.json())
}

(async () => {
  let result = await renewLogin();
  if (!result) await login();

  await verify(result);

  const next = async () => {
    result = await renewLogin();
    await verify(result);
    setTimeout(next, 1000 * 60 * 10); // Renew
  };

  next();
})();
