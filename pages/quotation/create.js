import { connectToDB, getConditions, getExchanges } from "../../db";
import { getCountries, getRanges, getSettings } from "../../db/settings";
import { useSession } from "next-auth/client";
import QuotationDetail from "../../components/QuotationDetail";

const Create = (props) => {
  const [session, loading] = useSession();
  const role = session?.user?.role || {};
  const permissions = role.permissions || {};

  if (!permissions.createItem) {
    return <span>You are not authorized.</span>;
  }
  return <QuotationDetail {...props} />;
};

export default Create;

export async function getServerSideProps() {
  const { db } = await connectToDB();

  const conditions = (await getConditions(db)).map((c) => ({ ...c }));
  const countries = await getCountries(db);
  const ranges = await getRanges(db);
  const settings = await getSettings(db);
  const exchanges = await getExchanges(db);

  return { props: { conditions, countries, ranges, settings, exchanges } };
}
