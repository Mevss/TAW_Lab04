// Interfejs definiujący metodę move
export interface Movable {
    move(deltaX: number, deltaY: number): void;
}

// Klasa Point implementująca interfejs Movable
export class Point implements Movable {
    constructor(public x: number, public y: number) {
        this.validateCoordinates(x, y);
    }

    private validateCoordinates(x: number, y: number): void {
        if (typeof x !== 'number' || typeof y !== 'number') {
            throw new Error('Współrzędne muszą być liczbami');
        }
        if (isNaN(x) || isNaN(y)) {
            throw new Error('Współrzędne nie mogą być NaN');
        }
        if (!isFinite(x) || !isFinite(y)) {
            throw new Error('Współrzędne muszą być skończonymi liczbami');
        }
    }

    move(deltaX: number, deltaY: number): void {
        this.validateCoordinates(deltaX, deltaY);
        this.x += deltaX;
        this.y += deltaY;
    }
}

// Klasa Rectangle implementująca interfejs Movable
export class Rectangle implements Movable {
    protected points: Point[];

    constructor(
        topLeft: Point,
        topRight: Point,
        bottomLeft: Point,
        bottomRight: Point
    ) {
        this.points = [topLeft, topRight, bottomLeft, bottomRight];
        this.validateRectangle();
    }

    private validateRectangle(): void {
        // Sprawdzenie czy punkty tworzą prostokąt
        const width1 = Math.abs(this.points[1].x - this.points[0].x);
        const width2 = Math.abs(this.points[3].x - this.points[2].x);
        const height1 = Math.abs(this.points[2].y - this.points[0].y);
        const height2 = Math.abs(this.points[3].y - this.points[1].y);

        if (Math.abs(width1 - width2) > 0.0001 || Math.abs(height1 - height2) > 0.0001) {
            throw new Error('Podane punkty nie tworzą prostokąta');
        }
    }

    move(deltaX: number, deltaY: number): void {
        this.points.forEach((point) => point.move(deltaX, deltaY));
    }

    getArea(): number {
        const width = Math.abs(this.points[1].x - this.points[0].x);
        const height = Math.abs(this.points[2].y - this.points[0].y);
        return width * height;
    }

    getPerimeter(): number {
        const width = Math.abs(this.points[1].x - this.points[0].x);
        const height = Math.abs(this.points[2].y - this.points[0].y);
        return 2 * (width + height);
    }

    scale(factor: number): void {
        if (factor <= 0) {
            throw new Error('Współczynnik skalowania musi być większy od 0');
        }

        // Obliczanie środka prostokąta
        const centerX = (this.points[0].x + this.points[1].x + this.points[2].x + this.points[3].x) / 4;
        const centerY = (this.points[0].y + this.points[1].y + this.points[2].y + this.points[3].y) / 4;

        // Skalowanie każdego punktu względem środka
        this.points = this.points.map(point => {
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            return new Point(
                centerX + dx * factor,
                centerY + dy * factor
            );
        });
    }

    rotate(angle: number): void {
        const radians = (Math.PI / 180) * angle;
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);

        const origin = this.points[0];

        this.points = this.points.map((point) => {
            const translatedX = point.x - origin.x;
            const translatedY = point.y - origin.y;

            const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
            const rotatedY = translatedX * sinTheta + translatedY * cosTheta;

            return new Point(rotatedX + origin.x, rotatedY + origin.y);
        });
    }
}

// Klasa Square dziedzicząca po Rectangle
export class Square extends Rectangle {
    constructor(topLeft: Point, sideLength: number) {
        if (sideLength <= 0) {
            throw new Error('Długość boku musi być większa od 0');
        }

        const topRight = new Point(topLeft.x + sideLength, topLeft.y);
        const bottomLeft = new Point(topLeft.x, topLeft.y + sideLength);
        const bottomRight = new Point(topLeft.x + sideLength, topLeft.y + sideLength);

        super(topLeft, topRight, bottomLeft, bottomRight);
    }

    // Przeciążenie metody scale aby zachować proporcje kwadratu
    scale(factor: number): void {
        super.scale(factor);
    }
}

// Przykładowe użycie:
function testGeometryClasses() {
    try {
        // Test Point z walidacją
        const point = new Point(0, 0);
        point.move(5, 5);
        console.log('Punkt po przesunięciu:', point);

        // Test Rectangle z nowymi metodami
        const rect = new Rectangle(
            new Point(0, 0),
            new Point(4, 0),
            new Point(0, 3),
            new Point(4, 3)
        );
        console.log('Pole prostokąta:', rect.getArea());
        console.log('Obwód prostokąta:', rect.getPerimeter());
        rect.scale(2);
        console.log('Pole po skalowaniu:', rect.getArea());

        // Test Square
        const square = new Square(new Point(0, 0), 5);
        console.log('Pole kwadratu:', square.getArea());
        console.log('Obwód kwadratu:', square.getPerimeter());
        square.scale(1.5);
        console.log('Pole kwadratu po skalowaniu:', square.getArea());

    } catch (error) {
        console.error('Wystąpił błąd:');
    }
}