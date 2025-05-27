import { z } from "zod";

// Schema for a single Product response
export const ProductResponseSchema = z.object({
  id: z.string().length(26), // ULID
  sku: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(), // Decimal comes as string from Prisma by default
  imageUrl: z.string().url().optional(),
  stockQuantity: z.number(),
  minimumOrderQuantity: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  condition: z.string(),
  grade: z.string().optional(),
  ram: z.string().optional(),
  storageOptions: z.array(z.string()),
  screenSize: z.string().optional(),
  battery: z.string().optional(),
  weight: z.string().optional(),
  resolution: z.string().optional(),
  cpu: z.string().optional(),
  simType: z.string().optional(),
  nfc: z.boolean().optional(),
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  imageGallery: z.array(z.string().url()),
  videoUrl: z.string().url().optional(),
  supplierName: z.string().optional(),
});

// For an array of products (e.g., getAll)
export const ProductListResponseSchema = z.object({
  products: z.array(ProductResponseSchema),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    total: z.number(),
  }),
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
