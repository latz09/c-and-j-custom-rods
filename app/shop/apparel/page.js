import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection'
import { FETCH_APPAREL_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_APPAREL_PAGE_QUERY'
import PageContainer from '@/components/animations/PageContainer'
import Link from 'next/link'

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
      <div className="grid gap-4 p-8">
        <div>{data?.hero?.heading}</div>
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`/shop/apparel/${p.handle}`}>
                {p.title} — ${p.priceRange.minVariantPrice.amount}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  )
}

export default ApparelHub

export const revalidate = 10