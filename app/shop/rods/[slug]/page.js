import { notFound } from 'next/navigation'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { getProductByHandle } from '@/utils/shopify/getProductByHandle'
import { getProductsByTagQuery } from '@/utils/shopify/getProductsByTagQuery'
import { FETCH_SERIES_LANDING_PAGE_QUERY as SERIES_Q } from '@/data/queries/pages/FETCH_SERIES_LANDING_PAGE_QUERY'
import { FETCH_PRODUCT_TESTIMONIAL_QUERY as TQ } from '@/data/queries/testimonials/FETCH_PRODUCT_TESTIMONIAL_QUERY'
import { FETCH_GLOBAL_CTA_QUERY as CQ } from '@/data/queries/globalCta/FETCH_GLOBAL_CTA_QUERY'
import PageContainer from '@/components/animations/PageContainer'

async function resolveSlug(slug) {
  const [series, product] = await Promise.all([
    fc(SERIES_Q, { slug }),
    getProductByHandle(slug),
  ])
  return { series, product }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { series, product } = await resolveSlug(slug)
  return { title: series?.name ?? product?.title ?? 'Not Found' }
}

const RodsSlugPage = async ({ params }) => {
  const { slug } = await params
  const { series, product } = await resolveSlug(slug)

  // ----- SERIES LANDING BRANCH -----
  if (series) {
    const tagQuery = `tag:'${series.applicationType}' AND tag:'${series.slug}'`
    const products = await getProductsByTagQuery(tagQuery)

    return (
      <PageContainer>
        <h1>{series.name}</h1>
        <p>{series.description}</p>
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.title} — ${p.priceRange.minVariantPrice.amount}
            </li>
          ))}
        </ul>
      </PageContainer>
    )
  }

  // ----- PRODUCT DETAIL BRANCH -----
  if (product) {
    const seriesTag = product.tags.find((t) => t !== 'open-water' && t !== 'ice') ?? ''

    const [testimonialData, ctaData, seriesInfo] = await Promise.all([
      fc(TQ, { seriesTag }),
      fc(CQ),
      fc(SERIES_Q, { slug: seriesTag }),
    ])

    const testimonial = testimonialData?.matched || testimonialData?.default
    const ctaBanner = ctaData?.productCtaBanner

    return (
      <PageContainer>
        <nav>In-Stock Rods / {seriesInfo?.name ?? seriesTag} / {product.title}</nav>
        <h1>{product.title}</h1>
        <p>${product.priceRange.minVariantPrice.amount}</p>
        <p>{product.description}</p>
        {testimonial && <blockquote>{testimonial.pullQuote}</blockquote>}
      </PageContainer>
    )
  }

  notFound()
}

export default RodsSlugPage
export const revalidate = 10