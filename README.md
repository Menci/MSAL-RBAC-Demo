1. Create an AAD application in Azure Portal and configure app roles and role assignment.
2. Copy `config-example.mjs` to `config.mjs` and fill tenant ID and application ID (client ID).
3. `yarn install`.
4. Run `yarn serve` in `front`.
5. Run `node index.mjs` in `back`.
6. Check your frontend URL, if it's `http://localhost:3000`, enter `http://localhost:3000/login` as your app's **Redirect URIs** in Azure Portal.
7. Visit your frontend URL, open DevTools and login to AAD. You'll see the result in Console.
