// Test ID: IIDSAT

import { useFetcher, useLoaderData } from 'react-router-dom';

import OrderItem from './OrderItem';

import { getOrder } from '../../services/apiRestaurant';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from '../../utils/helpers';
import { useEffect } from 'react';

function Order() {
  const order = useLoaderData();

  ///////////////////////
  // sometimes we need to fetch some data from another route,
  // so basically data that is not associated
  // with this current page right here,
  // but we want to do that
  // without causing a navigation sometimes.
  // So, for example, let's say that here in the order page,
  // we wanted to load the menu data again,
  // and we already wrote all the logic
  // for fetching exactly that data,
  // but it is associated to another route.
  // So, to the menu route and not to this one,
  // but still we want to use it here,
  // because there is no point in writing that logic again.
  // So, in other words, what we want to do
  // is to use the data from the menu route,
  // but without the user actually going there.
  // And, so, for that, we can use the useFetcher hook.
  const fetcher = useFetcher();

  //   And, so what we want to do is to extend
  // each of these items here with their ingredients
  // and so we can get that data from the menu route.
  // So, what we want to do is,
  // right after this component mounts
  // we want to fetch that menu data using our fetcher.
  // then let's again use our friend use effect.
  useEffect(
    function () {
      console.log(fetcher);
      if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu');
    },
    [fetcher],
  );

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : 'Order should have arrived'}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-b border-t">
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.pizzaId}
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={
              fetcher?.data?.find((el) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
    </div>
  );
}

/////////////////////
// So we do await getOrder, but now remember
// that this needs to receive the ID.
// So, how do we get the ID from the
// URL right into this function?
// Well, we previously used the useParams hook, right?
// So something like this. However, since this is a hook
// it only works inside components.
// It doesn't work in regular functions.

// But, luckily for us, React Router has, of course,
// thought of the situation, and therefore it passes
// in some data into the loader function as it calls it,
// and one of the properties of the object that
// the loader function receives is exactly the params.
// So, we de-structure that object here
// and get out the params.
// And so, here, we then get params.orderId
// and it is called orderId because that is
// exactly the name that we gave it here.
// { path: "/order/:orderId", element: <Order /> },
export async function loader({ params }) {
  const order = await getOrder(params.orderId);

  return order;
}

export default Order;
