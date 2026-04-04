import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EXPECTED_TABLE_COLUMNS = {
  HeroSection: [
    "id",
    "headline",
    "description",
    "domainLogoUrl",
    "domainLabel",
    "name",
    "role",
    "techTags",
    "cvUrl",
    "avatarUrl",
    "avatarAlt",
    "githubUrl",
    "linkedinUrl",
    "twitterUrl",
    "statusBadgeDetail",
    "createdAt",
    "updatedAt",
    "openToWork",
  ],
  AboutSection: ["id", "headline", "paragraph", "stats", "skills", "createdAt", "updatedAt"],
  Project: ["id", "title", "description", "techStack", "imageUrl", "link", "githubUrl", "isPublished", "createdAt", "updatedAt"],
  Experience: ["id", "title", "company", "periodStart", "periodEnd", "description", "createdAt", "updatedAt"],
  Certificate: ["id", "title", "issuer", "imageUrl", "issueDate", "credentialUrl", "featured", "createdAt", "updatedAt"],
};

async function getTableColumns(tableName) {
  const rows = await prisma.$queryRawUnsafe(`SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = '${tableName}' ORDER BY ORDINAL_POSITION`);

  return rows.map((row) => row.COLUMN_NAME);
}

function diffColumns(expected, actual) {
  const missing = expected.filter((column) => !actual.includes(column));
  const unexpected = actual.filter((column) => !expected.includes(column));
  return { missing, unexpected };
}

async function run() {
  let hasSchemaError = false;

  console.log("DB Verify: checking table schema...");

  for (const [tableName, expectedColumns] of Object.entries(EXPECTED_TABLE_COLUMNS)) {
    const actualColumns = await getTableColumns(tableName);
    const { missing, unexpected } = diffColumns(expectedColumns, actualColumns);

    if (missing.length === 0 && unexpected.length === 0) {
      console.log(`  OK ${tableName} columns match (${actualColumns.length})`);
      continue;
    }

    hasSchemaError = true;
    console.log(`  FAIL ${tableName} columns mismatch`);
    if (missing.length > 0) {
      console.log(`    Missing   : ${missing.join(", ")}`);
    }
    if (unexpected.length > 0) {
      console.log(`    Unexpected: ${unexpected.join(", ")}`);
    }
  }

  console.log("DB Verify: checking key row counts...");

  const counts = {
    users: await prisma.user.count(),
    heroSections: await prisma.heroSection.count(),
    aboutSections: await prisma.aboutSection.count(),
    projects: await prisma.project.count(),
    experiences: await prisma.experience.count(),
    certificates: await prisma.certificate.count(),
  };

  console.log("  Counts:", counts);

  if (hasSchemaError) {
    console.error("DB Verify failed: schema mismatch detected.");
    process.exitCode = 1;
    return;
  }

  console.log("DB Verify passed.");
}

run()
  .catch((error) => {
    console.error("DB Verify failed with error:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
