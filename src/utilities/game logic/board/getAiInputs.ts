import { XYCoords } from "../../../types/GameTypes";

export default function getAiInputs(salvo: boolean, remainingAmmo: number) {
  const rngNum = () => Math.floor(Math.random() * 10);
  return new Array(salvo ? remainingAmmo : 1).fill("").map((v, i, arr) => {
    let x = rngNum(),
      y = rngNum();
    while (
      arr.includes((aiInput: XYCoords | string) => {
        if (typeof aiInput === "string") return false;
        return aiInput.x === x && aiInput.y === y;
      })
    ) {
      (x = rngNum()), (y = rngNum());
    }
    return { x: rngNum(), y: rngNum() };
  });
}
