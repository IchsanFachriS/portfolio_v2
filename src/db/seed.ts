import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import * as s from "./schema";

const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const db = drizzle(client, { schema: s });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(s.users).values({ email: email.toLowerCase(), name: "Admin", passwordHash })
      .onConflictDoUpdate({ target: s.users.email, set: { passwordHash } });
    console.log(`Admin user siap: ${email}`);
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD belum diisi — user admin dilewati.");
  }

  const hasProfile = (await db.select().from(s.profile).where(eq(s.profile.id, "main")))[0];
  if (hasProfile) {
    console.log("Konten sudah ada, seed konten dilewati.");
    return;
  }

  await db.insert(s.profile).values({
      id: "main",
      name: "Ichsan Fachri Siroj",
      headline: "Solution Architect | Full-Stack & WebGIS Developer",
      location: "Bandung, Indonesia",
      email: "ichsanfachrisrj@gmail.com",
      linkedin: "https://linkedin.com/in/ichsanfsrj",
      github: "https://github.com/IchsanFachriS",
      summary:
        "Geodesy and Geomatics Engineering graduate from Institut Teknologi Bandung with hands-on experience building WebGIS platforms and full-stack web applications (React, TypeScript, Flask, PostgreSQL/PostGIS). I design end-to-end solution architectures and build geospatial products that turn spatial data into decisions.",
      education:
        "Institut Teknologi Bandung (2022 – 2026)\nBSc Geodesy and Geomatics Engineering — GPA 3.62/4.00, Cum Laude\nSpecializing in Geographic Information Science and Technology (GIST), secondary focus in Hydrography",
  });

  const exp = [
    ["Solution Architect", "PT Multi Areal Planing Indonesia (MAPID)", "Bandung", "Aug 2026 – Present",
      "Translate business requirements into end-to-end architectures spanning frontend, backend, database, API, and infrastructure.\nDefine tech stacks and non-functional requirements for scalability, security, and cost efficiency.\nCollaborate with developers, DevOps, spatial analysts, and stakeholders; maintain architecture documentation."],
    ["Corporate Trainer", "PT Multi Areal Planing Indonesia (MAPID)", "Bandung", "Nov 2026 – Jan 2027",
      "Design and deliver an 8-week private WebGIS training covering backend development, spatial data upload, and VPS deployment.\nDevelop hands-on curriculum and code materials for participants new to backend development."],
    ["Spatial Data Engineer", "PT Gisarutala Citra Perkasa", "Remote", "Oct 2026 – Dec 2026",
      "Analyze and document spatial datasets for BP Batam's KPBPB data migration.\nProfile shapefiles (CRS, geometry validity, attribute schemas) and assess completeness against WebGIS requirements."],
    ["Full-stack Developer", "Institut Teknologi Bandung", "Bandung", "Feb 2026 – Jan 2027",
      "Developed and maintained the official department website using React, TypeScript, PHP, and MySQL.\nImplemented new features in collaboration with academic staff."],
    ["Research Assistant — GIS Modelling & WebGIS Developer", "GIST Research Group, FITB ITB", "Bandung", "Jul 2026 – Nov 2026",
      "Modeled the November 2025 Sumatra flash flood using an integrated HEC-HMS and HEC-RAS workflow.\nEstimated economic losses and built the flood inundation & building loss dashboard with React and TypeScript."],
    ["WebGIS Mentor", "PT Multi Areal Planing Indonesia (MAPID)", "Remote", "Aug 2026 – Sep 2026",
      "Mentored participants through end-to-end WebGIS project development via biweekly sessions."],
    ["Research Assistant — WebGIS Developer", "Institut Teknologi Bandung", "Bandung", "Oct 2025 – Apr 2026",
      "Developed SpaceMangrove, a mangrove ecotourism WebGIS platform for Desa Srinanti, Nunukan."],
    ["Front-end Developer", "PT Interdata Unity Connection", "Bandung", "Oct 2025 – Dec 2025",
      "Built the front-end of a highway asset management WebGIS with React and GeoServer.\nIntegrated REST APIs and spatial datasets with backend developers."],
    ["Research Assistant — WebGIS Developer", "Institut Teknologi Bandung", "Bandung", "Aug 2025 – Nov 2025",
      "Contributed to Searibu, a maritime tidal-prediction WebGIS platform."],
    ["Data Center Intern", "PT Pageo Utama", "East Jakarta", "Jan 2025 – Feb 2025",
      "Processed Multibeam Echosounder (MBES) bathymetric data.\nAutomated hydrographic processing workflows with Python."],
  ];
  await db.insert(s.experience).values(
    exp.map(([role, company, location, period, bullets], i) => ({ role, company, location, period, bullets, order: i })),
  );

  const projects = [
    ["ALERA-FI — Flood Early-Warning Platform", "Flood monitoring and early-warning platform for communities in the Citarum River Basin. Built the AlirCita landing page with a server-side validated contact form.", "Next.js, TypeScript, Tailwind CSS"],
    ["Searibu — Maritime Tidal Prediction WebGIS", "Full-stack WebGIS delivering tidal predictions, real-time water levels, and marine weather for coastal communities. Load-tested and designed a subscription access model.", "React, TypeScript, Leaflet, Flask, PostgreSQL, Docker"],
    ["SpaceMangrove — Mangrove Ecotourism WebGIS", "WebGIS integrating drone orthophotos, NDVI rasters, and wildlife points, with a Random Forest land-cover model (2019–2024) and change analytics.", "React, TypeScript, Leaflet, Google Earth Engine"],
    ["ITB Geodesy Department Website", "Rebuilt and maintained the department's official website with bilingual content and an admin panel.", "React, TypeScript, PHP, MySQL"],
    ["Trans Marga Jateng — Highway Asset WebGIS", "Frontend for road-ledger documentation and interactive spatial asset management.", "React, MapLibre, GeoServer"],
  ];
  await db.insert(s.project).values(
    projects.map(([title, description, techStack], i) => ({ title, description, techStack, order: i })),
  );

  const awards = [
    ["Bronze Medal — Seoul International Invention Fair (SIIF 2025)", "KIPA", "Dec 2025", "Farmora, an agricultural education & direct-to-market app."],
    ["1st Honorable Mention — International Green Scientific Competition", "Universitas Negeri Semarang", "Aug 2025", "Geospatial geothermal potential analysis in West Halmahera."],
    ["Gold Medal & Asian Best Young Inventor — WYIE 2025", "MINDS Malaysia", "Jun 2025", "Eco-friendly concrete composite."],
    ["Dean's List — 4 Semesters", "FITB ITB", "2024 – 2026", null],
    ["Publication — Landsat-8 & ASTER for Artisanal Mining Impact (ISAST 2024)", "Springer", "Sep 2024", "DOI: 10.1007/978-981-96-1344-1_3"],
  ];
  await db.insert(s.award).values(
    awards.map(([title, issuer, date, note], i) => ({ title: title!, issuer: issuer!, date: date!, note, order: i })),
  );

  const skills = [
    ["Solution Architecture", "System Design, Requirements Analysis, NFR, Architecture Documentation"],
    ["Frontend", "React, Next.js, TypeScript, Tailwind CSS, Vite"],
    ["Backend & Database", "Node.js, Python, Flask, PHP, REST API, PostgreSQL, PostGIS, MySQL"],
    ["WebGIS & Geospatial", "Leaflet, MapLibre, Mapbox, OpenLayers, CesiumJS, GeoServer, QGIS, ArcGIS Pro"],
    ["Remote Sensing & Modelling", "Google Earth Engine, ENVI, SNAP, Agisoft Metashape, HEC-HMS, HEC-RAS"],
    ["Cloud & DevOps", "AWS, Docker, Linux, Nginx, VPS Deployment, CI/CD, Vercel"],
  ];
  await db.insert(s.skillGroup).values(
    skills.map(([name, items], i) => ({ name, items, order: i })),
  );

  console.log("Konten awal dari CV berhasil di-seed.");
}

main().finally(() => client.end());
