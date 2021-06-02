import { NextApiResponse } from "next";
import nc from "next-connect";
import { createQuotation, updateQuotation } from "../../../db";
import middleware from "../../../middleware/all";
import onError from "../../../middleware/error";

const handler = nc({
  onError,
});

handler.use(middleware);
handler.post(async (req, res) => {
  console.log({createDocument: req.body})
  const newDoc = await createQuotation(req.db, {
    ...req.body,
    createdByFullName: req.user.name,
    createdBy: req.user.email,
  });
  res.send({ data: newDoc });
});

handler.put(async (req, res) => {
  console.log({updateDocument: req.body})
  const newDoc = await updateQuotation(req.db, req.body._id, {
    ...req.body,
    updatedByFullName: req.user.name,
    updatedBy: req.user.email,
  });
  res.send({ data: newDoc });
});

export default handler;
