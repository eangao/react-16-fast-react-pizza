import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// // async function fetchAddress() -> was deleted
// this is an async function
// which means that we cannot just call this function
// directly inside a Redux reducer
// because remember Redux is by nature completely synchronous,
// and so that's why we now need to talk about Thunks again.
// So we learned all about Thunks back in the Redux section
// which you can of course revisit and review,
// but basically all you need to know at this point
// is that a Thunk is a middleware
// that sits between the dispatching
// and the reducer itself.
// So it will do something to the dispatched action
// before actually updating the store.
// Now back then when we wanted
// to use Thunks with Redux Toolkit,
// we manually created our own action creator
// and placed the Thunk in there
// so instead of using Redux Toolkit's
// native way of creating a Thunk,
// but now let's actually do that.
// //////////////
// we should not call it something like getAddress
// because those names are reserved for selectors.
// So by convention, these names for the AsyncThunks
// should not be called something with get
export const fetchAddress = createAsyncThunk(
  // And so this createAsyncThunk receives two things.
  // First, we need to pass in the action name,
  // so that's gonna be user and then fetchAddress
  //   where we passed in the action type name
  // and so that's this one right here
  // which we will never manually use,
  // but still Redux needs this internally.
  'user/fetchAddress',

  // and then second, we need to pass in an async function
  // that will return the payload for the reducer later.
  // So this function needs to return the promise
  // and so an async function is ideal here.
  // a second argument,
  //   we pass in the actual Thunk function,
  //   so the code that we want to execute
  //   as soon as this action here will be dispatched.
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    // Payload of the FULFILLED state
    return { position, address };
  },

  //  what's special about this is that this createAsyncThunk
  //   will basically produce three additional action types.
  //   So one for depending promise state,
  //   one for the fulfilled state,
  //   and one for the rejected state.
  //   And so now we need to handle these cases
  //   separately back in our reducers
  //   and so this is how we then connect this Thunk
  //   with our reducers down here.
);

const initialState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },

  //   Now what's special about this is that this createAsyncThunk
  // will basically produce three additional action types.
  // So one for depending promise state,
  // one for the fulfilled state,
  // and one for the rejected state.
  // And so now we need to handle these cases
  // separately back in our reducers
  // and so this is how we then connect this Thunk
  // with our reducers down here.
  // So let's do that
  // and here the syntax is actually pretty confusing again.
  // So here we need to now specify these extra reducers
  // which will then get something called a builder.
  // So this is basically a function here
  // and then on this builder we call addCase.
  // So again, pretty confusing here,
  // but this is just the way Redux Toolkit works
  // and it's the reason why I didn't show you this earlier.
  // But anyway, here now let's use
  // that function that we just created, so that fetchAddress,
  // and then here we are going to handle the pending state.
  // So .pending, and then here is where the actual reducer
  // finally comes into play.
  // So here we can now get the state and the action again
  // and so here what we will want to do is to update the state
  // by setting the status to loading.
  // Okay, and so let's actually now update
  // also our initial state.
  // So besides this username,
  // we now need a few more things here.
  // So let's start with a status
  // and let's make it by default idle.
  // And then as soon as we start loading,
  // so that's this pending state,
  // we set it to loading right here.
  // Just place this into these curly braces
  // and then we also want to store the user's position.
  // Let's start here with this empty object, the address,
  // and also some possible error.
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = 'loading';
      })
      // So for the fulfilled state,
      // so the case when there is success,

      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = 'idle';
      })
      // and also the rejected state for an error.
      //       And finally, let's add a case for a possible error.
      // So for example, when the user doesn't accept geolocation,
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;
