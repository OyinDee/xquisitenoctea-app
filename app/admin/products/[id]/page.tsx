import { Suspense } from "react"
import ProductForm from "./product-form"
import { Metadata } from "next"

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface PageProps {
  params: Params
  searchParams: SearchParams
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params
  return {
    title: `Edit Product ${id} - Admin Dashboard`,
  }
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductForm params={{ id }} />
    </Suspense>
  )
}
