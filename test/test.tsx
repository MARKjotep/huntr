import { dom, frag } from "../src";
import { log } from "../src/@";

function Oki() {
  return (
    <span
      on={{
        click() {},
      }}
    >
      okidok
    </span>
  );
}

const _e: events = {
  ready() {},
};
log.i = (
  <>
    <div on={_e}>
      okay
      <Oki />
      <span>trig</span>
      <img hidden />
    </div>
  </>
);
