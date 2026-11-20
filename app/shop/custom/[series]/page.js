import { notFound } from 'next/navigation'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { FETCH_BUILDER_SERIES_QUERY as Q } from '@/data/queries/builder/FETCH_BUILDER_SERIES_QUERY'
import { getBuilderProducts } from '@/utils/shopify/getBuilderProducts'
import PageContainer from '@/components/animations/PageContainer'
import BuilderShell from '@/components/sections/rod-builder/BuilderShell'
import CallToAction from '@/components/ui/CallToActions'


export async function generateMetadata({ params }) {
  const { series: slug } = await params
  const catalog = await fc(Q, { slug })
  return { title: catalog?.name ? `Custom ${catalog.name} | Rod Builder` : 'Not Found' }
}

const BuilderPage = async ({ params }) => {
  const { series: slug } = await params
  const [catalog, products] = await Promise.all([fc(Q, { slug }), getBuilderProducts()])

  // Only live series can be built (the query returns null otherwise).
  if (!catalog) notFound()

  const { page, ...series } = catalog
  // Base price is Shopify's. Null until the Custom Rod Build product exists (Phase 7).
  const basePrice = products.base[series.slug]?.price ?? null

  return (
    <PageContainer>
      <BuilderShell
        catalog={series} 
        copy={page?.builderCopy}
        rules={page?.pricingRules}
        basePrice={basePrice}
      />
      <div className="mt-2 lg:mt-4">
      <CallToAction variant='custom' /></div>
    </PageContainer>
  )
}

export default BuilderPage

export const revalidate = 10
