import { notFound } from 'next/navigation'
import { getProductByHandle } from '@/utils/shopify/getProductByHandle'
import { getProductsByCollection } from '@/utils/shopify/getProductsByCollection'
import PageContainer from '@/components/animations/PageContainer'
import ApparelProductDetail from '@/components/sections/apparel/ApparelProductDetail'
import CallToAction from '@/components/ui/CallToActions'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProductByHandle(slug)
  return { title: product?.title ?? 'Product' }
}

const ApparelProductPage = async ({ params }) => {
  const { slug } = await params

  const [product, allApparel] = await Promise.all([
    getProductByHandle(slug),
    getProductsByCollection('apparel'),
  ])

  if (!product) notFound()

  return (
    <PageContainer>
      <ApparelProductDetail product={product} allApparel={allApparel} />
      		<CallToAction variant='triple' />
    </PageContainer>
  )
}

export default ApparelProductPage
export const revalidate = 10