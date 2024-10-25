import { useState } from 'react';
import { Card } from '../components/ui/card';

const ProductSelector = () => {
  const products = [
    {
      id: 1,
      name: "Striped Sports Jersey",
      description: "Red and black striped sports jersey with short sleeves",
      price: 39.99,
      color: "Red/Black",
      size: ["S", "M", "L", "XL"],
      category: "Sports Wear",
      image: "/data/preview/1.png",
      recommendations: [
        { id: 'r1', name: "Sports Shorts Nike", price: 29.99, category: "Sports Wear", image: "/data/preview/sports-shorts-nike.png" },
        { id: 'r2', name: "Performance Socks", price: 12.99, category: "Sports Wear", image: "/data/preview/performance-socks.png" }
      ]
    },
    {
      id: 2,
      name: "Women's Basic Tee",
      description: "Mint green casual t-shirt with cap sleeves",
      price: 24.99,
      color: "Mint Green",
      size: ["XS", "S", "M", "L"],
      category: "Casual Wear",
      image: "/data/preview/2.png",
      recommendations: [
        { id: 'r3', name: "Casual Shorts", price: 34.99, category: "Casual Wear", image: "/data/preview/casual-short-woman.png" },
        { id: 'r4', name: "Summer Skirt", price: 39.99, category: "Casual Wear", image: "/data/preview/summer-skirt.png" }
      ]
    },
    {
      id: 3,
      name: "Men's Formal Shirt",
      description: "Navy blue button-down formal shirt with long sleeves",
      price: 49.99,
      color: "Navy Blue",
      size: ["M", "L", "XL", "XXL"],
      category: "Formal Wear",
      image: "/data/preview/3.png",
      recommendations: [
        { id: 'r5', name: "Formal Trousers", price: 69.99, category: "Formal Wear", image: "/data/preview/formal-trouser.png" },
        { id: 'r6', name: "Silk Tie", price: 29.99, category: "Accessories", image: "/data/preview/silk-tie.png" }
      ]
    }
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Selected Product Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">My Store</h2>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            {/* Main Product and Recommendations Row */}
            <div className="w-full flex justify-center gap-8 mb-8">
              {/* Main Product Image */}
              <div className="w-1/2 max-w-md">
                <Card className="p-4 h-96 flex items-center justify-center bg-gray-50">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="object-contain w-full h-full"
                  />
                </Card>
                {/* Product Details Below Image - Centered */}
                <div className="text-center py-5">
                  <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    ${selectedProduct.price}
                  </p>
                  <div className="mb-2">
                    <span className="font-medium">Color: </span>
                    {selectedProduct.color}
                  </div>
                  <div>
                    <span className="font-medium">Available Sizes: </span>
                    {selectedProduct.size.join(", ")}
                  </div>
                </div>
              </div>

              {/* Recommendations Column */}
              <div className="w-1/3 space-y-4">
                {selectedProduct.recommendations.map((rec) => (
                  <Card key={rec.id} className="p-4 bg-gray-50">
                    <div className="h-32 flex items-center justify-center mb-2">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{rec.name}</h4>
                      <p className="text-blue-600 font-bold mt-1">${rec.price}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product List Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Product List</h2>
        <div className="flex gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`w-1/3 cursor-pointer transition-all duration-200 ${selectedProduct.id === product.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:shadow-lg'
                }`}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="p-4 h-64 flex items-center justify-center bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain w-full h-full"
                />
                <div className="text-center">
                  <div className="text-sm font-medium mt-2">{product.name}</div>
                  <div className="text-sm text-gray-500">${product.price}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;