import { notFound } from 'next/navigation'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { getProductByHandle } from '@/utils/shopify/getProductByHandle'
import { FETCH_PRODUCT_TESTIMONIAL_QUERY as TQ } from '@/data/queries/testimonials/FETCH_PRODUCT_TESTIMONIAL_QUERY'
import { FETCH_GLOBAL_CTA_QUERY as CQ } from '@/data/queries/globalCta/FETCH_GLOBAL_CTA_QUERY'
import PageContainer from '@/components/animations/PageContainer'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  return { title: product?.title ?? 'Not Found' }
}

const ReelProductPage = async ({ params }) => {
  const { slug } = await params

  const [product, testimonialData, ctaData] = await Promise.all([
    getProductByHandle(slug),
    fc(TQ, { seriesTag: '' }),
    fc(CQ),
  ])

  if (!product) notFound()

  const testimonial = testimonialData?.matched || testimonialData?.default
  const ctaBanner = ctaData?.productCtaBanner

  return (
    <PageContainer>
      <h1>{product.title}</h1>
      <p>${product.priceRange.minVariantPrice.amount}</p>
      <p>{product.description}</p>
      {testimonial && <blockquote>{testimonial.pullQuote}</blockquote>}
    </PageContainer>
  )
}

export default ReelProductPage
export const revalidate = 10