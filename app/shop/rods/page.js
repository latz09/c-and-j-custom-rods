import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { getProductsByTagQuery } from '@/utils/shopify/getProductsByTagQuery'
import { FETCH_IN_STOCK_RODS_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_IN_STOCK_RODS_PAGE_QUERY'
import { FETCH_ALL_RODSERIES_QUERY as SERIES_Q } from '@/data/queries/rodSeries/FETCH_ALL_RODSERIES_QUERY'
import PageContainer from '@/components/animations/PageContainer'
import Link from 'next/link'

export async function generateMetadata() {
  return BPM({ slug: '/shop/rods', query: Q })
}

const InStockRods = async () => {
  const [data, seriesList] = await Promise.all([
    fc(Q),
    fc(SERIES_Q),
  ])

  const seriesWithProducts = await Promise.all(
    (seriesList ?? []).map(async (series) => {
      const products = await getProductsByTagQuery(
        `tag:'${series.applicationType}' AND tag:'${series.slug}'`
      )
      return { ...series, products }
    })
  )

  return (
    <PageContainer>
      <div className="grid gap-8 p-8">
        <div>{data?.page?.title}</div>

        {seriesWithProducts.map((series) => (
          <div key={series.slug}>
            <Link href={`/shop/rods/${series.slug}`}>
              <h2>{series.name}</h2>
            </Link>
            <ul>
              {series.products.map((p) => (
                <li key={p.id}>
                  <Link href={`/shop/rods/${p.handle}`}>
                    {p.title} — ${p.priceRange.minVariantPrice.amount}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

export default InStockRods

export const revalidate = 10