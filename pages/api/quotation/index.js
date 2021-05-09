import { NextApiResponse } from "next";
import nc from "next-connect";
import { createQuotation } from "../../../db";
import middleware from "../../../middleware/all";
import onError from "../../../middleware/error";

const handler = nc({
  onError,
});

handler.use(middleware);
handler.post(async (req, res) => {
  const newDoc = await createQuotation(req.db, {
    ...req.body,
    createdByFullName: req.user.name,
    createdBy: req.user.email,
  });
  res.send({ data: newDoc });
});

export default handler;
