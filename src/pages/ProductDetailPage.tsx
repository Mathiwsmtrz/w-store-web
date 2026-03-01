import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchProductBySlug } from '@/store/slices/products.slice'
import { addOne, removeOne } from '@/store/slices/cart.slice'
import { CustomLoading } from '@/components/custom-loading'
import { LOADING_PRODUCT_DETAIL } from '@/lib/constants/loading.constants'

export function ProductDetailPage() {
  const dispatch = useAppDispatch()
  const { slug } = useParams<{ slug: string }>()
  const { selectedProduct: product } = useAppSelector((state) => state.products)
  const cartItemsById = useAppSelector((state) => state.cart.itemsById)
  const isLoading = useAppSelector((state) =>
    state.storeLoading.activeLoadings.includes(LOADING_PRODUCT_DETAIL),
  )

  useEffect(() => {
    if (!slug) {
      return
    }
    void dispatch(fetchProductBySlug(slug))
  }, [dispatch, slug])

  const handleDecreaseProduct = (productId: number) => {
    dispatch(removeOne(productId))
  }

  const handleIncreaseProduct = (currentProduct: {
    id: number
    slug: string
    name: string
    price: string
    productFee: string
    deliveryFee: string
    image?: string
  }) => {
    dispatch(addOne(currentProduct))
  }

  if (!slug) {
    return (
      <section className="rounded-xl border bg-card p-6">
        <p className="text-sm text-destructive">Product slug is required.</p>
        <Link to="/" className="mt-4 inline-flex text-sm text-primary hover:underline">
          Back to catalog
        </Link>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">Loading product detail...</p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="rounded-xl border bg-card p-6">
        <p className="text-sm text-destructive">Product not found.</p>
        <Link to="/" className="mt-4 inline-flex text-sm text-primary hover:underline">
          Back to catalog
        </Link>
      </section>
    )
  }

  return (
    <section className="relative rounded-xl border bg-card p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-black/5 p-2">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category?.name ?? 'Uncategorized'}
          </p>
          <h1 className="mt-2 text-2xl font-semibold">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold">{formatPrice(product.price)}</p>
          <div className="mt-4 inline-flex items-center rounded-md border">
            <button
              type="button"
              onClick={() => handleDecreaseProduct(product.id)}
              className="h-9 w-9 cursor-pointer text-sm hover:bg-muted"
              aria-label={`Remove one ${product.name}`}
            >
              -
            </button>
            <span className="min-w-10 text-center text-sm font-medium">
              {cartItemsById[String(product.id)]?.quantity ?? 0}
            </span>
            <button
              type="button"
              onClick={() => handleIncreaseProduct(product)}
              className="h-9 w-9 cursor-pointer text-sm hover:bg-muted"
              aria-label={`Add one ${product.name}`}
            >
              +
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {product.description ?? 'No description available for this product.'}
          </p>
          <div className="mt-6 flex gap-6 text-sm">
            <p>
              <span className="text-muted-foreground">Product fee:</span>{' '}
              {formatPrice(product.productFee)}
            </p>
            <p>
              <span className="text-muted-foreground">Delivery fee:</span>{' '}
              {formatPrice(product.deliveryFee)}
            </p>
          </div>
          <Link to="/" className="mt-6 inline-flex text-sm text-primary hover:underline">
            Back to catalog
          </Link>
        </div>
      </div>
      <CustomLoading watch={[LOADING_PRODUCT_DETAIL]} />
    </section>
  )
}
