// Library Shared constants
// App Constants

export const mainCategories = [
  "health",
  "fitness",
  "nutrition",
  "intimacy",
  "beauty",
  "travel",
  "decor",
];

// [
//   "w-health", "w-fitness", "w-nutrition", "w-intimacy", "w-beauty", "m-health", "m-fitness", "m-nutrition", "m-body-care", "travel", "decor", "finance", "procuctivity", "crypto", "gaming", "technology"
// ];

export const newsletterFrequencies = ["daily", "weekly", "monthly"];

export const roles = ["admin", "user"];

export const articleStatus = ["published", "archived"];

export const commentReportReasons = ["bad_language", "racist", "spam", "harassment", "inappropriate_content", "false_information", "other"];

// Category-specific hero images
export const categoryHeroImages = {
  health: "https://res.cloudinary.com/jpsm83/image/upload/v1760114147/health/cmgka42a5k9po8gc9cxm.png",
  fitness: "https://res.cloudinary.com/jpsm83/image/upload/v1760117286/health/npjkyt26ta3docojirrb.png",
  nutrition: "https://res.cloudinary.com/jpsm83/image/upload/v1760115243/health/bpkjpqjipibnwqeuabmq.png",
  intimacy: "https://res.cloudinary.com/jpsm83/image/upload/v1760117180/health/de0t4nitub8oii3rx3y3.png",
  beauty: "https://res.cloudinary.com/jpsm83/image/upload/v1760116224/health/rgmecdllfqgaeborqkur.png",
  travel: "https://res.cloudinary.com/jpsm83/image/upload/v1760116873/health/aa6zfbah9gfrohndeuho.png",
  decor: "https://res.cloudinary.com/jpsm83/image/upload/v1760117053/health/ioitn3pi25md4ocmcca6.png",
} as const;
