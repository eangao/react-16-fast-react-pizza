import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';

import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import store from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addresStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);

  const isLoadingAddress = addresStatus === 'loading';

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  //   So the component that is wired up with this action,
  // so this component remember, is connected with this action
  // because we set so here in this route definition.
  // {
  //   path: "/order/new",
  //   element: <CreateOrder />,
  //   action: createOrderAction,
  // },
  // And so therefore, in this component we can now get access
  // to the data that is returned from that action.
  // So it is yet another custom hook
  // that we are going to need here.
  // And so let's call the result of this one here formErrors
  //   But the most common use case of this hook
  // is to actually do what we are doing right now.
  // So to return some errors that we can then display right here
  // in the user interface.
  const formErrors = useActionData();
  const dispatch = useDispatch();

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* to make this form work nicely with React Router, we need to
      replace this with a form component that React Router gives us. */}

      {/* But this is not going to be necessary, because by default,
      React Router will simply match the closest route,
      so there's no need to write order/new, */}
      {/* <Form method="POST" action="order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            required
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addresStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>

          {!position.latitude && !position.longtitude && (
            <span className=" absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px] ">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/*

          Now next up we also want to get our cart data
          here into this action.
          So the cart is right here in this component,
          but we also now want to basically submit it in the form
          so that we can then get access to it in the action.
          So you might think that we can just use this variable here
          right in the action, but later on,
          this cart will actually come from Redux.
          And so then we can really only get this cart
          right here in the component.
          
          Now, thankfully for us, there is a nice way
        of actually getting some data into the action
        without it being a form field.
        So what we can do is a hidden input.
        So we can do that anywhere in the form,
        but let's just do it here at the very end.
        So if we set it to type hidden, and the name to cart,
        and the value to JSON.stringify,
        because this cart is right now an object,
        but here we can only have strings.
        So we need to convert this to a string here.
        So if we do it like this, then later on,
        when we submit this form again,
        it should then show up right here in our form data as well.
        So let's actually try that immediately.
        And there it is.
        So right there, but what about this priority field?
        So I think I have to actually select it here
        in order for it to show up.
        And indeed, there it is.
        So now we have priority on.
        So we have our raw data right here in the action now,
        but we need to model it a little bit.
        So this priority should be always existent
        in the data that we are going to submit,
        and it should be true or false, not just on.
        And of course the cart also needs to be converted
        back to an object. */}

          {/* So let's just recap quickly what we did here before,
        which was to basically pass that cart here
        as a hidden field.
        So we converted this cart to a string,
        and assign that to the value of this hidden input field.
        And the reason why we had to do
        that is because we are not able to get the data
        from Redux here in this action.
        I mean, there would actually be a way around this,
        but like this, even though it's a bit of a hack and a trick,
        this is actually a bit cleaner than doing that now, right. */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />

          {/* And then as the last step,
        we, of course, also need to get this data then
        here into our form action.
        So right here in the form action,
        when we submit the new order,
        we will also want to submit it
        with the actual position data,
        so with the user's GPS location,
        because that's going to be really important
        or really helpful for the company
        to deliver the pizza.
        And so let's use the same trick that we used here
        for the cart.
        So let's do another hidden input field, */}
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}`
                : ''
            }
          />

          <Button disabled={isSubmitting} type="primary">
            {isSubmitting || isLoadingAddress
              ? 'Placing order...'
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// we need to specify,
// or we need to create an action.
// And so this is similar to the loaders
// that we created earlier.
// So we will also create now a function
// that we are going to export from here.
// So export function, and then by default,
// as a convention, we just call this function action.

// Now, as soon as we submit this special form here,
// that will then create a request that will basically
// be intercepted by this action function
// as soon as we have it connected with React Router.
export async function action({ request }) {
  //   which is this request that we just got, .formData.
  // And this is actually just a regular web API.
  // So this form data here is provided by the browser.
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // if everything is okay, create new order and redirect
  const newOrder = await createOrder(order);
  /////////////////////
  //   createOrder function
  // actually returns the newly created object.
  // So the new order is actually returned.
  // And so the nice thing about that
  // is that we can now await that here.
  // So we can call this here newOrder.
  // And then what we will want to do
  // is to immediately redirect the page to the order/ID.
  // So basically showing the user all the information
  // about that new order.
  // So basically what we implemented in the previous lecture.
  // So let's do that here, but we cannot do it
  // using the navigate function, because the navigate function
  // comes from calling the useNavigate hook,
  // but we cannot call hooks inside this function.
  // So hooks can only be called inside components.
  // And so here we need to use another function,
  // which is called redirect.
  // So this is basically another function that is provided to us
  // by React Router, which basically will just create
  // a new response or a new request.
  // I'm not really sure, but it's also not so important.
  // What matters is that behind the scenes,
  // all of this really works with the web API's
  // standard request and response API's.
  // And so if from here we return a new response,
  // then React Router will automatically go
  // to the URL that is contained in that new response.
  // So again, this redirect here will actually create
  // that response, which we can see right here
  // in this TypeScript definition.

  // So again, this new order that we get here
  // is already the new object that is coming back
  // from the API as a response of calling this function here.
  // And so this will then already contain the ID,
  ////////

  ///////////////////////////////////////////
  //   So usually after you place an order,
  // then your cart gets automatically emptied out.
  // And so let's implement that here as well,
  // even though it is not going to be super easy.
  // So we will have to use some kind of hack here again
  // because clearly the dispatching of the clear cart action
  // will need to happen right here inside this form action.
  // However, for dispatching,
  // we need to call the use dispatch hook,
  // which is only available in components
  // and not in a regular function like this one.
  // So the hack that we can use
  // and which we should really, really not overuse
  // is to directly import the store object here
  // into this function and then dispatch directly on that store.
  //   a bit of a hacky approach
  // but this is what we have to do in order to make it work.
  // But really don't overuse this technique
  // because it deactivates a couple of performance optimizations
  // of Redux on this page.
  //DO NOT OVERUSE
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;

///////////////////////

// how we can use React Router's actions
// to write data or to mutate data on the server.
// So while the loaders that we used earlier are to read data,
// actions are used to write data or to mutate data.
// So a state that is stored on some server.
// Or in other words, actions allow us
// to manage this remote server state using action functions
// and forms that we then wire up to routes
// similar to what we did earlier with the loaders.
// Okay, so remember from the project requirements
// that orders are made by sending a post request
// with the order data to the API.
// And so these actions and forms
// that we just talked about are ideal to create new orders.

// works completely without any JavaScript
// and without any onSubmit handlers, for example.
// So all we have is this form here,
// and then React Router takes care of the rest.

// We also didn't have to create any state variables here
// for each of these input fields,
// and we didn't even have to create a loading state.
// So React Router will do all of this automatically
// without us having to do anything.
// And the idea behind all this is to basically allow us
// to go back to the basics, so to the way HTML used to work
// back in the day before everyone started using JavaScript
// for the front end.
// So back then, we simply created HTML forms
// similar to this one, and then when we submitted them,
// a request was sent to the server,
// which then did the work that it needed to.
// So this here is now very similar.
// The only difference is that the data then gets
// into this action where we can then do our action.
