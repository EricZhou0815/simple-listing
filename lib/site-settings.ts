export type SiteSettings = {
  pageTitle: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
};

export const defaultSiteSettings: SiteSettings = {
  pageTitle: "Simple Listing",
  heroBadge: "Secondhand marketplace",
  heroTitle: "Clean, modern listings for secondhand items",
  heroDescription:
    "Buyers can browse items and open detailed pages. Admin can log in on the admin page to add, edit, and manage listings."
};
