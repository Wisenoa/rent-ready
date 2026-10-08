export type B2ViewMode =
  // 5 Heroes Desktop
  | "hero_01_1440"
  | "hero_02_1440"
  | "hero_03_1440"
  | "hero_04_1440"
  | "hero_05_1440"
  // 5 Heroes Mobile
  | "hero_01_390"
  | "hero_02_390"
  | "hero_03_390"
  | "hero_04_390"
  | "hero_05_390"
  // 3 Full Homepages Desktop & Mobile
  | "homepage_a_1440"
  | "homepage_a_390"
  | "homepage_b_1440"
  | "homepage_b_390"
  | "homepage_c_1440"
  | "homepage_c_390"
  // Stress & Demo
  | "homepage_selected_360"
  | "product_demo_before"
  | "product_demo_attention"
  | "product_demo_resolved";

export type HeroStrategy = "category" | "outcome" | "exception" | "product" | "hybrid";
export type ArchitectureType = "a" | "b" | "c";
export type DemoState = "before" | "attention" | "resolved";
