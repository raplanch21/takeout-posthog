import { useCallback } from 'react'
import { usePostHog } from '@posthog/react'
import { useStoreDispatch } from './store'
import type { Order } from './store'
import { useUI } from './ui'

/**
 * Refills the cart from a past order and opens the drawer so the next step is
 * obvious. Shared by the tracking screen and order history.
 */
export function useReorder(): (order: Order) => void {
  const dispatch = useStoreDispatch()
  const { openCart, notify } = useUI()
  const posthog = usePostHog()

  return useCallback(
    (order: Order) => {
      dispatch({
        type: 'cart/replace',
        restaurantId: order.restaurantId,
        lines: order.lines,
      })
      posthog?.capture('order_reordered', {
        order_id: order.id,
        restaurant_id: order.restaurantId,
        restaurant_name: order.restaurantName,
      })
      notify(`${order.restaurantName} order added to your cart`)
      openCart()
    },
    [dispatch, notify, openCart, posthog],
  )
}
