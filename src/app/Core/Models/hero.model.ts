export type HeroUniverse = "DC" | "Marvel";

export interface Hero {
    id: number,
    name: string,
    power: string,
    universe: HeroUniverse,
    image: string,
    antagonist: string
}

export type HeroFormModel = Omit<Hero, 'id'>;

export const EMPTY_HERO_FORM: HeroFormModel = {
  name: '',
  power: '',
  universe: 'Marvel',
  image: '',
  antagonist: '',
};