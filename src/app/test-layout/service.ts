import { Injectable } from '@angular/core';

export class Product {
    text: string;
    price: string;
    src: string;
}

export class Category {
    key: string;
    items: Product[];
}

let data: Category[] = [
    {
        key: "Televisions",
        items: [
            { text: "SuperLCD 42", price: "$1200", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/7.png" },
            { text: "SuperLED 42", price: "$1450", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/5.png" },
            { text: "SuperLED 50", price: "$1600", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/4.png" },
            { text: "SuperLCD 55", price: "$1350", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/6.png" },
            { text: "SuperLCD 70", price: "$4000", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/9.png" }
        ]
    }, {
        key: "Monitors",
        items: [
            { text: "DesktopLCD 19", price: "$160", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/10.png" },
            { text: "DesktopLCD 21", price: "$170", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/12.png" },
            { text: "DesktopLED 21", price: "$180", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/13.png" }
        ]
    }, {
        key: "Projectors",
        items: [
            { text: "Projector Plus", price: "$550", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/14.png" },
            { text: "Projector PlusHD", price: "$750", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/15.png" }
        ]
    }, {
        key: "Video Players",
        items: [
            { text: "HD Video Player", price: "$220", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/1.png" },
            { text: "SuperHD Video Player", price: "$270", src: "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/2.png" }
        ]
    }
];

@Injectable()
export class Service {
    getProducts(): Category[] {
        return data;
    }
}
