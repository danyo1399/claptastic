export interface ClapState {
  claps: ClapModel[];
  clappers: ClapperModel[];
}

export interface ClapperModel {
  audioUrl: string | null;
  color: string;
}
export interface ContainerColor {
  id: string;
  color1: string;
  color2: string;
}
export interface ClapModel {
  lat?: number;
  long?: number;
  message?: string;
  _id?: string;
  _rev?: string;
}
