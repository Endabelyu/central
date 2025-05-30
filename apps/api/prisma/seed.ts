import { ulid } from "ulid";
import { nanoid } from "nanoid";
import slugify from "slugify";
import prismaClient from "../src/libs/prismaClient";
import { dataProducts } from "./data/productData";
import { Prisma } from "@prisma/client";
async function main() {
  console.log("🧹 Clearing old product data...");
  //   use this if you want to clear the data
  await prismaClient.productPricingTier.deleteMany();
  await prismaClient.product.deleteMany();

  console.log("🌱 Seeding products...");
  const products = dataProducts.map((base, i) => ({
    id: ulid(),
    sku: `SKU-${nanoid(6).toUpperCase()}`,
    slug: `${slugify(base.name, { lower: true })}-${nanoid(6)}`,
    name: base.name,
    description: base.description,
    stockQuantity: base.stockQuantity,
    minimumOrderQuantity: base.minimumOrderQuantity,
    condition: "Used",
    grade: base.grade || [],
    ram: base.ram || [],
    plug: base.plug || [],
    storage: base.storage || [],
    screenSize: base.screenSize || "6.1 inches",
    battery: base.battery || "3000 mAh",
    weight: base.weight || "180g",
    resolution: base.resolution || "1080 x 2400",
    cpu: base.cpu || "Snapdragon",
    simType: base.sim || "Nano-SIM and eSIM",
    nfc: base.nfc ?? true,
    brand: base.brand || "Generic",
    model: base.model || [],
    imageGallery: base.images,
    quantityUnit: base.quantityUnit,
    videoUrl: "https://example.com/video.mp4",
    supplierName: base.supplierName || "Generic",
    supplierVerified: base.supplierVerified || false,
    levelSupplier: base.levelSupplier || 0,
    rating: base.rating || 0,
    pricingTiers: base.pricingTiers,
    variant: base.variant || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  for (const product of products) {
    const { pricingTiers, ...productWithoutPricingTiers } = product;
    const newProductResult = await prismaClient.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
        pricingTiers: {
          create: product.pricingTiers.map(tier => ({
            minQty: tier.minQty,
            maxQty: tier.maxQty ?? null,
            price: tier.price,
          })),
        },
      },
      create: {
        ...product,
        pricingTiers: {
          create: product.pricingTiers.map(tier => ({
            minQty: tier.minQty,
            maxQty: tier.maxQty ?? null,
            price: tier.price,
          })),
        },
      },
    });

    console.info(`🆕 Product: ${newProductResult.name}`);
  }
  // for (const [i, base] of dataProducts.entries()) {
  //   const productId = ulid();
  //   const slug = `${slugify(base.name, { lower: true })}-${nanoid(6)}`;
  //   const product = {
  //     id: productId,
  //     sku: `SKU-${nanoid(6).toUpperCase()}`,
  //     slug,
  //     name: base.name,
  //     description: base.description || "",
  //     // price: new Prisma.Decimal(base.price || 100000),
  //     stockQuantity: base.stockQuantity || 100,
  //     minimumOrderQuantity: base.minimumOrderQuantity || 1,
  //     // condition: base.condition || "Used",
  //     grade: base.grade || [],
  //     ram: base.ram || [],
  //     storage: base.storage || ["64GB"],
  //     screenSize: base.screenSize || "6.1 inches",
  //     battery: base.battery || "3000 mAh",
  //     weight: base.weight || "180g",
  //     resolution: base.resolution || "1080 x 2400",
  //     cpu: base.cpu || "Snapdragon",
  //     simType: base.sim || "Nano-SIM",
  //     nfc: base.nfc ?? true,
  //     brand: base.brand || "Generic",
  //     model: base.model || [],
  //     images: base.images || null,

  //     videoUrl: "https://example.com/video.mp4",
  //     quantityUnit: base.quantityUnit || "units",
  //     supplierName: base.supplierName || "Generic",
  //     supplierVerified: base.supplierVerified ?? false,
  //     levelSupplier: base.levelSupplier ?? 0,
  //     rating: new Prisma.Decimal(base.rating ?? 0),
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };

  //   const pricingTiers = (base.pricingTiers || []).map(tier => ({
  //     minQty: tier.minQty,
  //     maxQty: tier.maxQty ?? null,
  //     price: new Prisma.Decimal(tier.price),
  //   }));

  //   await prismaClient.product.create({
  //     data: {
  //       ...product,
  //       pricingTiers: {

  //       },
  //     },
  //     include: {
  //       pricingTiers: true,
  //     },
  //   });

  //   console.info(`✅ Seeded: ${product.name}`);
  // }

  console.log("🎉 All products seeded successfully.");
  console.log("✅ Seeding complete!");
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
