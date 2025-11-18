import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Przykładowe produkty rybne (podobnie jak w oryginalnej aplikacji)
  const products = [
    { barcode: '5901234567890', name: 'Filet z łososia norweskieg 300g' },
    { barcode: '5901234567891', name: 'Dorsz mrożony filet 400g' },
    { barcode: '5901234567892', name: 'Krewetki królewskie 250g' },
    { barcode: '5901234567893', name: 'Tuńczyk w oleju 170g' },
    { barcode: '5901234567894', name: 'Pstrąg tęczowy świeży 1kg' },
    { barcode: '5901234567895', name: 'Makrela wędzona 200g' },
    { barcode: '5901234567896', name: 'Śledź marynowany 300g' },
    { barcode: '5901234567897', name: 'Kalmary mrożone 500g' },
    { barcode: '5901234567898', name: 'Okoń nilowy filet 350g' },
    { barcode: '5901234567899', name: 'Mintaj mrożony 1kg' },
    { barcode: '5901234567800', name: 'Sum europejski filet 400g' },
    { barcode: '5901234567801', name: 'Płastuga mrożona 300g' },
    { barcode: '5901234567802', name: 'Halibut filet 250g' },
    { barcode: '5901234567803', name: 'Sandacz świeży 1kg' },
    { barcode: '5901234567804', name: 'Łosoś wędzony 150g' },
    { barcode: '5901234567805', name: 'Sardynki w oleju 120g' },
    { barcode: '5901234567806', name: 'Szprotki wędzone 170g' },
    { barcode: '5901234567807', name: 'Ośmiornica mrożona 600g' },
    { barcode: '5901234567808', name: 'Małże świeże 500g' },
    { barcode: '5901234567809', name: 'Tusza łososia 2kg' },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { barcode: product.barcode },
      update: {},
      create: {
        barcode: product.barcode,
        name: product.name,
        isManual: false,
      },
    })
  }

  console.log(`✅ Seeded ${products.length} products`)

  // Przykładowy dokument testowy
  const testDocument = await prisma.document.create({
    data: {
      warehouseWorker: 'Jan Kowalski',
      date: new Date(),
      notes: 'Przykładowy dokument testowy',
      items: {
        create: [
          {
            product: {
              connect: { barcode: '5901234567890' },
            },
            quantity: 5,
          },
          {
            product: {
              connect: { barcode: '5901234567891' },
            },
            quantity: 3,
          },
          {
            product: {
              connect: { barcode: '5901234567892' },
            },
            quantity: 10,
          },
        ],
      },
    },
  })

  console.log(`✅ Created test document: ${testDocument.id}`)
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
