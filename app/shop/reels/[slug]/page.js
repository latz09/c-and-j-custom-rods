import { notFound } from 'next/navigation'
import { getProductByHandle } from '@/utils/shopify/getProductByHandle'
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection'
import PageContainer from '@/components/animations/PageContainer'
import ReelProductDetail from '@/components/sections/reels/ReelProductDetail'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  return { title: product?.title ?? 'Not Found' }
}

const ReelProductPage = async ({ params }) => {
  const { slug } = await params

  const [product, allReels] = await Promise.all([
    getProductByHandle(slug),
    getProductsByCollection('reels'),
  ])

  if (!product) notFound()

  return (
    <PageContainer>
      <ReelProductDetail product={product} allReels={allReels} />
    </PageContainer>
  )
}

export default ReelProductPage
export const revalidate = 10