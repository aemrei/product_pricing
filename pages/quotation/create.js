import { connectToDB, getExchangeRates } from "../../db";
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
  return (
    <QuotationDetail {...props}/>
  );
};

export default Create;

export async function getServerSideProps() {
  const { db } = await connectToDB();

  const countries = await getCountries(db);
  const ranges = await getRanges(db);
  const settings = await getSettings(db);
  const exchangeRates = await getExchangeRates(db);

  return { props: { countries, ranges, settings, exchangeRates } };
}
