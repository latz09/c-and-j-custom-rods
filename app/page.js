import { buildPageMetadata as BPM } from '@/utils/seo/buildPageMetadata'
import { fetchContent as fc } from '@/utils/cms/fetchContent'
import { getProductByHandle } from '@/utils/shopify/getProductByHandle'
import { FETCH_HOME_PAGE_QUERY as Q } from '@/data/queries/pages/FETCH_HOME_PAGE_QUERY'
import PageContainer from '@/components/animations/PageContainer'
import { Typography } from '@/components/design/Typography'
import ColorPalette from '@/components/design/ColorPalette'
import ButtonPreviews from '@/components/design/ButtonPreviews'
import Link from 'next/link'

const CATEGORY_PATHS = {
  rods: '/shop/rods',
  reels: '/shop/reels',
  apparel: '/shop/apparel',
}

export async function generateMetadata() {
  return BPM({ slug: '/', query: Q })
}

const Home = async () => {
  const data = await fc(Q)

  const featuredProduct = data?.featuredProduct?.productHandle
    ? await getProductByHandle(data.featuredProduct.productHandle)
    : null

  const featuredProductPath = featuredProduct
    ? `${CATEGORY_PATHS[data?.featuredProduct?.category] ?? '/shop/rods'}/${featuredProduct.handle}`
    : null

  return (
    <PageContainer>
      <div className="grid place-items-center gap-2">
        <div>{data?.title}</div>

        {featuredProduct && (
          <div className="grid place-items-center gap-1">
            <p>{data?.featuredProduct?.eyebrow}</p>
            <Link href={featuredProductPath}>
              <h2>{featuredProduct.title}</h2>
            </Link>
            <p>${featuredProduct.priceRange.minVariantPrice.amount}</p>
          </div>
        )}

        <Typography />
        <ColorPalette />
        <ButtonPreviews />
      </div>
    </PageContainer>
  )
}

export default Home

export const revalidate = 10