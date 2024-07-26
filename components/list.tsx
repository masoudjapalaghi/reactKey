import React, { Profiler, useEffect, useState } from "react";
import { Country } from "./types";
import orderBy from "lodash/orderBy";
import { uid } from "uid";
const itemsPerPage = 50;

type CountriesListProps = {
  countries: Country[];
};

export const CountriesList = ({
  countries,
  whichRunnerToBe,
}: CountriesListProps & {
  whichRunnerToBe?: "normal" | "indexBadIdea" | "indexGoodIdea";
}) => {
  return (
    <div>
      <a href="https://www.developerway.com/posts/react-key-attribute" target="_blank">
        reference :https://www.developerway.com/posts/react-key-attribute
      </a>
      <hr />
      <div className="countries-list">
        {whichRunnerToBe === "normal" && (
          <>
            <div>
              <Profiler id="ListItemsNoKey" onRender={(...rest) => console.log(rest)}>
                <ListItemsNoKey countries={countries} />
              </Profiler>
            </div>
            <div>
              <Profiler id="ListItemsNoKeyWithMemo" onRender={(...rest) => console.log(rest)}>
                <ListItemsNoKeyWithMemo countries={countries} />
              </Profiler>
            </div>
            <div>
              <Profiler id="ListItemsWithRandom" onRender={(...rest) => console.log(rest)}>
                <ListItemsWithRandom countries={countries} />
              </Profiler>
            </div>
          </>
        )}
        {whichRunnerToBe === "indexBadIdea" && (
          <>
            <div>
              <Profiler id="ListItemsWithIndex" onRender={(...rest) => console.log(rest)}>
                <ListItemsWithIndex countries={countries} />
              </Profiler>
            </div>
            <div>
              <Profiler id="ListItemsWithId" onRender={(...rest) => console.log(rest)}>
                <ListItemsWithId countries={countries} />
              </Profiler>
            </div>
          </>
        )}
        {whichRunnerToBe === "indexGoodIdea" && (
          <>
            <div>
              <Profiler id="ListItemsPaginatedWithIndex" onRender={(...rest) => console.log(rest)}>
                <ListItemsPaginatedWithIndex countries={countries} />
              </Profiler>
            </div>
            <div>
              <Profiler id="ListItemsPaginatedWithId" onRender={(...rest) => console.log(rest)}>
                <ListItemsPaginatedWithId countries={countries} />
              </Profiler>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
const Item = ({ country, logPrefix }: { country: Country; logPrefix: string }) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    console.log(`MOUNT: ${logPrefix}`);
  }, [logPrefix]);

  console.log(`RENDER: ${logPrefix}`);

  return (
    <span className={`country-item ${isActive ? "active" : ""}`} onClick={() => setIsActive(!isActive)}>
      {country.flagUrl && <img src={country.flagUrl} width={70} style={{ marginRight: "8px" }} alt={country.name} />}
      {country.name}
    </span>
  );
};

const ItemMemo = React.memo(Item);

const ListItemsNoKey = ({ countries }: CountriesListProps) => {
  const [sort, setSort] = useState("asc");

  return (
    <>
      <h3>List without key attribute</h3>
      <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>click to re-render</button>
      {countries.map((country) => (
        <Item country={country} logPrefix="nokey" />
      ))}
    </>
  );
};
const ListItemsNoKeyWithMemo = ({ countries }: CountriesListProps) => {
  const [sort, setSort] = useState("asc");

  return (
    <>
      <h3>List without key with memoised item</h3>
      <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>click to re-render</button>
      {countries.map((country) => (
        <ItemMemo country={country} logPrefix="nokey" />
      ))}
    </>
  );
};
const ListItemsWithRandom = ({ countries }: CountriesListProps) => {
  const [sort, setSort] = useState("asc");

  return (
    <>
      <h3>List with random value in "key"</h3>
      <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>click to re-render</button>
      {countries.map((country, index) => (
        <ItemMemo country={country} key={Math.random()} logPrefix="random" />
      ))}
    </>
  );
};
const ListItemsWithIndex = ({ countries }: CountriesListProps) => {
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [localCountries, setLocalCountries] = useState(countries);

  // sort countries base on state value with lodash orderBy function
  const sortedCountries = orderBy(localCountries, "name", sort);

  // add button that toggles state between 'asc' and 'desc'
  const button = <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>toggle sorting: {sort}</button>;

  const onAddNewCountry = () => {
    const value = uid();
    setLocalCountries([{ id: value, name: `A_${value}`, __typename: "country" }, ...localCountries]);
  };
  const addNewCountry = <button onClick={onAddNewCountry}>add new country</button>;

  return (
    <>
      <h3>List with index in "key"</h3>
      {button}
      {addNewCountry}
      {sortedCountries.map((country, index) => (
        <ItemMemo country={country} key={index} logPrefix="index" />
      ))}
    </>
  );
};
const ListItemsWithId = ({ countries }: CountriesListProps) => {
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [localCountries, setLocalCountries] = useState(countries);
  // sort countries base on state value with lodash orderBy function
  const sortedCountries = orderBy(localCountries, "name", sort);

  // add button that toggles state between 'asc' and 'desc'
  const button = <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>toggle sorting: {sort}</button>;

  const onAddNewCountry = () => {
    const value = uid();
    setLocalCountries([{ id: value, name: `A_${value}`, __typename: "country" }, ...localCountries]);
  };
  const addNewCountry = <button onClick={onAddNewCountry}>add new country</button>;
  return (
    <>
      <h3>List with id in "key"</h3>
      {button}
      {addNewCountry}
      {sortedCountries.map((country, index) => (
        <ItemMemo country={country} key={country.id} logPrefix="id" />
      ))}
    </>
  );
};
const ListItemsPaginatedWithIndex = ({ countries }: CountriesListProps) => {
  const [page, setPage] = useState(0);

  const pagedCountries = countries.slice(page * itemsPerPage, itemsPerPage * (page + 1));
  const pages = Array.from(Array(Math.ceil(countries.length / itemsPerPage)).keys());
  return (
    <>
      <h3>Paginated list with index as key</h3>
      <h4>Page: {page}</h4>
      <div className="flex gap-1">
        {pages.map((p) => (
          <button onClick={() => setPage(p)}>{p}</button>
        ))}
      </div>
      {pagedCountries.map((country, index) => (
        <ItemMemo country={country} logPrefix="index" key={index} />
      ))}
    </>
  );
};
const ListItemsPaginatedWithId = ({ countries }: CountriesListProps) => {
  const [page, setPage] = useState(0);

  const pagedCountries = countries.slice(page * itemsPerPage, itemsPerPage * (page + 1));
  const pages = Array.from(Array(Math.ceil(countries.length / itemsPerPage)).keys());
  return (
    <>
      <h3>Paginated list with id as key</h3>
      <h4>Page: {page}</h4>
      <div className="flex gap-1">
        {pages.map((p) => (
          <button onClick={() => setPage(p)}>{p}</button>
        ))}
      </div>
      {pagedCountries.map((country) => (
        <ItemMemo country={country} logPrefix="id" key={country.id} />
      ))}
    </>
  );
};
