import EventDetail from "../../../../components/event/EventDetail";

type ParamsShape = {
  locale: string;
  id: string;
};

export default async function Page({ params }: { params: ParamsShape | Promise<ParamsShape> }) {
  const p = await params;
  const { id, locale } = p;
  return <EventDetail eventId={id} locale={locale} />;
}
