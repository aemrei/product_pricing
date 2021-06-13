import nc from "next-connect";
import { updateConditions } from "../../../db";
import middleware from "../../../middleware/all";
import onError from "../../../middleware/error";

const handler = nc({
  onError,
});

handler.use(middleware);
handler.put(async (req, res) => {
  const { conditions } = req.body;
  if (conditions) {
    await updateConditions(req.db, conditions);
  }
  res.send({ data: "ok" });
});

export default handler;
