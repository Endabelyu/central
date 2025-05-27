"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Star,
  MessageCircle,
  Heart,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Image from "@/components/imageContainer";

const products = [
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    description: "Original Apple iPhone with A16 Bionic chip",
    price: 520,
    maxPrice: 580,
    minOrder: 2,
    supplier: "Shenzhen Tech Co., Ltd.",
    rating: 5.0,
    reviews: 21,
    location: "CN",
    verified: true,
    category: "smartphones",
    variants: [
      {
        storage: "128GB",
        colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
      },
      {
        storage: "256GB",
        colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
      },
      { storage: "512GB", colors: ["Space Black", "Silver", "Gold"] },
    ],
    image: "/placeholder.svg?height=200&width=200",
    keywords: ["iphone", "apple", "smartphone", "5g", "pro", "max"],
  },
  {
    id: 2,
    title: "Samsung Galaxy S23 Ultra",
    description: "Latest Samsung flagship with S Pen",
    price: 695,
    maxPrice: 750,
    minOrder: 5,
    supplier: "Guangzhou Electronics Ltd.",
    rating: 4.8,
    reviews: 15,
    location: "CN",
    verified: true,
    category: "smartphones",
    variants: [
      {
        storage: "256GB",
        colors: ["Phantom Black", "Cream", "Green", "Lavender"],
      },
      { storage: "512GB", colors: ["Phantom Black", "Cream"] },
      { storage: "1TB", colors: ["Phantom Black"] },
    ],
    image: "/placeholder.svg?height=200&width=200",
    keywords: [
      "samsung",
      "galaxy",
      "android",
      "smartphone",
      "5g",
      "ultra",
      "s pen",
    ],
  },
  {
    id: 3,
    title: "Google Pixel 7 Pro",
    description: "Pure Android experience with Google AI",
    price: 455,
    maxPrice: 500,
    minOrder: 1,
    supplier: "Beijing Mobile Tech",
    rating: 4.9,
    reviews: 8,
    location: "CN",
    verified: false,
    category: "smartphones",
    variants: [
      { storage: "128GB", colors: ["Obsidian", "Snow", "Hazel"] },
      { storage: "256GB", colors: ["Obsidian", "Snow"] },
    ],
    image: "/placeholder.svg?height=200&width=200",
    keywords: [
      "google",
      "pixel",
      "android",
      "smartphone",
      "5g",
      "camera",
      "ai",
    ],
  },
  {
    id: 4,
    title: "Used iPhone 13",
    description: "Refurbished iPhone in excellent condition",
    price: 320,
    maxPrice: 380,
    minOrder: 10,
    supplier: "Dongguan Trading Co.",
    rating: 4.5,
    reviews: 32,
    location: "CN",
    verified: true,
    category: "used-phones",
    variants: [
      {
        storage: "128GB",
        colors: ["Pink", "Blue", "Midnight", "Starlight", "Red"],
      },
      { storage: "256GB", colors: ["Pink", "Blue", "Midnight", "Starlight"] },
    ],
    image: "/placeholder.svg?height=200&width=200",
    keywords: ["iphone", "apple", "used", "refurbished", "13", "smartphone"],
  },
  {
    id: 5,
    title: "iPhone 13 Mini",
    description: "Compact iPhone with full features",
    price: 420,
    maxPrice: 480,
    minOrder: 3,
    supplier: "Shenzhen Mobile Hub",
    rating: 4.7,
    reviews: 12,
    location: "CN",
    verified: true,
    category: "smartphones",
    variants: [
      {
        storage: "128GB",
        colors: ["Pink", "Blue", "Midnight", "Starlight", "Red"],
      },
      { storage: "256GB", colors: ["Pink", "Blue", "Midnight", "Starlight"] },
    ],
    image: "/placeholder.svg?height=200&width=200",
    keywords: ["iphone", "apple", "mini", "compact", "smartphone", "13"],
  },
  {
    id: 6,
    title: "OnePlus 11 5G",
    description: "Flagship killer with Snapdragon 8 Gen 2",
    price: 580,
    maxPrice: 640,
    minOrder: 2,
    supplier: "Guangzhou Tech Solutions",
    rating: 4.6,
    reviews: 9,
    location: "CN",
    verified: false,
    category: "smartphones",
    variants: [
      { storage: "128GB", colors: ["Titan Black", "Eternal Green"] },
      { storage: "256GB", colors: ["Titan Black", "Eternal Green"] },
    ],
    image: "/placeholder.svg?height=200&width=200",
    keywords: [
      "oneplus",
      "android",
      "smartphone",
      "5g",
      "snapdragon",
      "flagship",
    ],
  },
];

const categories = [
  { id: "all", name: "All Products", count: 6 },
  { id: "smartphones", name: "Smartphones", count: 4 },
  { id: "used-phones", name: "Used Phones", count: 1 },
  { id: "accessories", name: "Accessories", count: 0 },
];

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(products.length);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const ITEMS_PER_PAGE = 8;

  // API-ready search function
  const searchProducts = useCallback(
    async (
      query: string,
      category: string,
      priceMin: number,
      priceMax: number,
      ratings: number[],
      sort: string,
      page: number,
    ) => {
      setIsLoading(true);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // This is where you would make your actual API call
        // const response = await fetch('/api/products/search', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     query,
        //     category,
        //     priceMin,
        //     priceMax,
        //     ratings,
        //     sort,
        //     page,
        //     limit: ITEMS_PER_PAGE
        //   })
        // })
        // const data = await response.json()

        // For now, simulate with local filtering
        let filtered = [...products];

        // Filter by search query
        if (query.trim()) {
          filtered = filtered.filter(
            product =>
              product.title.toLowerCase().includes(query.toLowerCase()) ||
              product.description.toLowerCase().includes(query.toLowerCase()) ||
              product.keywords.some(keyword =>
                keyword.toLowerCase().includes(query.toLowerCase()),
              ),
          );
        }

        // Filter by category
        if (category !== "all") {
          filtered = filtered.filter(product => product.category === category);
        }

        // Filter by price range
        filtered = filtered.filter(
          product => product.price >= priceMin && product.maxPrice <= priceMax,
        );

        // Filter by ratings
        if (ratings.length > 0) {
          filtered = filtered.filter(product => {
            if (ratings.includes(5)) return product.rating >= 5.0;
            if (ratings.includes(4)) return product.rating >= 4.5;
            if (ratings.includes(3)) return product.rating >= 3.5;
            return true;
          });
        }

        // Sort products
        switch (sort) {
          case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "reviews":
            filtered.sort((a, b) => b.reviews - a.reviews);
            break;
          default:
            break;
        }

        //         // Simulate pagination
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const paginatedResults = filtered.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE,
        );

        setFilteredProducts(paginatedResults);
        setTotalResults(filtered.length);
      } catch (error) {
        console.error("Search failed:", error);
        setFilteredProducts([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Effect for debounced search
  useEffect(() => {
    searchProducts(
      debouncedSearchQuery,
      selectedCategory,
      priceRange[0],
      priceRange[1],
      selectedRatings,
      sortBy,
      currentPage,
    );
  }, [
    debouncedSearchQuery,
    selectedCategory,
    priceRange,
    selectedRatings,
    sortBy,
    currentPage,
    searchProducts,
  ]);

  // Reset to first page when filters change (except pagination)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [
    debouncedSearchQuery,
    selectedCategory,
    priceRange,
    selectedRatings,
    sortBy,
  ]);

  //   // Pagination calculations
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(
    startIndex + filteredProducts.length - 1,
    totalResults,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  return (
    <div className="min-h-screen ">
      {/* Simplified Header */}
      <header className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm font-uppercase">
                  C
                </span>
              </div>
              <span className="text-xl font-bold text-orange-500">Central</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart
              </Button>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="lg:max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Mobile Phones & Accessories
          </h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products, brands, or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              Search
            </Button>
          </form>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 space-y-6 lg:block hidden">
            {/* Categories */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        selectedCategory === category.id
                          ? "bg-orange-50 text-orange-600"
                          : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-gray-500">
                        ({category.count})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Price Range (USD)</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center space-x-2 text-sm">
                    <span>${priceRange[0]}</span>
                    <span>-</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ratings */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Customer Reviews</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={selectedRatings.includes(rating)}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setSelectedRatings([...selectedRatings, rating]);
                          } else {
                            setSelectedRatings(
                              selectedRatings.filter(r => r !== rating),
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="flex items-center cursor-pointer"
                      >
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">{rating}.0 & up</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setPriceRange([0, 1000]);
                setSelectedRatings([]);
              }}
            >
              Clear All Filters
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  {isLoading ? (
                    "Searching..."
                  ) : totalResults > 0 ? (
                    <>
                      Showing {startIndex}-{endIndex} of {totalResults} results
                      {debouncedSearchQuery && (
                        <span>
                          {" "}
                          for "<strong>{debouncedSearchQuery}</strong>"
                        </span>
                      )}
                    </>
                  ) : (
                    "No results found"
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Best Match</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="bg-gray-200 h-48 rounded-md mb-3"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 rounded mb-2"></div>
                      <div className="bg-gray-200 h-6 rounded mb-2"></div>
                      <div className="bg-gray-200 h-8 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-4"
                }
              >
                {filteredProducts.map(product => (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-medium text-sm mb-1 hover:text-orange-500 cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-600 mb-2">
                        {product.description}
                      </p>

                      {/* Product Variants */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">
                          Available variants:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.variants
                            .slice(0, 2)
                            .map((variant, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {variant.storage}
                              </Badge>
                            ))}
                          {product.variants.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.variants.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-lg font-bold text-orange-600">
                          US${product.price}-{product.maxPrice}
                        </div>

                        <div className="text-xs text-gray-600">
                          Min. order: {product.minOrder} pieces
                        </div>

                        <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                          {product.supplier}
                          {product.verified && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}/5.0</span>
                            <span>({product.reviews})</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {product.location}
                          </Badge>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => {
                            window.location.href = "/login?redirect=chat";
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact Supplier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
