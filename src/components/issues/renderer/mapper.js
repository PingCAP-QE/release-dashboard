export function mapPickStatusToBackend(pick) {
  return {
    unknown: "UnKnown",
    approved: "Accept",
    later: "Later",
    "won't fix": "Won't Fix",
    "approved(frozen)": "Accept"
  }[pick]
}

export function mapPickStatusToFrontend(pick) {
  pick = pick.toLocaleLowerCase();
  pick = {
    accept: "approved",
    unknown: "unknown",
    later: "later",
    "won't fix": "won't fix",
    "accept(frozen)": "approved(frozen)",
    "released": "released"
  }[pick]
  return pick
}
