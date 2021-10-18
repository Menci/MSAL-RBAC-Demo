import { Issuer } from "openid-client";
import { JWT } from "jose";

import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { AAD_TENANT, AAD_APPLICATION } from "../config.mjs";

const issuer = await Issuer.discover(`https://login.microsoftonline.com/${AAD_TENANT}`);
const keystore = await issuer.keystore();

const app = Express();

app.use(cors());
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const idToken = req.body.idToken;
  try {
    const result = JWT.verify(idToken, keystore);
    if (result.tid !== AAD_TENANT || result.aud !== AAD_APPLICATION) {
      throw new Error("ID Token is for wrong tenant / application!")
    }
    res.send(result);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.listen(5550);
