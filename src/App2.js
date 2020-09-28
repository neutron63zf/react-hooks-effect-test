import React, { useEffect } from "react";
import { decorate, observable, computed } from "mobx";
import { computedFn } from "mobx-utils";
import { useObserver } from "mobx-react";
import "./App.css";

class Counter {
  count = 0;
  get count2x() {
    return this.count * 2;
  }
  countMul = computedFn(function (num) {
    return this.count * num;
  }).bind(this);
}
decorate(Counter, {
  count: observable,
  count2x: computed,
});

const counterStore = new Counter();

const tunnel = new WeakMap();

const useSetter = (store) => (value) => (store.count = value);

function Inter() {
  // setterだけを取り出すことで再レンダリングを回避する
  const setCount = useSetter(counterStore);
  // weakMapにsetCountを放り込んでどこからでも使えるようにする
  tunnel.set(counterStore, [setCount]);
  // setCountが実行されてもここは実行されない！
  useEffect(() => console.log("mobx inter re-rendered"));
  return (
    <div>
      <UseTunnel></UseTunnel>
    </div>
  );
}

function UseTunnel() {
  // weakMapからsetCountを読み出す
  const [setCount] = tunnel.get(counterStore);
  // useRecoilValueで値だけ取り出す
  const [count, countMul, count2x] = useObserver(() => [
    counterStore.count,
    counterStore.countMul,
    counterStore.count2x,
  ]);
  // setCountを実行するとここだけ実行される
  useEffect(() => console.log("mobx UseTunnel re-rendered"));
  return (
    <div onClick={() => setCount(count + 1)}>
      click: {count}, clickMul3: {countMul(3)}, count2x: {count2x}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Inter />
    </div>
  );
}

export default App;
