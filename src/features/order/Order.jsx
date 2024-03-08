// Test ID: IIDSAT

import { useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";

function Order() {
  const order = useLoaderData();

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
    <div>
      <div>
        <h2>Status</h2>

        <div>
          {priority && <span>Priority</span>}
          <span>{status} order</span>
        </div>
      </div>

      <div>
        <p>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      <div>
        <p>Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p>To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
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
