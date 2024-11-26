"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rectangle_1 = require("./rectangle");
const topLeft = new rectangle_1.Point(0, 0);
const topRight = new rectangle_1.Point(4, 0);
const bottomLeft = new rectangle_1.Point(0, 3);
const bottomRight = new rectangle_1.Point(4, 3);
const rectangle = new rectangle_1.Rectangle(topLeft, topRight, bottomLeft, bottomRight);
console.log('Pole prostokąta:', rectangle.getArea()); // 12
rectangle.move(1, 1);
console.log('Po przesunięciu:', topLeft, topRight, bottomLeft, bottomRight);
rectangle.rotate(90);
console.log('Po obrocie o 90 stopni:', topLeft, topRight, bottomLeft, bottomRight);
