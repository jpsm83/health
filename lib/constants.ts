// Library Shared constants
// App Constants

export const mainCategories = [
  "health",
  "fitness",
  "nutrition",
  "intimacy",
  "beauty",
  "weight-loss",
  "life",
];

export const newsletterFrequencies = ["daily", "weekly", "monthly"];

export const roles = ["admin", "user"];

export const articleStatus = ["published", "archived"];

export const commentReportReasons = [
  "bad_language",
  "racist",
  "spam",
  "harassment",
  "inappropriate_content",
  "false_information",
  "other",
];

// Category-specific hero images
export const categoryHeroImages = {
  health:
    "https://res.cloudinary.com/jpsm83/image/upload/v1760114147/health/cmgka42a5k9po8gc9cxm.png",
  fitness:
    "https://res.cloudinary.com/jpsm83/image/upload/v1760117286/health/npjkyt26ta3docojirrb.png",
  nutrition:
    "https://res.cloudinary.com/jpsm83/image/upload/v1760115243/health/bpkjpqjipibnwqeuabmq.png",
  intimacy:
    "https://res.cloudinary.com/jpsm83/image/upload/v1760167913/health/v35vhnluyjpwab6qml2z.jpg",
  beauty:
    "https://res.cloudinary.com/jpsm83/image/upload/v1760116224/health/rgmecdllfqgaeborqkur.png",
  "weight-loss":
    "https://res.cloudinary.com/jpsm83/image/upload/v1760860863/health/cxcinavpch40pcxxfooo.jpg",
  life: "https://res.cloudinary.com/jpsm83/image/upload/v1760860888/health/oymcvrxmvggo547lsqau.jpg",
} as const;

export const affiliateCompanies = {
  amazon: {
    logo: "https://res.cloudinary.com/jpsm83/image/upload/v1763812333/health/banner/av1g80lt4qcbhdu4jdv7.png",
    baseUrl: "https://www.amazon.com",
    affiliateId: {
      US: "yourtag-us-20",
      CA: "yourtag-ca-20",
      GB: "yourtag-uk-20",
      IE: "yourtag-uk-20",
      FR: "yourtag-fr-20",
      ES: "yourtag-es-20",
      PT: "yourtag-es-20",
      IT: "yourtag-it-20",
      DE: "yourtag-de-20",
    },
  },
} as const;

// fitness & weight-loss banners are the same
export const banners = {
  intimacy: {
    "970x90":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897717/health/banner/Intimacy/ldruxotuvbw2r8gxjg14.png",
    "970x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897720/health/banner/Intimacy/nxmegjvtrcdqv7myvn1z.png",
    "240x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897715/health/banner/Intimacy/yoexlngtgmuwmm8zzzrz.png",
    "240x390":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897716/health/banner/Intimacy/mkwgzpe2vr1usmpbhl4w.png",
    "390x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897718/health/banner/Intimacy/j9utzkcmt3pay6gubxxu.png",
  },
  beauty: {
    "970x90":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897768/health/banner/Beauty/uuta8kqzxbhtwqm7xnrq.png",
    "970x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897770/health/banner/Beauty/gc7eeaoox5z9qj6g8zli.png",
    "240x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897773/health/banner/Beauty/p553qkbpb8zruoow00yv.png",
    "240x390":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897769/health/banner/Beauty/u07umpmvaussb6wd2hzl.png",
    "390x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897772/health/banner/Beauty/ddut8h3sknjqeipvuezw.png",
  },
  fitness: {
    "970x90":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897539/health/banner/Fitness%20-%20Weight%20Loss/jmgldopkkkb7bjtaiyfg.png",
    "970x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897537/health/banner/Fitness%20-%20Weight%20Loss/gmoxlyvqgu96ztiyzuqm.png",
    "240x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897538/health/banner/Fitness%20-%20Weight%20Loss/lpco2rdyvm3ahwx3ozmr.png",
    "240x390":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897537/health/banner/Fitness%20-%20Weight%20Loss/s8umawzfosn7q9iugh8l.png",
    "390x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897537/health/banner/Fitness%20-%20Weight%20Loss/jfjolm365nlzcebihkds.png",
  },
  "weight-loss": {
    "970x90":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897539/health/banner/Fitness%20-%20Weight%20Loss/jmgldopkkkb7bjtaiyfg.png",
    "970x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897537/health/banner/Fitness%20-%20Weight%20Loss/gmoxlyvqgu96ztiyzuqm.png",
    "240x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897538/health/banner/Fitness%20-%20Weight%20Loss/lpco2rdyvm3ahwx3ozmr.png",
    "240x390":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897537/health/banner/Fitness%20-%20Weight%20Loss/s8umawzfosn7q9iugh8l.png",
    "390x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897537/health/banner/Fitness%20-%20Weight%20Loss/jfjolm365nlzcebihkds.png",
  },
  health: {
    "970x90":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897591/health/banner/Health/xic3cbbz4htmacunggop.png",
    "970x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897592/health/banner/Health/xigwwijg9ajsw6xf0fpk.png",
    "240x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897594/health/banner/Health/setdppbwkixhteqna3oq.png",
    "240x390":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897591/health/banner/Health/j5un5acfewduqenismpa.png",
    "390x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897593/health/banner/Health/sjpv3r31o8fnkmjkfefi.png",
  },
  life: {
    "970x90":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897847/health/banner/Life%20-%20Default/zoznlgigswjrkmpjwh95.png",
    "970x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897846/health/banner/Life%20-%20Default/qwpbttgrgdrrhrryznna.png",
    "240x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897844/health/banner/Life%20-%20Default/xymmq3e4ww6c9lafclsc.png",
    "240x390":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897843/health/banner/Life%20-%20Default/vpiv4q7bftfhn5hxtiho.png",
    "390x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897842/health/banner/Life%20-%20Default/nez0tukgu4ibgn1sqigw.png",
  },
  nutrition: {
    "970x90":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897642/health/banner/Nutritiun/in7bechptaixfc9p8n3q.png",
    "970x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897640/health/banner/Nutritiun/seqnavgkvaebpslpxzer.png",
    "240x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897641/health/banner/Nutritiun/fsrcf3yhfzf8jjmjvcdj.png",
    "240x390":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897638/health/banner/Nutritiun/x2u6kihx4gmkgdjy4fcq.png",
    "390x240":
      "https://res.cloudinary.com/jpsm83/image/upload/v1763897639/health/banner/Nutritiun/ndsvopb5e0mri86ircee.png",
  },
} as const;
