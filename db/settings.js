import { nanoid } from "nanoid";

const CATEGORY_FEE = "fee";
const CATEGORY_USER = "user";
const CATEGORY_PRODUCT = "product";
const CATEGORY_INTERFACE = "interface";

export const CATEGORY_LIST = [
  {
    _id: CATEGORY_FEE,
    title: "Other fees",
  },
  {
    _id: CATEGORY_INTERFACE,
    title: "Per interface prices",
  },
  {
    _id: CATEGORY_PRODUCT,
    title: "Product prices",
  },
  {
    _id: CATEGORY_USER,
    title: "Per user prices",
  },
];

export const createSetting = async (db, setting) => {
  return db
    .collection("settings")
    .insertOne({
      _id: nanoid(12),
      ...setting,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0]);
};

export const getSettings = async (db) => {
  return db.collection("settings").find().toArray();
};

export const getSettingsByCategory = async (db, category) => {
  return db.collection("settings").find({ category }).toArray();
};

export const createRange = async (db, range) => {
  return db
    .collection("ranges")
    .insertOne({
      _id: nanoid(12),
      ...range,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0]);
};

export const getRanges = async (db) => {
  return db.collection("ranges").find().toArray();
};

export const getRangesByCategory = async (db, category) => {
  return db.collection("ranges").find({ category }).toArray();
};

export const getCountries = async (db) => {
  const countries = await db.collection("countries").find().toArray();
  return countries.map(c => ({
    key: c._id,
    value: c.text,
    ...c,
  }));
};

export const getProductSettings = async (db) => {
  return await getSettingsByCategory(db, CATEGORY_PRODUCT);
};
