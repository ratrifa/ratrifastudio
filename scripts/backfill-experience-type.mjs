import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const beforeTotal = await prisma.experience.count();
  const beforeWithoutType = await prisma.experience.count({ where: { experienceType: null } });

  const keywordCases = [
    {
      type: "VOLUNTEER",
      regex: "volunteer|volunteering|relawan|charity|ngo|nonprofit|non-profit|community service",
    },
    {
      type: "ORGANIZATION",
      regex: "organization|organisasi|committee|komite|association|himpunan|komunitas|community|club|bem|ukm",
    },
    {
      type: "INTERNSHIP",
      regex: "internship|intern|magang|trainee",
    },
    {
      type: "PART_TIME",
      regex: "part[ -]?time|paruh waktu",
    },
    {
      type: "CONTRACT",
      regex: "contract|kontrak",
    },
    {
      type: "FREELANCE",
      regex: "freelance|freelancer|project-based|project based",
    },
  ];

  for (const item of keywordCases) {
    await prisma.$executeRawUnsafe(
      `UPDATE Experience
       SET experienceType = '${item.type}'
       WHERE experienceType IS NULL
         AND LOWER(CONCAT(COALESCE(title, ''), ' ', COALESCE(company, ''), ' ', COALESCE(description, ''))) REGEXP '${item.regex}'`,
    );
  }

  await prisma.$executeRawUnsafe(
    `UPDATE Experience
     SET experienceType = 'FULL_TIME'
     WHERE experienceType IS NULL`,
  );

  const afterWithoutType = await prisma.experience.count({ where: { experienceType: null } });

  console.log(
    JSON.stringify(
      {
        beforeTotal,
        beforeWithoutType,
        afterWithoutType,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
