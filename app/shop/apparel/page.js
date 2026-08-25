import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection'
import { FETCH_APPAREL_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_APPAREL_PAGE_QUERY'
import PageContainer from '@/components/animations/PageContainer'
import ApparelHero from '@/components/sections/apparel/ApparelHero'
import ApparelGrid from '@/components/sections/apparel/ApparelGrid'

export async function generateMetadata() {
  return BPM({ slug: '/shop/apparel', query: Q })
}

const ApparelHub = async () => {
  const [data, products] = await Promise.all([
    fc(Q),
    getProductsByCollection('apparel'),
  ])

  return (
    <PageContainer>
      <ApparelHero data={data?.hero} />

      <ApparelGrid products={products} className='grid md:grid-cols-2 lg:grid-cols-3  gap-2 px-2 lg:px-4 py-4' />
    </PageContainer>
  )
}

export default ApparelHub

export const revalidate = 10