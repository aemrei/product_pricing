import { useSession } from "next-auth/client";
import QuotationList from "../components/QuotationList";
import { connectToDB, getQuotations } from "../db";

export default function Home({ quotations = [] }) {
  const [session, loading] = useSession();
  const role = session?.user?.role || {};
  const permissions = role.permissions || {};

  if (!permissions?.readList) {
    return <span>You are not authorized.</span>;
  }
  return <QuotationList quotations={quotations}/>;
}

export async function getServerSideProps(ctx) {
  const { db } = await connectToDB();

  const quotations = await getQuotations(db);

  return { props: { quotations } };
}
