import { getSession } from "next-auth/client";
import { connectToDB, getQuotationById } from "../../db";

export default function QuotationDetail() {
  return <div>test</div>;
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  console.log({ session });
  if (!session || !session.user) {
    return { props: {} };
  }

  const { db } = await connectToDB();
  const quotation = await getQuotationById(db, ctx.params.quotationId);

  return { props: { quotation } };
}
