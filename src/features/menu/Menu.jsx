import { useLoaderData } from 'react-router-dom';
import { getMenu } from '../../services/apiRestaurant';
import MenuItem from './MenuItem';

function Menu() {
  //   And so as I mentioned earlier, for that,
  // we can use a custom hook, which is called useLoaderData.
  // And here we don't have to pass in anything into the function
  // because React Router will, of course, automatically know
  // that the data that we want here is the one
  // that is associated to this page.
  //////////////
  // { path: "/menu", element: <Menu />, loader: menuLoader },
  // And so that's the data coming from this exact loader here.
  const menu = useLoaderData();

  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

export async function loader() {
  const menu = await getMenu();

  return menu;
}

export default Menu;

//////////////////////////////////
// Let's now learn about React Router's
// powerful new data loading feature,
// which is called loaders.
// So the idea behind a loader is that somewhere in our code
// we create a function that fetches some data from an API.
// We then provide that loader function to one of our routes
// and that route will then fetch that data
// as soon as the application goes to that route.
// And then in the end, once the data has arrived,
// it will be provided
// to the page component itself using a custom hook.
// So that sounds a bit confusing.
// And so let's actually implement this with code.
// And I want to start by fetching the menu data.
// So again, we do this in three steps.
// First, we create a loader.
// Second, we provide the loader, and third,
// we provide the data to the page.
// Now, this data loader can be placed anywhere
// in our code base
// but the convention seems to be to place the loader
// for the data of a certain page inside the file of that page.

/////////////////////////////////////////
// And so we successfully connected this loader function now
// to this page.
// And effectively what we just did here was to implement
// or to use a render as you fetch strategy
// because the nice thing about this
// is that React Router will actually start fetching the data
// at the same time as it starts rendering the correct route.
// So these things really happen at the same time,

// while what we did before using useEffect was always a fetch
// on render approach.
// So basically, we rendered the component first,
// and then after the component was already rendered
// is when we then would start to fetch the data.
// And so that would then create
// so-called data loading waterfalls, but not here.

// So here everything really happens at the same time,
// which is a really nice
// and really modern thing to do as well.
// So with this, what we just did,
// React Router is no longer only responsible
// for matching component to URLs in the browser
// but to also provide the data that is necessary
// for each page.

// So again, in this case, for providing the menu data
// using the menuLoader to the menu page here.
// And this is really useful because URLs pages
// and the data that pages require
// are very often tightly coupled together.
// And so it is really practical
// in these situations to get both the page
// and the data all in one place.
