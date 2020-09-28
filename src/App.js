import React, { useEffect } from "react";
import { RecoilRoot, atom, useRecoilValue, useSetRecoilState } from "recoil";
import "./App.css";

const counterStateAtom = atom({
  key: "counterState",
  default: 0,
});

const tunnel = new WeakMap();

function Inter() {
  // setterだけを取り出すことで再レンダリングを回避する
  const setCount = useSetRecoilState(counterStateAtom);
  // weakMapにsetCountを放り込んでどこからでも使えるようにする
  tunnel.set(counterStateAtom, [setCount]);
  // setCountが実行されてもここは実行されない！
  useEffect(() => console.log("inter re-rendered"));
  return (
    <div>
      <UseTunnel></UseTunnel>
    </div>
  );
}

function UseTunnel() {
  // weakMapからsetCountを読み出す
  const [setCount] = tunnel.get(counterStateAtom);
  // useRecoilValueで値だけ取り出す
  const count = useRecoilValue(counterStateAtom);
  // setCountを実行するとここだけ実行される
  useEffect(() => console.log("UseTunnel re-rendered"));
  return <div onClick={() => setCount(count + 1)}>click: {count}</div>;
}

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <Inter />
      </div>
    </RecoilRoot>
  );
}

export default App;
