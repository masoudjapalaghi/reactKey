import { CountriesList } from "@/components/list";
import { Country } from "../components/types";
import { rawCountries } from "@/raw-data";
const getCountriesFromRawData = (raw: any[]): Country[] => {
  return raw.map((value: any) => ({
    __typename: "country",
    name: String(value.name.common),
    id: String(value.cca2).toLowerCase(),
    independent: Boolean(value.independent),
    unMember: Boolean(value.unMember),
    flagUrl: `https://flagcdn.com/${String(value.cca2).toLowerCase()}.svg`,
    region: String(value.region),
    capital: value.capital.length ? String(value.capital[0]) : "",
    subregion: String(value.subregion),
  }));
};
export const Page = () => {
  return (
    <>
      <div className="content">
        <CountriesList countries={getCountriesFromRawData(rawCountries)} whichRunnerToBe={"indexGoodIdea"} />
      </div>
    </>
  );
};
export default Page;
