import PaymentStatus from "../PaymentStatus";
export const dynamic = "force-dynamic";
export const metadata = { title: "Payment status | Burify Labs", robots: { index: false, follow: false } };
export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference = "" } = await searchParams;
  return <PaymentStatus reference={reference}/>;
}
