import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding promo codes...');

  // Clear existing promo codes (optional - remove if you want to keep existing)
  // await prisma.promoCode.deleteMany({});

  const promoCodes = [
    {
      code: 'WELCOME10',
      description: '10% off your first order',
      discountType: 'PERCENTAGE' as const,
      discountValue: 10,
      minPurchase: 50,
      maxDiscount: 20,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: 'SAVE20',
      description: '₵20 off orders over ₵100',
      discountType: 'FIXED' as const,
      discountValue: 20,
      minPurchase: 100,
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on any order',
      discountType: 'FIXED' as const,
      discountValue: 15, // Assuming standard shipping is ₵15
      minPurchase: 0,
      usageLimit: null,
      isActive: true,
    },
    {
      code: 'NEWYEAR25',
      description: '25% off, max ₵50 discount',
      discountType: 'PERCENTAGE' as const,
      discountValue: 25,
      minPurchase: 100,
      maxDiscount: 50,
      usageLimit: 200,
      isActive: true,
      validUntil: new Date('2025-12-31'),
    },
  ];

  for (const promo of promoCodes) {
    try {
      await prisma.promoCode.upsert({
        where: { code: promo.code },
        update: promo,
        create: promo,
      });
      console.log(`✓ Created/Updated promo code: ${promo.code}`);
    } catch (error) {
      console.error(`✗ Error creating promo code ${promo.code}:`, error);
    }
  }

  console.log('Promo codes seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding promo codes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

