import nc from "next-connect";
import { setUserRole, getUserByEmail } from "../../../db";
import middleware from "../../../middleware/all";
import onError from "../../../middleware/error";

const handler = nc({
  onError,
});

handler.use(middleware);
handler.post(async (req, res) => {
  const { role, email } = req.body;
  if (role) {
    const dbUser = await getUserByEmail(req.db, req.user.email);
    const updatedUser = await setUserRole(req.db, dbUser, email, role);
    res.send({ data: updatedUser });
  }
});

export default handler;
