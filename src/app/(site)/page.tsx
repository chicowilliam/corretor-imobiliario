import { getHomeContent } from "@/data/queries/home";
import { parseHomeSearch, type SearchParams } from "@/lib/catalog/search-params";
import { HomeHero } from "./_components/HomeHero";
import { HomeSearch } from "./_components/HomeSearch";
import { FeaturedProperty } from "./_components/FeaturedProperty";
import { SelectedListings } from "./_components/SelectedListings";
import { AdvisorIntro } from "./_components/AdvisorIntro";
import { OwnerInvitation } from "./_components/OwnerInvitation";
import { SocialProof } from "./_components/SocialProof";
import { PrivateCollectionPreview } from "./_components/PrivateCollectionPreview";

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const search = parseHomeSearch(params);
  const content = await getHomeContent(search, params.selection === "all");
  return <main id="conteudo">
    <div className="hero-chapter"><HomeHero hero={content.hero} /></div>
    <div className="home-content">
    <div className="hero-exit-edge" aria-hidden="true" />
    <HomeSearch areas={content.areas.map(({ id, name }) => ({ id, name }))} search={search} />
    <FeaturedProperty property={content.featured} whatsapp={content.agent.whatsapp} />
    <SelectedListings properties={content.selected} hasSearch={content.hasSearch} whatsapp={content.agent.whatsapp} />
    <AdvisorIntro agent={content.agent} />
    <OwnerInvitation image={content.privateProperty.media.cover} whatsapp={content.agent.whatsapp} />
    <SocialProof testimonials={content.testimonials} />
    <PrivateCollectionPreview property={content.privateProperty} whatsapp={content.agent.whatsapp} />
    </div>
  </main>;
}
