/**
 * JsonLd Component
 *
 * Renders JSON-LD structured data as a script tag for SEO.
 * Supports multiple schema types including Organization, TouristTrip, Article, FAQ, and more.
 */

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[]
}

export default function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  )
}
