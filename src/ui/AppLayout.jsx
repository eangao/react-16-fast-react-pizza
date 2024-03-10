import { Outlet, useNavigation } from 'react-router-dom';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header';
import Loader from './Loader';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="grid  h-screen grid-rows-[auto_1fr_auto] ">
      {/* So here, we will not have conditional rendering
      where we show either this or the Loader
      but instead, we will always show this.
      But if we are currently loading
      then we will also show the Loader. */}
      {isLoading && <Loader />}

      <Header />
      <div className=" overflow-scroll">
        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
  );
}

export default AppLayout;

///////////////////////////////////////
// And as I click in menu(localhost:5173/menu), you will see
// that there is a small delay
// between the click and the data actually arriving.
// So that's taking some time here.
// And so during that time, we of course want to display
// like a loading spinner or some other loading indicator.
// Now, in order to be able to display an indicator like this,
// we need to know whether this data
// is actually being loaded right now, right?
// So currently, we don't have that information
// anywhere here yet, right?
// So there's no like is loading state somewhere to be seen.
// And so, we now need to get that information
// into our application.
// And in React Router, we can get access
// to this by using the useNavigation hook.
// So not use navigate, but really useNavigation.
// And with this we will be able to see whether the application
// is currently idle, whether it is loading or submitting.
// And this information is actually for the entire application.
// So not just for one page, but really here
// for the entire router.
// So if one of these pages here is loading, then
// the navigation state will become loading no matter which
// of these pages is actually being loaded.
// Therefore, it doesn't make much sense to create the loader
// right here.
// So that loading indicator in the menu component.
// So this is not where we will need to display it
// because we will never really know whether it is actually
// this data here that is being loaded.
// So instead, let's just do one generic big loader right here.
