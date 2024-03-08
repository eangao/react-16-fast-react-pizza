import { useState } from "react";
import { Form } from "react-router-dom";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      {/* to make this form work nicely with React Router, we need to
      replace this with a form component that React Router gives us. */}

      {/* But this is not going to be necessary, because by default,
      React Router will simply match the closest route,
      so there's no need to write order/new, */}
      {/* <Form method="POST" action="order/new"> */}
      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
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
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button>Order now</button>
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
  console.log(data);

  return null;
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
