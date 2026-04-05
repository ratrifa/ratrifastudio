export const ABOUT_SKILL_ICON_KEYS = ["code", "server", "palette", "users", "layers", "wrench", "sparkles", "globe", "database", "monitor", "smartphone", "terminal", "shield", "rocket", "brain", "briefcase"] as const;

export type AboutSkillIconKey = (typeof ABOUT_SKILL_ICON_KEYS)[number];

export const ABOUT_SKILL_ICON_DEFAULT: AboutSkillIconKey = ABOUT_SKILL_ICON_KEYS[0];

export const ABOUT_SKILL_ICON_OPTIONS: Array<{ value: AboutSkillIconKey; label: string }> = [
  { value: "code", label: "Code" },
  { value: "server", label: "Server" },
  { value: "palette", label: "Palette" },
  { value: "users", label: "Users" },
  { value: "layers", label: "Layers" },
  { value: "wrench", label: "Wrench" },
  { value: "sparkles", label: "Sparkles" },
  { value: "globe", label: "Globe" },
  { value: "database", label: "Database" },
  { value: "monitor", label: "Monitor" },
  { value: "smartphone", label: "Smartphone" },
  { value: "terminal", label: "Terminal" },
  { value: "shield", label: "Shield" },
  { value: "rocket", label: "Rocket" },
  { value: "brain", label: "Brain" },
  { value: "briefcase", label: "Briefcase" },
];

export function isAboutSkillIconKey(value: string): value is AboutSkillIconKey {
  return (ABOUT_SKILL_ICON_KEYS as readonly string[]).includes(value);
}
