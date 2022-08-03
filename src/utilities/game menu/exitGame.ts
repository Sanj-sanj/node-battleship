import print from "../printToScreen";

export default function exitGame(n = 3) {
  let timer = n;
  print("The game will end in: ");
  setInterval(() => {
    print(timer.toString());
    timer--;
  }, 1000);
  setTimeout(() => process.kill(process.pid), (n + 1) * 1000);
}
