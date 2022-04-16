import {Product} from "../types";

/**
 * Mocking client-server processing
 */
const _products: Product[] = [
    {'id': 1, 'title': 'iPad 4 Mini', 'price': 500.01, 'inventory': 2},
    {'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'inventory': 10},
    {'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'inventory': 5}
]

export default {
    async getProducts(): Promise<Product[]> {
        await wait(100)
        return _products
    },

    async buyProducts(products: Product[]): Promise<void> {
        await wait(100)
        if (Math.random() > 0.5) { // simulate random checkout failure.
            return
        } else {
            throw new Error('Checkout error')
        }
    }
}

function wait(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
