import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection'
import { FETCH_REELS_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_REELS_PAGE_QUERY'
import PageContainer from '@/components/animations/PageContainer'
import Link from 'next/link'

export async function generateMetadata() {
  return BPM({ slug: '/shop/reels', query: Q })
}

const ReelsHub = async () => {
  const [data, products] = await Promise.all([
    fc(Q),
    getProductsByCollection('reels'),
  ])

  return (
    <PageContainer>
      <div className="grid gap-4 p-8">
        <div>{data?.hero?.heading}</div>
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`/shop/reels/${p.handle}`}>
                {p.title} — ${p.priceRange.minVariantPrice.amount}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  )
}

export default ReelsHub

export const revalidate = 10