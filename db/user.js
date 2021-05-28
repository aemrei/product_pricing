import { ObjectId } from "mongodb";

export const getUserById = async (db, id) => {
  const result =
    (await db
      .collection("users")
      .aggregate(
        { $match: { _id: new ObjectId(id) } },
        { $lookup: { from: "roles", localField: "role", foreignField: "_id", as: "role" } },
        { $unwind: { path: "$role" } },
      )
      .get()) || [];

  return result;
};

export const getUserByEmail = async (db, email) => {
  return db.collection("users").findOne({ email });
};

export const getUsers = async (db) => {
  return db.collection("users").find({}).sort({ name: 1 }).toArray();
};

export const getRoles = async (db) => {
  return db.collection("roles").find({}).sort({ order: 1 }).toArray();
};

export async function updateRole(db, currentUser, role) {
  if (currentUser.admin) {
    return db.collection("roles").findOneAndUpdate({ _id: role._id }, { $set: role });
  }
}

export async function setUserRole(db, currentUser, email, role) {
  if (currentUser.admin) {
    const operation = db.collection("users").updateOne({ email }, { $set: { role } });
    return operation;
  }
}
