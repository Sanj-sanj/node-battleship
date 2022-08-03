import { ShipPlotPoints, XYCoords } from "../../../types/GameTypes";

export default function mapSunkShips(
  enemyPositions: ShipPlotPoints[],
  coords: XYCoords[]
) {
  const mappedHits = enemyPositions.map((ship) => {
    let counter = 0;
    let size = 0;
    ship.forEach((pos) =>
      coords.find(({ x, y }) => {
        pos.x === x && pos.y === y ? counter++ : null;
        size = ship.length;
      })
    );
    return { counter, size };
  });
  return mappedHits;
}
