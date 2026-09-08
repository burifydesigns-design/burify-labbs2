import type { JsonLd } from "@/lib/structured-data";

type StructuredDataProps = {
  data: JsonLd | Array<JsonLd | null | undefined> | null | undefined;
};

export function StructuredData({ data }: StructuredDataProps) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is JsonLd => Boolean(item),
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}

export default StructuredData;
