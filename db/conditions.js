import { nanoid } from "nanoid";

export const getConditionById = async (db, id) => {
  return db.collection("conditions").findOne({ _id: id });
};

export const getConditions = async (db) => {
  return db.collection("conditions").find({DELETED: {$ne: true}}).sort({settingsOrder: 1}).toArray();
};

export const updateCondition = async (db, id, updates) => {
  const updatedAt = new Date().toISOString();
  const operation = await db.collection("conditions").updateOne(
    {
      _id: id,
    },
    { $set: { ...updates, updatedAt } },
  );

  if (!operation.result.ok) {
    throw new Error("Could not update condition");
  }

  const updated = await db.collection("conditions").findOne({ _id: id });
  return updated;
};

export const updateConditions = async (db, conditions) => {
  await Promise.all(conditions.map(c => db.collection("conditions").findOneAndUpdate({_id: c._id}, {$set: c}, {upsert: true})))
  return db.collection("conditions").remove({DELETED: true});
}
