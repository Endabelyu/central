import { useState, useEffect } from "react";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import Image from "~/components/imageContainer";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList } from "~/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Badge } from "~/components/ui/badge";
import type { Route } from "./+types/product";
import { client } from "~/lib/trpc";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Input } from "~/components/ui/input";

// Type for tracking combinations
type CombinationKey = string; // "color|model|grade"
type StorageQuantities = Record<string, number>; // storage -> quantity
type CombinationData = Record<CombinationKey, StorageQuantities>;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // const trpc = useTRPC();
  const slug = params.slug as string;
  console.log(slug, "slug");
  const productData = await client.product.getBySlug.query({
    slug,
  });
  console.log(productData);
  return { data: productData };
}
export default function ProductDetailPage() {
  const params = useSearchParams();
  // const productId = Number.parseInt(params.id as string);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedPlug, setSelectedPlug] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showVariationsSheet, setShowVariationsSheet] = useState(false);

  // Track combinations: each unique (color, model, grade) has its own storage quantities
  const [combinationData, setCombinationData] = useState<CombinationData>({});
  const { data: product } = useLoaderData<typeof clientLoader>();

  // useEffect(() => {
  //   setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  //   if (product) {
  //     setSelectedColor(product.colors[0]);
  //     setSelectedModel(product.models[0]);
  //     setSelectedGrade(product.grades[0]);
  //   }
  // }, [product]);

  // if (!product) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold mb-4">Product not found</h1>
  //         <Link href="/">
  //           <Button>Back to Products</Button>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  // Helper functions
  const getCombinationKey = (
    color: string,
    model: string,
    grade: string,
    ram: string,
    plug: string,
    storage: string,
  ): CombinationKey => {
    return `${color}|${model}|${grade}|${ram}|${plug}|${storage}`;
  };

  const getCurrentCombinationKey = (): CombinationKey => {
    return getCombinationKey(
      selectedColor,
      selectedModel,
      selectedGrade,
      selectedRam,
      selectedPlug,
      selectedStorage,
    );
  };

  const getCurrentStorageQuantities = (): StorageQuantities => {
    const key = getCurrentCombinationKey();
    return combinationData[key] || {};
  };

  const getTotalQuantityForColor = (color: string): number => {
    let total = 0;
    Object.entries(combinationData).forEach(([key, storageQtys]) => {
      const [combColor] = key.split("|");
      if (combColor === color) {
        total += Object.values(storageQtys).reduce((sum, qty) => sum + qty, 0);
      }
    });
    return total;
  };

  const getTotalQuantity = (): number => {
    let total = 0;
    Object.values(combinationData).forEach(storageQtys => {
      total += Object.values(storageQtys).reduce((sum, qty) => sum + qty, 0);
    });
    return total;
  };

  const getTotalPrice = (priceTier: PricingTier[] | undefined) => {
    if (!priceTier) return 0;
    const currentPrice = getDisplayPrice(
      priceTier,
      getCurrentStorageQuantities,
    );
    return getTotalQuantity() * Number(currentPrice);
  };

  const handleStorageQuantityChange = (storage: string, newQty: number) => {
    const validQty = Math.max(0, newQty);
    const combinationKey = getCurrentCombinationKey();

    console.log(combinationKey, combinationData, "combinationKey");
    // set the new quantity product
    setCombinationData(prev => {
      const newData = { ...prev };
      if (!newData[combinationKey]) {
        newData[combinationKey] = {};
      }
      newData[combinationKey] = {
        ...newData[combinationKey],
        [storage]: validQty,
      };

      // Clean up empty combinations
      if (Object.values(newData[combinationKey]).every(qty => qty === 0)) {
        delete newData[combinationKey];
      }

      return newData;
    });
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      window.location.href = "/login?redirect=cart";
      return;
    }

    const totalQty = getTotalQuantity();
    if (totalQty === 0) {
      alert("Please select at least one item");
      return;
    }

    setShowVariationsSheet(false);
    alert(
      `Added ${totalQty} items to cart with ${
        Object.keys(combinationData).length
      } different combinations`,
    );
  };

  const handleContactSupplier = () => {
    if (!isLoggedIn) {
      window.location.href = "/login?redirect=chat";
      return;
    }
    alert("Opening chat with supplier...");
  };

  const handleVariationClick = () => {
    setShowVariationsSheet(true);
  };
  type PricingTier = {
    price: string;
    maxQty: number | null;
    minQty: number;
  };

  // for calculating the price
  function getDisplayPrice(
    tiers: PricingTier[],
    getCurrentStorageQuantities: () => Record<string, number>,
  ): string {
    const totalQty = Object.values(getCurrentStorageQuantities()).reduce(
      (sum, qty) => sum + qty,
      0,
    );

    if (tiers.length === 1) {
      return `${tiers[0].price}`;
    }
    if (tiers.length > 3 && totalQty > Number(tiers[2]?.maxQty)) {
      return `${tiers[3]?.price}`;
    }
    if (tiers.length > 2 && totalQty > Number(tiers[1]?.maxQty)) {
      return `${tiers[2]?.price}`;
    }
    if (tiers.length > 1 && totalQty > Number(tiers[0]?.maxQty)) {
      return `${tiers[1]?.price}`;
    }

    return `${tiers[0]?.price}`;
  }
  function getColorBgClass(color: string): string {
    const cleaned = color.trim().toLowerCase();
    const colorMap: Record<string, string> = {
      pink: "bg-rose-500",
      black: "bg-black",
      silver: "bg-gray-300",
      gold: "bg-yellow-100",
      blue: "bg-blue-500",
      red: "bg-red-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      white: "bg-white",
      grey: "bg-gray-400",
      yellow: "bg-yellow-400",
      "rose gold": "bg-yellow-200",
    };

    return colorMap[cleaned] ?? "bg-gray-600";
  }
  function formatUSD(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0, // or 2 if you want cents
    }).format(value);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-orange-500">Central</span>
            </Link>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <span className="text-sm">Welcome back!</span>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-orange-500 flex items-center ">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product?.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4 ">
            <h1 className="text-xl font-bold mb-2">{product?.name}</h1>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product?.rating}</span>
              {/* <span className="text-gray-600">
                    ({product?.supplier.reviews} reviews)
                  </span> */}
            </div>
            <div className="bg-gray-100  rounded-lg border p-2">
              <p className="text-sm">
                {product?.supplierName} ~ {product?.levelSupplier} years
              </p>
            </div>
            <div className="aspect-square bg-gray-100  rounded-lg border p-4 ">
              <Carousel className=" ">
                <CarouselContent>
                  {product?.imageGallery.map((_, index) => (
                    <CarouselItem key={index}>
                      {/* <div className="p-1"> */}
                      <Image
                        src={_}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full max-h-[720px]  object-cover object-center rounded-md transition-transform duration-200"
                      />
                      {/* </div> */}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </div>
            {/* <div className="grid grid-cols-4 gap-2">
              {product?.imageGallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg border-2 p-2 ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div> */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {/* <p className="text-gray-600 mb-4">{product?.description}</p> */}
              <div className="flex items-center space-x-4 mb-4">
                {/* <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div> */}
              </div>
            </div>
            {/* Price Tiers */}
            <Card>
              <CardContent className="">
                <div className="grid grid-cols-3 gap-4">
                  {product?.pricingTiers.map((tier, index) => (
                    <div key={index} className="text-center ">
                      {product?.pricingTiers.length === 2 &&
                      product?.pricingTiers[0].maxQty === null &&
                      product?.pricingTiers[1].maxQty === null ? (
                        <div className="text-sm text-gray-500">
                          {index === 0 ? (
                            <div className="flex items-center gap-2">
                              <p className="text-base  font-bold  text-orange-600">
                                US$ {product?.pricingTiers[0].price} -
                                {product?.pricingTiers[1].price}
                              </p>
                              <p className="text-base text-gray-500">
                                /{product.quantityUnit}
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-gray-500">
                            {product?.pricingTiers.length - 1 === index
                              ? `≥ ${tier.minQty} ${product.quantityUnit}`
                              : `${tier.minQty} - ${tier.maxQty} ${product.quantityUnit}`}
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            US${tier.price}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Current Variations Display */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Variations</h3>
                  <Button
                    variant="link"
                    className="text-orange-600 p-0"
                    onClick={handleVariationClick}
                  >
                    Edit selections
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Color */}
                  {product && product?.variant?.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Color({product?.variant.length}): {selectedColor}
                      </div>
                      <div className="flex gap-2">
                        {product?.variant.map((color, index) => {
                          const bgColor = getColorBgClass(color);

                          const totalForColor = getTotalQuantityForColor(color);
                          return (
                            <button
                              key={index}
                              onClick={e => {
                                e.preventDefault();
                                setSelectedColor(color);
                                handleVariationClick();
                              }}
                              className={`w-10 h-10 rounded-sm border-2 flex items-center justify-center hover:border-gray-400 transition-colors relative cursor-pointer ${
                                selectedColor === color
                                  ? "border-black border-2"
                                  : "border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg ${bgColor}`}
                              ></div>
                              {totalForColor > 0 && (
                                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                                  x{totalForColor}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Model */}
                  {product && product?.model?.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Model Name({product?.model.length}): {selectedModel}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {product?.model.slice(0, 2).map((model, index) => (
                          <Button
                            key={index}
                            onClick={e => {
                              e.preventDefault();
                              setSelectedModel(model);
                              handleVariationClick();
                            }}
                            className={`px-3 py-1 text-sm rounded-medium border hover:bg-orange-100 transition-colors text-foreground ${
                              selectedModel === model
                                ? "border-black border-2 bg-white"
                                : "border-gray-300 bg-orange-50"
                            }`}
                          >
                            {model}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ram */}
                  {product && product?.ram?.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium mb-2">
                        Ram({product?.ram?.length}): {selectedModel}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {product?.ram.map((option, index) => (
                          <Button
                            key={index}
                            onClick={e => {
                              e.preventDefault();
                              setSelectedRam(option);
                              handleVariationClick();
                            }}
                            className={`px-3 py-1 text-sm rounded-md border hover:bg-gray-100 transition-colors text-foreground ${
                              selectedGrade === option
                                ? "border-black border-2 bg-white"
                                : "border-gray-300 bg-gray-50"
                            }`}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grade */}
                  {product && product?.grade?.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium mb-2">
                        Grade({product?.grade.length}): {selectedGrade}
                      </div>
                      <div className="flex gap-2">
                        {product?.grade.map((grade, index) => (
                          <Button
                            key={index}
                            onClick={e => {
                              e.preventDefault();
                              setSelectedGrade(grade);
                              handleVariationClick();
                            }}
                            className={`px-3 py-1 text-sm rounded-medium border hover:bg-gray-100 transition-colors text-foreground ${
                              selectedGrade === grade
                                ? "border-black border-2 bg-white"
                                : "border-gray-300 bg-gray-50"
                            }`}
                          >
                            {grade}
                          </Button>
                        ))}
                      </div>
                      {/* Storage */}

                      {product && product?.storage?.length > 0 && (
                        <div className="space-y-4">
                          <div className="text-sm font-medium mb-2">
                            Storage({product?.storage?.length}):{" "}
                            {selectedStorage}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {product?.storage.map((option, index) => (
                              <Button
                                key={index}
                                onClick={handleVariationClick}
                                className={`px-3 py-1 text-sm rounded-md border hover:bg-gray-100 transition-colors text-foreground ${
                                  selectedStorage === option
                                    ? "border-black border-2 bg-white"
                                    : "border-gray-300 bg-gray-50"
                                }`}
                              >
                                {option.trim()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Plug */}

                  {product && product?.plug?.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium mb-2">
                        Plug({product?.plug?.length})
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {product?.plug.map((option, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 text-sm rounded-md border hover:bg-white transition-colors text-foreground  "border-gray-300 bg-gray-50 cursor-default"
                          `}
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleContactSupplier}
                variant="outline"
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Supplier
              </Button>
              <Button
                onClick={handleVariationClick}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        {/* <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="variants">All Variants</TabsTrigger>
                <TabsTrigger value="supplier">Supplier Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-3">Specifications</h3>
                    <div className="space-y-2">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b"
                          >
                            <span className="font-medium">{key}:</span>
                            <span className="text-gray-700">{value}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variants" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Available Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <Badge key={index} variant="outline">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Available Models</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.models.map((model, index) => (
                        <Badge key={index} variant="outline">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Available Grades</h3>
                    <div className="flex flex-wrap gap-2">
                      {product?.grade.map((grade, index) => (
                        <Badge key={index} variant="outline">
                          {grade}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">
                      Available Storage Options
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product?.storage.map((storage, index) => (
                        <Badge key={index} variant="outline">
                          {storage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="supplier" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-xl">
                        S
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {product.supplier.name}
                        </h3>
                        {product.supplier.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>📍 {product.supplier.location}</div>
                        <div>
                          ⭐ {product.supplier.rating}/5.0 (
                          {product.supplier.reviews} reviews)
                        </div>
                        <div>
                          💬 Response rate: {product.supplier.responseRate}
                        </div>
                        <div>
                          ⚡ Response time: {product.supplier.responseTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleContactSupplier}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Contact Supplier
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card> */}
      </div>

      {/* Variations Sheet with Black Backdrop and Smooth Animations */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showVariationsSheet ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Black backdrop overlay with fade animation */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            showVariationsSheet ? "opacity-80" : "opacity-0"
          }`}
          onClick={() => setShowVariationsSheet(false)}
        />

        {/* Sheet content with slide animation */}
        <div
          className={`fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white shadow-xl overflow-y-auto z-10 transform transition-transform duration-300 ease-out ${
            showVariationsSheet ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Select variations and quantity
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVariationsSheet(false)}
                className="hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Price Tiers with stagger animation */}
              <div
                className={`flex border-b pb-4 transition-all duration-500 delay-100 ${
                  showVariationsSheet
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {product &&
                  product.pricingTiers.map((tier, index) => {
                    const totalQty = getTotalQuantity();
                    // this code is for active price tier based on the total quantity
                    const isActive =
                      product.pricingTiers.length > 1 &&
                      product.pricingTiers.length - 1 === index &&
                      product.pricingTiers[product.pricingTiers.length - 1]
                        .maxQty === null
                        ? Number(tier.minQty) >= totalQty &&
                          product.pricingTiers &&
                          Number(
                            product.pricingTiers[
                              product.pricingTiers.length - 2
                            ].maxQty,
                          ) <= totalQty
                        : Number(tier.minQty) <= totalQty &&
                          Number(totalQty) <= Number(tier.maxQty);

                    return (
                      <div key={index} className="flex-1 text-center">
                        <div className="text-sm text-gray-500">
                          {product.pricingTiers.length === 1
                            ? null
                            : tier.maxQty === null
                              ? `>= ${tier.minQty} ${product.quantityUnit}`
                              : `${tier.minQty} - ${tier.maxQty} ${product.quantityUnit}`}
                        </div>
                        <div
                          className={`text-lg font-bold transition-colors duration-200 ${
                            isActive ? "text-orange-600" : "text-gray-400"
                          }`}
                        >
                          {product.pricingTiers.length === 1 &&
                          tier.maxQty === null
                            ? `US${tier.price} / ${product.quantityUnit}`
                            : `US${tier.price} `}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Color Selection with stagger animation */}
              {product && product?.variant?.length > 0 && (
                <div
                  className={`transition-all duration-500 delay-150 ${
                    showVariationsSheet
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Color({product?.variant.length}): {selectedColor}
                      </div>
                      <div className="flex gap-2">
                        {product?.variant.map((_, index) => {
                          const bgColor = getColorBgClass(_.trim());
                          const totalForColor = getTotalQuantityForColor(_);
                          return (
                            <button
                              key={index}
                              onClick={e => {
                                e.preventDefault();
                                setSelectedColor(_);
                                handleVariationClick();
                              }}
                              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center hover:border-gray-400 transition-colors relative cursor-pointer ${
                                selectedColor === _
                                  ? "border-black border-2"
                                  : "border-gray-200"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg ${bgColor}`}
                              ></div>
                              {totalForColor > 0 && (
                                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                                  x{totalForColor}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ram Selection with stagger animation */}
              {product && product?.ram?.length > 0 && (
                <div
                  className={`transition-all duration-500 delay-200 ${
                    showVariationsSheet
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="font-medium">
                      Ram ({product.ram.length}):
                    </span>
                    <span className="ml-2 text-gray-600">{selectedRam}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.ram.map((ram, index) => (
                      <Button
                        key={index}
                        onClick={e => {
                          e.preventDefault();
                          setSelectedRam(ram);
                          handleVariationClick();
                        }}
                        className={`px-4 py-2 text-sm rounded-medium border transition-all duration-200 hover:scale-105 text-foreground ${
                          selectedModel === ram
                            ? "border-black border-2 bg-white shadow-md transform scale-105"
                            : "border-gray-300 bg-orange-50 hover:bg-orange-100"
                        }`}
                      >
                        {ram}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {/* Model Selection with stagger animation */}
              {product && product?.model?.length > 0 && (
                <div
                  className={`transition-all duration-500 delay-200 ${
                    showVariationsSheet
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="font-medium">
                      model name({product.model.length}):
                    </span>
                    <span className="ml-2 text-gray-600">{selectedModel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.model.map((model, index) => (
                      <button
                        key={index}
                        onClick={e => {
                          e.preventDefault();
                          setSelectedModel(model);
                          handleVariationClick();
                        }}
                        className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 hover:scale-105 ${
                          selectedModel === model
                            ? "border-black border-2 bg-white shadow-md transform scale-105"
                            : "border-gray-300 bg-orange-50 hover:bg-orange-100"
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Grade Selection with stagger animation */}
              {product && product?.grade?.length > 0 && (
                <div
                  className={`transition-all duration-500 delay-250 ${
                    showVariationsSheet
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="font-medium">
                      grade({product.grade.length}):
                    </span>
                    <span className="ml-2 text-gray-600">{selectedGrade}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.grade.map((grade, index) => (
                      <button
                        key={index}
                        onClick={e => {
                          e.preventDefault();
                          setSelectedGrade(grade);
                          handleVariationClick();
                        }}
                        className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 hover:scale-105 ${
                          selectedGrade === grade
                            ? "border-black border-2 bg-white shadow-md transform scale-105"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Storage Selection with stagger animation */}
              {product &&
              product?.storage?.length > 0 &&
              product.plug.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-sm font-medium mb-2">
                    Storage({product?.storage?.length}): {selectedModel}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product?.storage.map((option, index) => (
                      <Button
                        key={index}
                        onClick={e => {
                          e.preventDefault();
                          setSelectedStorage(option);
                          handleVariationClick();
                        }}
                        className={`px-3 py-1 text-sm rounded-md border hover:bg-gray-100 transition-colors text-foreground ${
                          selectedStorage === option
                            ? "border-black border-2 bg-white"
                            : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        {option.trim()}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className={`transition-all duration-500 delay-300 ${
                    showVariationsSheet
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="font-medium">
                      Storage ({product && product.storage.length})
                    </span>
                  </div>
                  <div className="space-y-3">
                    {product &&
                      product.storage.map((storage, index) => {
                        const currentQuantity =
                          getCurrentStorageQuantities()[storage] || 0;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg transition-all duration-200 hover:shadow-md hover:border-orange-200"
                          >
                            <div className="flex items-center">
                              <button
                                className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 mr-4 ${
                                  currentQuantity > 0
                                    ? "border-black border-2 bg-white shadow-sm"
                                    : "border-gray-300 bg-orange-50"
                                }`}
                              >
                                {storage}
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-bold text-orange-600">
                                {product &&
                                  `US$${getDisplayPrice(
                                    product.pricingTiers,
                                    getCurrentStorageQuantities,
                                  )}`}
                              </span>{" "}
                              <div className="flex items-center border rounded-full">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleStorageQuantityChange(
                                      storage,
                                      currentQuantity - 1,
                                    )
                                  }
                                  disabled={currentQuantity <= 0}
                                  className="h-8 w-8 p-0 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={currentQuantity}
                                  onChange={e =>
                                    handleStorageQuantityChange(
                                      storage,
                                      Number.parseInt(e.target.value) || 0,
                                    )
                                  }
                                  className="w-20 h-8 text-center border-0 bg-transparent transition-all duration-200 focus:bg-orange-50"
                                  min={0}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleStorageQuantityChange(
                                      storage,
                                      currentQuantity + 1,
                                    )
                                  }
                                  className="h-8 w-8 p-0 rounded-full transition-all duration-200 hover:bg-green-50 hover:text-green-600"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
              {/* Plug Selection with stagger animation */}
              {product && product?.plug?.length > 0 && (
                <div
                  className={`transition-all duration-500 delay-300 ${
                    showVariationsSheet
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="font-medium">
                      Plug ({product.plug.length})
                    </span>
                  </div>
                  <div className="space-y-3">
                    {product.plug.map((plug, index) => {
                      const currentQuantity =
                        getCurrentStorageQuantities()[plug] || 0;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg transition-all duration-200 hover:shadow-md hover:border-orange-200"
                        >
                          <div className="flex items-center">
                            <button
                              className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 mr-4 ${
                                currentQuantity > 0
                                  ? "border-black border-2 bg-white shadow-sm"
                                  : "border-gray-300 bg-orange-50"
                              }`}
                            >
                              {plug}
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-orange-600">
                              {product &&
                                `US$${getDisplayPrice(
                                  product.pricingTiers,
                                  getCurrentStorageQuantities,
                                )}`}
                            </span>{" "}
                            <div className="flex items-center border rounded-full">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStorageQuantityChange(
                                    plug,
                                    currentQuantity - 1,
                                  )
                                }
                                disabled={currentQuantity <= 0}
                                className="h-8 w-8 p-0 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={currentQuantity}
                                onChange={e =>
                                  handleStorageQuantityChange(
                                    plug,
                                    Number.parseInt(e.target.value) || 0,
                                  )
                                }
                                className="w-20 h-8 text-center border-0 bg-transparent transition-all duration-200 focus:bg-orange-50"
                                min={0}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStorageQuantityChange(
                                    plug,
                                    currentQuantity + 1,
                                  )
                                }
                                className="h-8 w-8 p-0 rounded-full transition-all duration-200 hover:bg-green-50 hover:text-green-600"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Total Summary with animation */}
              <div
                className={`border-t pt-4 transition-all duration-500 delay-400 ${
                  showVariationsSheet
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total Quantity:</span>
                  <span className="font-bold">{getTotalQuantity()} pieces</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Combinations:</span>
                  <span className="font-bold">
                    {Object.keys(combinationData).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-xl font-bold text-orange-600 transition-all duration-300">
                    US{formatUSD(Number(getTotalPrice(product?.pricingTiers)))}
                  </span>
                </div>
              </div>

              {/* Shipping with animation */}
              <div
                className={`border-t pt-4 transition-all duration-500 delay-450 ${
                  showVariationsSheet
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <h4 className="font-medium mb-2">Shipping</h4>
                <p className="text-sm text-gray-600">
                  Shipping fee and delivery date to be negotiated. Chat with
                  supplier now for more details.
                </p>
              </div>

              {/* Action Buttons with animation */}
              <div
                className={`flex gap-4 pt-4 transition-all duration-500 delay-500 ${
                  showVariationsSheet
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Button
                  variant="outline"
                  className="flex-1 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  onClick={() => {
                    setShowVariationsSheet(false);
                    handleContactSupplier();
                  }}
                >
                  Chat now
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  onClick={handleAddToCart}
                >
                  Send inquiry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
