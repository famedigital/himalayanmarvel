/**
 * JsonLd Component
 *
 * Renders JSON-LD structured data as a script tag for SEO.
 * Supports multiple schema types including Organization, TouristTrip, Article, FAQ, and more.
 *
 * Note: This component only renders on the server to avoid hydration issues.
 */

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[]
}

export default function JsonLd({ data }: JsonLdProps) {
  // Only render on server to avoid hydration warnings
  if (typeof window !== 'undefined') {
    return null
  }

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
