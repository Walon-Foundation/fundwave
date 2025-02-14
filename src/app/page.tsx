import FeaturedCampaign from "@/components/heroPart/FeatureCampaign";
import Hero from "@/components/heroPart/Hero";
import Impact from "@/components/heroPart/Impact";
import Info from "@/components/heroPart/Info";

export default function Home(){
  return(
    <div>
      <Hero/>
      <Impact/>
      <FeaturedCampaign/>
      <Info/>
    </div>
  )
}