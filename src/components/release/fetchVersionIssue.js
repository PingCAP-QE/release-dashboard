
import { url } from "../../utils";
import { stringify } from "../issues/filter/FilterDialog";

export function fetchVersionIssue({ version, page = 1, perPage = 100, filters = [] }) {
  const queryString = `${filters
    .map((filter) => {
      const param = stringify(filter);
      if (param.length > 0) {
        return "&" + param;
      }
      return "";
    })
    .join("")}`;
  console.log(
    "fetchVersionIssue",
    url(`issue/cherrypick/${version}?page=${page}&per_page=${perPage}${queryString}`)
  );
  return fetch(url(`issue/cherrypick/${version}?page=${page}&per_page=${perPage}${queryString}`))
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
}
