import { getSession } from "next-auth/client";
import QuotationDetail from "../../components/QuotationDetail";
import { connectToDB, getQuotationById } from "../../db";

export default function QuotationPage({ quotation }) {
  return (
    <QuotationDetail {...quotation}/>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session || !session.user) {
    return { props: {} };
  }

  const { db } = await connectToDB();
  const quotation = await getQuotationById(db, ctx.params.quotationId);

  return { props: { quotation } };
}
