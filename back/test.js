/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var msal = require('@azure/msal-node');

const config = {
    auth: {
        clientId: "07cddba2-fa47-463e-8ff6-a0c0a643f917",
        // clientId: "8d6e4390-256f-4ba6-97ce-1660d2bfb137",
        authority: "https://login.microsoftonline.com/ebeda472-2de6-4a32-957f-6d7607eac909",
        clientSecret: "~Yd7Q~y8Vn3aqmflXZsR650tvH9uE5WRC6DVl",
        // clientSecret: "ocT7Q~E6PpvcU6juaQ_IiXyLqnlCgr8j0_M1C",
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: true,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(config);

cca.acquireTokenByClientCredential({
  scopes: ["04c0b17a-ec85-4f66-9fc7-b09be2733193/.default"],
}).then((response) => {
  console.log("Response: ", response);
}).catch((error) => {
  console.log(JSON.stringify(error));
});
