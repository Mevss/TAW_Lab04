import { Point, Rectangle } from './rectangle';

const topLeft = new Point(0, 0);
const topRight = new Point(4, 0);
const bottomLeft = new Point(0, 3);
const bottomRight = new Point(4, 3);

const rectangle = new Rectangle(topLeft, topRight, bottomLeft, bottomRight);

console.log('Pole prostokąta:', rectangle.getArea()); // 12
rectangle.move(1, 1);
console.log('Po przesunięciu:', topLeft, topRight, bottomLeft, bottomRight);

rectangle.rotate(90);
console.log('Po obrocie o 90 stopni:', topLeft, topRight, bottomLeft, bottomRight);
