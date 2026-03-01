import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addOne,
  clearCart,
  removeOne,
  removeItem,
  type CartItem,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalItems,
} from "@/store/slices/cart.slice";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TrashIcon } from "lucide-react";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectCartTotalItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const handleDecreaseItem = (productId: number) => () => {
    dispatch(removeOne(productId));
  };

  const handleIncreaseItem = (item: CartItem) => () => {
    dispatch(
      addOne({
        id: item.productId,
        slug: item.slug,
        name: item.title,
        price: item.price,
        productFee: item.productFee,
        deliveryFee: item.deliveryFee,
        image: item.image,
      }),
    );
  };

  const handleCheckoutClick = () => {
    onOpenChange(false);
  };

  const handleRemoveItem = (productId: number) => () => {
    dispatch(removeItem(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2">
            <SheetTitle>Cart</SheetTitle>
          </div>
          <SheetDescription className="flex items-center justify-between">
            {totalItems} item{totalItems === 1 ? "" : "s"} in your cart.
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              disabled={items.length === 0}
            >
              Clear cart
            </Button>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground py-6 text-sm">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-3 pb-4">
              {items.map((item) => (
                <li key={item.productId} className="rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-black/5 h-14 w-14 shrink-0 overflow-hidden rounded-md p-1">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-md border">
                      <button
                        type="button"
                        onClick={handleDecreaseItem(item.productId)}
                        className="hover:bg-muted h-8 w-8 cursor-pointer text-sm"
                        aria-label={`Decrease quantity for ${item.title}`}
                      >
                        -
                      </button>
                      <span className="min-w-9 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncreaseItem(item)}
                        className="hover:bg-muted h-8 w-8 cursor-pointer text-sm"
                        aria-label={`Increase quantity for ${item.title}`}
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-4">
                      <p className="text-sm font-semibold">
                        {formatPrice(
                          String(Number(item.price) * item.quantity),
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveItem(item.productId)}
                        className="text-xs hover:underline cursor-pointer hover:text-destructive/80"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter className="border-t">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">
              {formatPrice(String(subtotal))}
            </span>
          </div>
          <Button asChild onClick={handleCheckoutClick}>
            <Link to="/checkout">Go to checkout</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
