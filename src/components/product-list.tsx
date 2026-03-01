import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categories.slice";
import { fetchProducts } from "@/store/slices/products.slice";
import { addOne, removeOne } from "@/store/slices/cart.slice";
import {
  LOADING_CATEGORIES,
  LOADING_PRODUCTS,
} from "@/lib/constants/loading.constants";
import { CustomLoading } from "./custom-loading";

interface ProductListProps {
  category?: string;
}

export function ProductList({ category }: ProductListProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const { products } = useAppSelector((state) => state.products);
  const cartItemsById = useAppSelector((state) => state.cart.itemsById);
  const [userSelectedCategory, setUserSelectedCategory] = useState("all");
  const selectedCategory = category ?? userSelectedCategory;

  const handleSelectCategory = (categorySlug: string) => {
    setUserSelectedCategory(categorySlug);
  };

  const handleDecreaseProduct = (productId: number) => () => {
    dispatch(removeOne(productId));
  };

  const handleIncreaseProduct =
    (product: {
      id: number
      slug: string
      name: string
      price: string
      productFee: string
      deliveryFee: string
      image?: string
    }) =>
    () => {
      dispatch(addOne(product));
    };

  useEffect(() => {
    void dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    void dispatch(fetchProducts(selectedCategory));
  }, [dispatch, selectedCategory]);

  return (
    <section className="bg-muted/50 rounded-xl p-6">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">Catalog</h2>
        <p className="text-muted-foreground text-sm">
          Available products from your API.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2 relative">
        <button
          type="button"
          onClick={() => handleSelectCategory("all")}
          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground hover:bg-muted"
          }`}
        >
          All
        </button>

        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelectCategory(item.slug)}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === item.slug
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground hover:bg-muted"
            }`}
          >
            {item.name}
          </button>
        ))}

        <CustomLoading watch={[LOADING_CATEGORIES]} />
      </div>

      <div className="relative min-h-[200px]">
        {products.length === 0 ? (
          <p className="text-muted-foreground text-sm">No products found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="bg-card rounded-lg border p-4 transition-shadow hover:shadow-md">
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="mb-3 aspect-[16/10] overflow-hidden rounded-md bg-black/5 p-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  <h3 className="line-clamp-2 text-sm font-medium">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {product.category?.name}
                  </p>
                </Link>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {formatPrice(product.price)}
                  </p>
                  <div className="inline-flex items-center rounded-md border">
                    <button
                      type="button"
                      onClick={handleDecreaseProduct(product.id)}
                      className="hover:bg-muted h-8 w-8 cursor-pointer text-sm"
                      aria-label={`Remove one ${product.name}`}
                    >
                      -
                    </button>
                    <span className="min-w-9 text-center text-sm font-medium">
                      {cartItemsById[String(product.id)]?.quantity ?? 0}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncreaseProduct(product)}
                      className="hover:bg-muted h-8 w-8 cursor-pointer text-sm"
                      aria-label={`Add one ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                </article>
            ))}
          </div>
        )}
        <CustomLoading watch={[LOADING_PRODUCTS]} />
      </div>
    </section>
  );
}
