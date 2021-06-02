import nc from "next-connect";
import { getUserByEmail, updateRole } from "../../../db";
import middleware from "../../../middleware/all";
import onError from "../../../middleware/error";

const handler = nc({
  onError,
});

handler.use(middleware);
handler.post(async (req, res) => {
  const { text } = req.body;
  if (text) {
    const dbUser = await getUserByEmail(req.db, req.user.email);
    const updatedRole = await updateRole(req.db, dbUser, req.body);
    res.send({ data: updatedRole });
  }
});

export default handler;
