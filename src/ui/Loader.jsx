function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm">
      <div className="loader"></div>
    </div>
  );
}

export default Loader;

///////////////////////
// Now the name here might be confusing
// because in React Router, a loader is actually
// a function that fetches some data.
// But well, we are already used to this name of Loader.
// So let's just roll with it here.
