const Hello = () => {
  function getText() {
    console.log("hello");
    console.log("hello");
    console.log("hello");
    console.log("hello111");
  }
  function init() {
    let el = document.getElementById("target1");
    el.onpointerup = upHandler;
  }
  function upHandler(e) {
    console.log(e);
    console.log("퇴라좀");
  }
  return (
    <>
      <div onLoad={init}>
        <div id="target1" onPointerOver={() => upHandler()}>
          hello ehterlkajsdf aslkdfjaslkdfj asldkfjasdkfljas
        </div>
      </div>
    </>
  );
};

export default Hello;
