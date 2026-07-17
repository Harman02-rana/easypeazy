import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CompanyExplorer from "@/components/CompanyExplorer";
import { getCompanies, getCategories, getJobs } from "@/lib/data";

export default function Home() {
  const companies = getCompanies();
  const categories = getCategories();
  const roleCount = getJobs().length;

  return (
    <>
      <Hero companyCount={companies.length} roleCount={roleCount} />
      <HowItWorks />
      <CompanyExplorer companies={companies} categories={categories} />
    </>
  );
}
