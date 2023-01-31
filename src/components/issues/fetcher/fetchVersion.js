import { url, map2Query } from "../../../utils";

export function fetchMaintainedVersions() {
  return fetch(url("version/maintained")).then(async (res) => {
    const data = await res.json();
    let { data: versions } = data;
    versions.sort();
    versions.reverse();
    return versions || [];
  });
}

export async function fetchActiveVersions({ page = 1, perPage = 100, versionName }) {
  // Judge the condition here cause the useQuery function must on top level of Parent function.
  if (versionName == "none") {
    return {}
  }

  var versionOption = composeVersionOption(versionName)
  return fetchVersionByOption({ page: page, perPage: perPage, option: versionOption })
    .then(async (data) => {
      let { data: versions } = data;
      versions.sort(
        (a, b) => {
          return a > b ? -1 : 1;
        }
      );
      return versions || []
    });
}

export async function fetchVersionByOption({ page = 1, perPage = 100, option = {} }) {
  var queryString = map2Query(option)
  if (queryString !== undefined && queryString !== "") {
    queryString = "&" + queryString
  }

  console.log(
    "fetchVersionWithOption",
    url(`version?page=${page}&per_page=${perPage}${queryString}`)
  );
  try {
    const res = await fetch(url(`version?page=${page}&per_page=${perPage}&${queryString}`));
    const data = await res.json();
    return await data;
  } catch (e) {
    console.log(e);
  }
}

const PATCH_PATTERN = /\d+\.\d+\.\d+/
const MINOR_PATTERN = /\d+\.\d+/

function composeVersionOption(version) {
  var option = {}

  if (version == undefined || version == "") {
    option["status_list"] = ["upcoming", "frozen"]
    return option
  }

  const versionItems = version.split(".")
  option["major"] = versionItems[0]
  option["minor"] = versionItems[1]

  if (PATCH_PATTERN.exec(version)) {
    option["short_type"] = "%d.%d.%d"
    option["patch"] = versionItems[2]
  } else if (MINOR_PATTERN.exec(version)) {
    option["short_type"] = "%d.%d"
    option["status_list"] = ["upcoming", "frozen"]
  }

  option["order_by"] = ["update_time"]

  return option
}
