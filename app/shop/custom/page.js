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
      <div className="section-x-padding mt-1 lg:mt-2 mb-3 lg:mb-5">
        <section className="relative overflow-hidden rounded bg-gradient-to-t from-[#858585]/10 to-accent/0 px-1.25 py-2.5 lg:py-3.5 text-center">
          <Topography variant="light" fade={false} />
          <div className="relative z-10 space-y-1.25 lg:space-y-1.5">
            <h1 className="mx-auto max-w-[60rem]">{hero?.headline}</h1>
            <p className="text-subheading">{hero?.subheadline}</p>
          </div>
        </section>
      </div>

      <SeriesPicker series={seriesWithPrice} labels={seriesPicker} />
    </PageContainer>
  )
}

export default CustomBuilder

export const revalidate = 10
