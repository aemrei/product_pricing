import nc from "next-connect";
import { updateRanges, updateSettings } from "../../../db";
import middleware from "../../../middleware/all";
import onError from "../../../middleware/error";

const handler = nc({
  onError,
});

handler.use(middleware);
handler.put(async (req, res) => {
  console.log({ result: req.body });
  const { settings, ranges, products } = req.body;
  if (settings) {
    await updateSettings(req.db, settings);
  }
  if (ranges) {
    await updateRanges(req.db, ranges);
  }
  res.send({ data: "ok" });
});

export default handler;
