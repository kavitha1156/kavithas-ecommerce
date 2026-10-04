import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics', description: 'Gadgets and gear.' },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: { name: 'Clothing', slug: 'clothing', description: 'Apparel for all.' },
  });
  
  // Create Brands
  const apple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: { name: 'Apple', slug: 'apple' },
  });

  // Create Product
  const product1 = await prisma.product.upsert({
    where: { slug: 'macbook-pro' },
    update: {},
    create: {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro',
      description: 'The most powerful MacBook ever.',
      price: 2499.00,
      inventory: 50,
      isFeatured: true,
      categoryId: electronics.id,
      brandId: apple.id,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
    },
  });

  console.log(`Created product: ${product1.name}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
