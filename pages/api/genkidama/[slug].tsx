import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { api } from "./src/api";
import { swapSide } from "./src/apihelper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StoryFile {
  id: number,
  msg: string,
  img?: string,
}

interface ApiRes {
  [key: string]: any,
}

interface Handler {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => void
}

type StoryProm = Promise<{ index: number, stories: string }>

function defaultResolve(thisResponse: NextApiResponse, apiResponse: any) {
  if (apiResponse) {
    return thisResponse.json(apiResponse);
  } else {
    return thisResponse.json(null);
  }
}

function story(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).send(`Method ${req.method} is not allowed`);
  }
  const dir = path.join(__dirname, "story");
  const proms: StoryProm[] = [];
  fs.readdir(dir, (err, data) => {
    if (err) throw err;
    for (const file of data) {
      if (file.startsWith("story") && file.endsWith(".json")) {
        /**retrieve index from filename. filename ex ->story1.json */
        const index = parseInt(file.slice(-6, -5));
        const filepath = path.join(dir, file);
        const prom: StoryProm = new Promise((resolve, reject) => {
          const content = fs.promises.readFile(filepath, "utf8");
          content.then(_data => {
            const stories: string = JSON.parse(_data).map((elem: StoryFile) => elem["msg"]);
            resolve({ index: index, stories: stories });
          });
        });
        proms.push(prom);
      }
    }
    Promise.all(proms)
      .then(stories => res.json(stories))
      .catch(err => {
        console.log(err);
      })
  });
}

async function ticker(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).send(`Method ${req.method} is not allowed`);
  }
  await api("ticker")
    .then(apires => {
      return defaultResolve(res, apires)
    })
    .catch(err => {
      console.log(err)
      res.status(400).send("Something went wrong at ticker.")
    })

}

async function valuation(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).send(`Method ${req.method} is not allowed`);
  }
  await api("margin")
    .then(apires => defaultResolve(res, apires))
    .catch(e => console.log(e))
}

async function positions(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).send(`Method ${req.method} is not allowed`);
  }
  const params = req.query;
  await api("positions", { "params": params, "keys": ["list"] })
    .then(apires => defaultResolve(res, apires))
    .catch(e => console.log(e))
}

async function exec(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send(`Method ${req.method} is not allowed`);
  }
  const { pair, side, amt, pwd } = req.body;
  /**open */
  await api("order", {
    body: {
      "symbol": pair,
      "side": side,
      "executionType": "MARKET",
      "size": amt
    }
  })
    .then((orderId) => {
      if (orderId) {
        const opt = { params: { "orderId": orderId }, keys: ["list"] };
        api("executions", opt)
          .then((data) => {
            //正常
            if (data) {
              //@ts-ignore
              const id = data[0]["positionId"];
              let params;
              if (id) {
                params = { "positionId": id }
              } else {
                params = null;
              }
              return res.json(params);
            }
          })
          .catch(err => {
            //建玉ID取得失敗
            console.trace(err);
            return res.json(null);
          });
      } else {
        return res.json(null);
      }
    })
    .catch(err => {
      console.trace(err)
      res.json({ "status": -1, "msg": "取引に失敗しました。時間をおいて試してください。" });
    })
}

async function close(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send(`Method ${req.method} is not allowed`);
  }
  const { pair, side, amt, id } = req.body;
  const body = {
    "symbol": pair,
    "side": swapSide(side),
    "executionType": "MARKET",
    "settlePosition": [{
      "positionId": id,
      "size": amt
    }]
  };
  await api("close", { body: body })
    .then(data => {
      if (data)
        res.json({ "message": "SUCCESS! Thank you!", "orderId": data })
      else
        res.json(null);
    })
    .catch(err => console.trace(err))
}

const handler: Handler = {
  story: story,
  ticker: ticker,
  valuation: valuation,
  positions: positions,
  exec: exec,
  close: close,
};

function router(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  if (!slug) {
    return res.status(401).send(`Woah, gotta weird path! @${slug}`);
  }
  const fn = handler[slug as string];
  return fn(req, res);
}

export default router;