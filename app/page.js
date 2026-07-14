import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickInquiry from "@/components/QuickInquiry";
import LivingBenefits from "@/components/LivingBenefits";
import PropertyDetails from "@/components/PropertyDetails";
import WhyVisit from "@/components/WhyVisit";
import InfoFAQ from "@/components/InfoFAQ";
import ReservationForm from "@/components/ReservationForm";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import { site, project } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: site.name,
  description:
    "구월동 중심 브랜드 신축 주거공간. 힐스테이트 구월아트파크 홍보관 방문예약 안내.",
  url: site.url,
  numberOfAccommodationUnits: 496,
  address: {
    "@type": "PostalAddress",
    addressLocality: "인천 남동구 구월동",
    addressCountry: "KR",
  },
  developer: { "@type": "Organization", name: project.developer },
  telephone: site.phone,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <QuickInquiry />
        <LivingBenefits />
        <PropertyDetails />
        <WhyVisit />
        <InfoFAQ />
        <ReservationForm />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
