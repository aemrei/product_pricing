import { nanoid } from "nanoid";

export const getQuotationById = async (db, id) => {
  return db.collection("quotations").findOne({ _id: id });
};

export const getQuotationsByUser = async (db, userId) => {
  return db.collection("quotations").find({ userId }).toArray();
};

export const getQuotations = async (db) => {
  return db.collection("quotations").find().toArray();
};

export const createQuotation = async (db, quotation) => {
  const createdAt = new Date().toDateString();
  return db
    .collection("quotations")
    .insertOne({
      _id: nanoid(12),
      ...quotation,
      createdAt,
      updatedAt: createdAt,
    })
    .then(({ ops }) => ops[0]);
};

export const updateQuotation = async (db, id, updates) => {
  const updatedAt = new Date().toDateString();
  const operation = await db.collection("quotations").updateOne(
    {
      _id: id,
    },
    { $set: { ...updates, updatedAt } },
  );

  if (!operation.result.ok) {
    throw new Error("Could not update quotation");
  }

  const updated = await db.collection("quotations").findOne({ _id: id });
  return updated;
};
