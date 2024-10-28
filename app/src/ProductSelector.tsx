import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

// Types
interface RecommendationMetadata {
  processedAt: string;
  totalResults: number;
  category: string;
  algorithmVersion: string;
}

interface Recommendation {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  confidence: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  color: string;
  size: string[];
  category: string;
  image: string;
  thumbnail: string;
}

// Custom hook for fetching recommendations
const useProductRecommendations = (product: Product) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RecommendationMetadata | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/recommendation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              color: product.color,
              size: product.size,
              category: product.category,
              image: product.image,
              thumbnail: product.thumbnail,
            }
          })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data.recommendations);
        setMetadata(data.metadata);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (product) {
      fetchRecommendations();
    }
  }, [product]);

  return { recommendations, metadata, loading, error };
};



// Recommendation card component with confidence score
const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
  <Card className="p-4 bg-gray-50 relative">
    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
      {(recommendation.confidence * 100).toFixed(0)}% match
    </div>
    <div className="h-32 flex items-center justify-center mb-2">
      <img
        src={recommendation.image}
        alt={recommendation.name}
        className="object-contain w-full h-full"
      />
    </div>
    <div className="text-center">
      <h4 className="font-medium text-sm">{recommendation.name}</h4>
      <p className="text-blue-600 font-bold mt-1">${recommendation.price.toFixed(2)}</p>
    </div>
  </Card>
);

// Loading skeleton for recommendations
const RecommendationSkeleton = ({ count = 1 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="p-4 bg-gray-50">
        <Skeleton className="h-32 w-full mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/4 mx-auto" />
        </div>
      </Card>
    ))}
  </>
);

const ProductSelector = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Striped Sports Jersey",
      description: "Red and black striped sports jersey with short sleeves",
      price: 39.99,
      color: "Red/Black",
      size: ["S", "M", "L", "XL"],
      category: "Sports Wear",
      image: "/data/preview/1.png",
      thumbnail: "/data/preview/1-small.jpeg",
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
      thumbnail: "/data/preview/2-small.jpeg",
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
      thumbnail: "/data/preview/3-small.jpeg"
    }
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const { recommendations, metadata, loading, error } = useProductRecommendations(selectedProduct);

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
              <div className="w-1/3">
                <h3 className="text-lg font-semibold mb-4">Recommended for you</h3>
                {metadata && (
                  <p className="text-sm text-gray-500 mb-4">
                    {metadata.totalResults} items found in {metadata.category}
                  </p>
                )}
                <div className="space-y-4">
                  {error && (
                    <div className="text-red-500 text-center p-4">
                      Failed to load recommendations
                    </div>
                  )}
                  {loading ? (
                    <RecommendationSkeleton
                      count={metadata?.totalResults || recommendations.length || 3}
                    />
                  ) : (
                    recommendations.map((rec) => (
                      <RecommendationCard key={rec.id} recommendation={rec} />
                    ))
                  )}
                </div>
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