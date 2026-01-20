import { prisma } from "./src/lib/prisma";

async function main() {
    const properties = await prisma.property.findMany();
    console.log("--- DB Properties ---");
    properties.forEach(p => {
        console.log(`ID: ${p.id}, Region: '${p.region}', Address: '${p.address}'`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
