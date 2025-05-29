"use client";

import type React from "react";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Star,
  MessageCircle,
  Heart,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import Image from "~/components/imageContainer";
import { useQuery } from "@tanstack/react-query";
import { client, useTRPC } from "~/lib/trpc";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import type { Route } from "./+types/product";

const categories = [
  { id: "all", name: "All Products", count: 6 },
  { id: "Android", name: "Android", count: 4 },
  { id: "iPhone", name: "iPhone", count: 1 },
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

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // const trpc = useTRPC();
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const page = url.searchParams.get("page") ?? "";
  const productsData = await client.product.getAll.query({
    page: Number(page) || 1,
    limit: 8,
    q: q,
    sort: "asc",
  });
  console.log(productsData);
  return {
    products: productsData?.products ?? [],
    pagination: productsData?.pagination ?? null,
  };
}
export default function Home({ loaderData }: Route.ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams(); // const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  // const [totalResults, setTotalResults] = useState(products.length);
  const { products, pagination } = useLoaderData<typeof clientLoader>();
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const productLoading = false;
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 8;

  // API-ready search function
  // const searchProducts = useCallback(
  //   async (
  //     query: string,
  //     category: string,
  //     priceMin: number,
  //     priceMax: number,
  //     ratings: number[],
  //     sort: string,
  //     page: number,
  //   ) => {
  //     setIsLoading(true);

  //     try {
  //       // Simulate API call delay
  //       await new Promise(resolve => setTimeout(resolve, 300));

  //       // This is where you would make your actual API call
  //       // const response = await fetch('/api/products/search', {
  //       //   method: 'POST',
  //       //   headers: { 'Content-Type': 'application/json' },
  //       //   body: JSON.stringify({
  //       //     query,
  //       //     category,
  //       //     priceMin,
  //       //     priceMax,
  //       //     ratings,
  //       //     sort,
  //       //     page,
  //       //     limit: ITEMS_PER_PAGE
  //       //   })
  //       // })
  //       // const data = await response.json()

  //       // For now, simulate with local filtering
  //       let filtered = [...products];

  //       // Filter by search query
  //       if (query.trim()) {
  //         filtered = filtered.filter(
  //           product =>
  //             product.title.toLowerCase().includes(query.toLowerCase()) ||
  //             product.description.toLowerCase().includes(query.toLowerCase()) ||
  //             product.keywords.some(keyword =>
  //               keyword.toLowerCase().includes(query.toLowerCase()),
  //             ),
  //         );
  //       }

  //       // Filter by category
  //       if (category !== "all") {
  //         filtered = filtered.filter(product => product.category === category);
  //       }

  //       // Filter by price range
  //       filtered = filtered.filter(
  //         product => product.price >= priceMin && product.maxPrice <= priceMax,
  //       );

  //       // Filter by ratings
  //       if (ratings.length > 0) {
  //         filtered = filtered.filter(product => {
  //           if (ratings.includes(5)) return product.rating >= 5.0;
  //           if (ratings.includes(4)) return product.rating >= 4.5;
  //           if (ratings.includes(3)) return product.rating >= 3.5;
  //           return true;
  //         });
  //       }

  //       // Sort products
  //       switch (sort) {
  //         case "price-low":
  //           filtered.sort((a, b) => a.price - b.price);
  //           break;
  //         case "price-high":
  //           filtered.sort((a, b) => b.price - a.price);
  //           break;
  //         case "rating":
  //           filtered.sort((a, b) => b.rating - a.rating);
  //           break;
  //         case "reviews":
  //           filtered.sort((a, b) => b.reviews - a.reviews);
  //           break;
  //         default:
  //           break;
  //       }

  //       //         // Simulate pagination
  //       const startIndex = (page - 1) * ITEMS_PER_PAGE;
  //       const paginatedResults = filtered.slice(
  //         startIndex,
  //         startIndex + ITEMS_PER_PAGE,
  //       );

  //       setFilteredProducts(paginatedResults);
  //       setTotalResults(filtered.length);
  //     } catch (error) {
  //       console.error("Search failed:", error);
  //       setFilteredProducts([]);
  //       setTotalResults(0);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [],
  // );

  // Effect for debounced search
  useEffect(() => {
    // searchProducts(
    //   debouncedSearchQuery,
    //   selectedCategory,
    //   priceRange[0],
    //   priceRange[1],
    //   selectedRatings,
    //   sortBy,
    //   currentPage,
    // );
  }, [
    debouncedSearchQuery,
    selectedCategory,
    priceRange,
    selectedRatings,
    sortBy,
    currentPage,
    // searchProducts,
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
  // const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  // const endIndex = Math.min(
  //   startIndex + filteredProducts.length - 1,
  //   totalResults,
  // );

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const formData = new FormData(e.currentTarget);
    const query = String(formData.get("q"));

    const newSearchParams = new URLSearchParams(searchParams);

    if (query) {
      newSearchParams.set("q", query);
    } else {
      newSearchParams.delete("q");
    }

    // if (city && city !== "null" && city !== "none") {
    //   newSearchParams.set("city", city);
    // } else {
    //   newSearchParams.delete("city");
    // }

    navigate(`?${newSearchParams.toString()}`);
  };
  const handleChangePage = (e: FormEvent<HTMLFormElement>, page: string) => {
    e.preventDefault();

    const newSearchParams = new URLSearchParams(searchParams);

    if (page) {
      newSearchParams.set("page", page);
    } else {
      newSearchParams.delete("q");
    }

    // if (city && city !== "null" && city !== "none") {
    //   newSearchParams.set("city", city);
    // } else {
    //   newSearchParams.delete("city");
    // }

    navigate(`?${newSearchParams.toString()}`);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // console.log(productsData, "userQuery");
  const handlePrevImage = (e: React.MouseEvent, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalImages - 1));
  };

  const handleNextImage = (e: React.MouseEvent, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev < totalImages - 1 ? prev + 1 : 0));
  };
  return (
    <div className="min-h-screen ">
      {/* Simplified Header */}
      <header className="bg-white py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="lg:max-w-[1440px]  mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                name="q"
                type="text"
                placeholder="Search for products, brands, or keywords..."
                defaultValue={searchParams.get("q") || ""}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white"
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
          <div className="w-48 space-y-6 lg:block hidden">
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
                navigate(`/`);
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
                  {productLoading ? (
                    "Searching..."
                  ) : pagination?.total ? (
                    <>
                      Showing
                      {currentPage === 1
                        ? ` ${pagination?.currentPage} `
                        : ` ${(pagination?.currentPage - 1) * 8 + 1} `}
                      -
                      {currentPage === 1
                        ? `8 `
                        : ` ${pagination?.currentPage * 8} `}
                      of {pagination?.total} results
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
            {productLoading ? (
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
                {products && products.length > 0 ? (
                  products?.map(productsData => (
                    <Card
                      key={productsData.id}
                      className="hover:shadow-lg transition-shadow h-full flex flex-col"
                    >
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="relative mb-3 group">
                          <Carousel className=" ">
                            <CarouselContent>
                              {productsData.imageGallery.map((_, index) => (
                                <CarouselItem key={index}>
                                  <div className="p-1">
                                    <Image
                                      src={_}
                                      alt={productsData.name}
                                      width={200}
                                      height={200}
                                      className="w-full h-48 object-cover rounded-md transition-transform duration-200"
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4" />
                            <CarouselNext className="-right-4" />
                          </Carousel>
                        </div>

                        {/* Content area that grows to fill available space */}
                        <div className="flex-1 flex flex-col">
                          <Link to={`/product/${productsData.id}`}>
                            <h3 className="font-medium text-sm mb-1 hover:text-orange-500 cursor-pointer line-clamp-2">
                              {productsData.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-600  line-clamp-2">
                            {productsData.description}
                          </p>

                          {/* Product Variants */}
                          {/* <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {productsData.variant
                              .slice(0, 2)
                              .map((variant, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {variant}
                                </Badge>
                              ))}
                            {productsData.variant.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{productsData.variant.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div> */}

                          {/* Flexible content area */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="text-2xl font-bold ">
                                US${productsData.pricingTiers[0].price}-
                                {
                                  productsData.pricingTiers[
                                    productsData.pricingTiers.length - 1
                                  ].price
                                }
                              </div>

                              <div className="text-xs text-gray-600">
                                Min. order: {productsData.minimumOrderQuantity}{" "}
                                pieces
                              </div>

                              <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                {productsData.supplierName}
                              </div>
                              <div>
                                {productsData.supplierVerified && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-1 text-xs"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{productsData.rating}/5.0</span>
                                  {/* <span>({productsData.reviews})</span> */}
                                </div>
                                {/* <Badge variant="outline" className="text-xs">
                                {productsData.location}
                              </Badge> */}
                              </div>
                            </div>

                            {/* Contact button always at bottom */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 "
                              // onClick={() => {
                              //   window.location.href = "/login?redirect=chat";
                              // }}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Contact Supplier
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    // <Card
                    //   key={productsData.id}
                    //   className="hover:shadow-lg transition-shadow py-0"
                    // >
                    //   <CardContent className="p-4 justify-between">
                    //     <div className="relative mb-3">
                    //       <Image
                    //         src={productsData.imageUrl || "/placeholder.svg"}
                    //         alt={productsData.name}
                    //         width={200}
                    //         height={200}
                    //         className="w-full h-48 object-cover rounded-md"
                    //       />
                    //       {/* <Button
                    //         variant="ghost"
                    //         size="sm"
                    //         className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    //       >
                    //         <Heart className="h-4 w-4" />
                    //       </Button> */}
                    //     </div>

                    //     <Link to={`product/${productsData.slug}`}>
                    //       <h3 className="truncate font-medium text-sm mb-1 hover:text-orange-500 cursor-pointer">
                    //         {productsData.name}
                    //       </h3>
                    //       <p className="text-xs text-gray-600 mb-2">
                    //         {productsData.description}
                    //       </p>

                    //       {/* productsData Variants */}
                    //       <div className="mb-3">
                    //         <div className="text-xs text-gray-500 mb-1">
                    //           Min. order: {productsData.minimumOrderQuantity}{" "}
                    //           {productsData.quantityUnit}
                    //         </div>
                    //         {/* <div className="flex flex-wrap gap-1">
                    //         {productsData.variants
                    //           .slice(0, 2)
                    //           .map((variant, index) => (
                    //             <Badge
                    //               key={index}
                    //               variant="outline"
                    //               className="text-xs"
                    //             >
                    //               {variant.storage}
                    //             </Badge>
                    //           ))}
                    //         {productsData.variants.length > 2 && (
                    //           <Badge variant="outline" className="text-xs">
                    //             +{productsData.variants.length - 2} more
                    //           </Badge>
                    //         )}
                    //       </div> */}
                    //       </div>

                    //       <div className="text-lg font-bold space-y-2">
                    //         <p>
                    //           US${productsData.price}-{productsData.price}
                    //         </p>
                    //       </div>
                    //     </Link>
                    //     <div className="space-y-2">
                    //       {/* <div className="text-xs text-gray-600">
                    //         Min. order: {productsData.minOrder} pieces
                    //       </div> */}

                    //       <div className="text-xs text-blue-600  ">
                    //         <p>{productsData.supplierName}</p>
                    //       </div>
                    //       <div>
                    //         {productsData.supplierVerified && (
                    //           <Badge variant="secondary" className="ml-1 text-xs">
                    //             Verified
                    //           </Badge>
                    //         )}
                    //       </div>
                    //       <div className="flex items-center justify-between text-xs text-gray-500">
                    //         <div className="flex items-center space-x-1">
                    //           <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    //           <span>{productsData.rating}/5.0</span>
                    //           {/* <span>({productsData.reviews})</span> */}
                    //         </div>
                    //         {/* <Badge variant="outline" className="text-xs">
                    //           {productsData.location}
                    //         </Badge> */}
                    //       </div>
                    //     </div>
                    //   </CardContent>
                    //   <Button
                    //     variant="outline"
                    //     size="sm"
                    //     className="w-full mt-2"
                    //     onClick={() => {
                    //       window.location.href = "/login?redirect=chat";
                    //     }}
                    //   >
                    //     <MessageCircle className="h-4 w-4 mr-1" />
                    //     Contact Supplier
                    //   </Button>
                    // </Card>
                  ))
                ) : (
                  <p>No products found</p>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination &&
              pagination.total > 0 &&
              pagination.totalPages &&
              pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <form
                    onSubmit={e =>
                      handleChangePage(
                        e,
                        String(Number(searchParams.get("page")) - 1),
                      )
                    }
                    className="flex gap-2 max-w-2xl"
                  >
                    {" "}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={pagination.currentPage === 1}
                    >
                      Previous
                    </Button>
                  </form>{" "}
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <form
                        onSubmit={e => handleChangePage(e, String(page))}
                        className="flex gap-2 max-w-2xl"
                      >
                        <Button
                          type="submit"
                          key={page}
                          variant={
                            searchParams.get("page") === String(page)
                              ? "default"
                              : "outline"
                          }
                          className="w-10"
                        >
                          {page}
                        </Button>
                      </form>
                    );
                  })}
                  <form
                    onSubmit={e =>
                      handleChangePage(
                        e,
                        searchParams.get("page")
                          ? String(Number(searchParams.get("page")) + 1)
                          : "2",
                      )
                    }
                    className="flex gap-2 max-w-2xl"
                  >
                    <Button
                      variant="outline"
                      disabled={
                        Number(searchParams.get("page")) ===
                        pagination.totalPages
                      }
                    >
                      Next
                    </Button>
                  </form>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
