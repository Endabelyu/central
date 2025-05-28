import { ulid } from "ulid";
import { nanoid } from "nanoid";
import slugify from "slugify";
import prismaClient from "../src/libs/prismaClient";
import { dataProducts } from "./data/productData";
async function main() {
  console.log("🧹 Clearing old product data...");
  //   use this if you want to clear the data
  await prismaClient.product.deleteMany();
  const products = dataProducts.map((base, i) => ({
    id: ulid(),
    sku: `SKU-${nanoid(6).toUpperCase()}`,
    slug: `${slugify(base.name, { lower: true })}-${nanoid(6)}`,
    name: base.name,
    description: base.description,
    price: parseFloat(`100000`),
    // imageUrl: base.image ?? `https://picsum.photos/seed/${i + 1}/400/400`,
    stockQuantity: 100,
    minimumOrderQuantity: 5,
    condition: "Used",
    grade: base.grade,
    ram: base.ram || "4GB",
    storage: base.storage || ["64GB"],
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
    videoUrl: "https://example.com/video.mp4",
    supplierName: base.supplierName || "Generic",
    supplierVerified: base.supplierVerified || false,
    levelSupplier: base.levelSupplier || 0,
    rating: base.rating || 0,
    pricingTiers: base.pricingTiers,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // 🆕 Upsert loop
  for (const product of products) {
    const count = 0;
    const newProductResult = await prismaClient.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.info(`🆕 Product: ${newProductResult.name}`);
  }
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
