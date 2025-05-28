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
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/lib/trpc";
import { Link, useParams } from "react-router";
import Image from "~/components/imageContainer";

const productData = {
  1: {
    title: "iPhone 14 Pro Max",
    description:
      "Original Apple iPhone with A16 Bionic chip and Pro camera system",
    price: 520,
    maxPrice: 580,
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    supplier: {
      name: "Shenzhen Tech Co., Ltd.",
      rating: 5.0,
      reviews: 21,
      location: "Guangdong, China",
      verified: true,
      responseRate: "98%",
      responseTime: "< 2 hours",
    },
    variants: [
      {
        storage: "128GB",
        colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
        price: 520,
        maxPrice: 550,
      },
      {
        storage: "256GB",
        colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
        price: 550,
        maxPrice: 580,
      },
      {
        storage: "512GB",
        colors: ["Space Black", "Silver", "Gold"],
        price: 580,
        maxPrice: 620,
      },
    ],
    specifications: {
      Brand: "Apple",
      Model: "iPhone 14 Pro Max",
      Network: "5G",
      Condition: "Original New",
      Warranty: "1 Year",
      "Operating System": "iOS 16",
    },
    minOrder: 2,
    stock: 500,
    features: [
      "A16 Bionic chip with 6-core CPU",
      "Pro camera system with 48MP main camera",
      "6.7-inch Super Retina XDR display",
      "5G connectivity worldwide",
      "Face ID for secure authentication",
      "iOS 16 with latest features",
    ],
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  //   const productId = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //   useEffect(() => {
  //     setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  //     if (product?.variants[0]?.colors[0]) {
  //       setSelectedColor(product.variants[0].colors[0]);
  //     }
  //   }, [product]);
  const trpc = useTRPC();
  const {
    data: productsData,
    isLoading: productLoading,
    error,
  } = useQuery(
    trpc.product.getBySlug.queryOptions({
      slug: "used-iphone-12-pro-max-moccasin-mention-jUgrwF",
    }),
  );

  //   if (!productId) {
  //     return (
  //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold mb-4">Product not found</h1>
  //           <Link href="/">
  //             <Button>Back to Products</Button>
  //           </Link>
  //         </div>
  //       </div>
  //     );
  //   }

  //   const currentVariant = productsData.variants[selectedVariant];

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      window.location.href = "/login?redirect=cart";
      return;
    }
    //   (${currentVariant.storage},
    alert(
      `Added ${quantity} x ${productsData?.name} 
       ,${selectedColor}) to cart!`,
    );
  };

  const handleContactSupplier = () => {
    if (!isLoggedIn) {
      window.location.href = "/login?redirect=chat";
      return;
    }
    alert("Opening chat with supplier...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-orange-500">
                Alibaba.com
              </span>
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
          <Link to="/" className="hover:text-orange-500 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{productsData?.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border p-4">
              <Image
                src={"/placeholder.svg"}
                alt={productsData?.name as string}
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            {/* <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded border-2 p-2 ${
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
              <h1 className="text-3xl font-bold mb-2">{productsData?.name}</h1>
              <p className="text-gray-600 mb-4">{productsData?.description}</p>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {/* {productsData?.supplierName?.rating} */}
                  </span>
                  <span className="text-gray-600">
                    {/* ({productsData?.supplierName?.reviews} reviews) */}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Variants */}
            {/* <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Storage
                </Label>
                <div className="flex gap-2">
                  {product.variants.map((variant, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedVariant === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setSelectedVariant(index);
                        setSelectedColor(variant.colors[0]);
                      }}
                    >
                      {variant.storage}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentVariant.colors.map(color => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div> */}

            {/* Price */}
            {/* <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                US${currentVariant.price}-{currentVariant.maxPrice}
              </div>
              <div className="text-sm text-gray-600">
                Min. order: {product.minOrder} pieces | {product.stock} pieces
                available
              </div>
            </div> */}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity (Min. order: {productsData?.stockQuantity} pieces)
                </Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          Number(productsData?.stockQuantity),
                          quantity - 1,
                        ),
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={e =>
                      setQuantity(
                        Math.max(
                          Number(productsData?.stockQuantity),
                          Number.parseInt(e.target.value) ||
                            Number(productsData?.stockQuantity),
                        ),
                      )
                    }
                    className="w-20 text-center"
                    min={Number(productsData?.stockQuantity)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">pieces</span>
                </div>
              </div>

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
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card>
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
                    {/* <div className="space-y-2">
                      {Object.entries(productsData?.specifications).map(
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
                    </div> */}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Key Features</h3>
                    {/* <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul> */}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variants" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Available Variants</h3>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.variants.map((variant, index) => (
                      <Card key={index} className="p-4">
                        <div className="font-medium mb-2">
                          {variant.storage}
                        </div>
                        <div className="text-lg font-bold text-orange-600 mb-2">
                          US${variant.price}-{variant.maxPrice}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Available colors:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {variant.colors.map(color => (
                            <Badge
                              key={color}
                              variant="outline"
                              className="text-xs"
                            >
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div> */}
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
                          {productsData?.supplierName}
                        </h3>
                        {/* {product.supplier.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )} */}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {/* <div>📍 {product.supplier.location}</div> */}
                        {/* <div>
                          ⭐ {product.supplier.rating}/5.0 (
                          {product.supplier.reviews} reviews)
                        </div> */}
                        {/* <div>
                          💬 Response rate: {product.supplier.responseRate}
                        </div>
                        <div>
                          ⚡ Response time: {product.supplier.responseTime}
                        </div> */}
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
        </Card>
      </div>
    </div>
  );
}
