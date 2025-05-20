const STORAGE_KEY = "venueReviews";

export function getReviewsForVenue(venueId) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  return all[venueId] || [];
}

export function addReviewToVenue(venueId, review) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  all[venueId] = [...(all[venueId] || []), review];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
