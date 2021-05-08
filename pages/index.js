import QuotationList from "../components/QuotationList";
import { connectToDB, getQuotations } from "../db";

export default function Home({ quotations = [] }) {
  return <QuotationList quotations={quotations}/>;
}

export async function getServerSideProps(ctx) {
  const { db } = await connectToDB();

  const quotations = await getQuotations(db);

  return { props: { quotations } };
}
