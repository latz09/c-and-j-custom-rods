import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { FETCH_CUSTOM_BUILDER_PAGE_QUERY as METADATA_Q } from '@/data/queries/pages/FETCH_CUSTOM_BUILDER_PAGE_QUERY'
import { FETCH_BUILDER_PAGE_QUERY as Q } from '@/data/queries/builder/FETCH_BUILDER_PAGE_QUERY'
import { getBuilderProducts } from '@/utils/shopify/getBuilderProducts'
import PageContainer from '@/components/animations/PageContainer'
import Topography from '@/components/ui/Topography'
import SeriesPicker from '@/components/sections/rod-builder/SeriesPicker'

export async function generateMetadata() {
  return BPM({ slug: '/shop/custom', query: METADATA_Q })
}

const CustomBuilder = async () => {
  const [data, products] = await Promise.all([fc(Q), getBuilderProducts()])
  const { page, series } = data ?? {}
  const { hero, seriesPicker } = page ?? {}

  // "Starting at" comes from Shopify. Until the helper products exist it is null and the card hides it.
  const seriesWithPrice = (series ?? []).map((s) => ({
    ...s,
    startingPrice: products.base[s.slug]?.price ?? null,
  }))

  return (
    <PageContainer>
      <section className="relative">
        <Topography />
        <div className="relative">
          <h1>{hero?.headline}</h1>
          <p>{hero?.subheadline}</p>
        </div>
      </section>

      <SeriesPicker series={seriesWithPrice} labels={seriesPicker} />
    </PageContainer>
  )
}

export default CustomBuilder

export const revalidate = 10
