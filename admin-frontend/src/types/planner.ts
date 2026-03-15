export type ToolType =
  | 'camera'
  | 'tripod'
  | 'softbox'
  | 'umbrella'
  | 'reflector'
  | 'continuous_light'
  | 'speedlight'
  | 'c_stand'
  | 'backdrop_stand'
  | 'light_meter';

export interface PlannerItemBase {
  id: string;
  type: ToolType | 'subject';
  name?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  params?: Record<string, any>;
}

export type SubjectType = 'portrait' | 'person' | 'group';

export type EnvironmentPreset = 'sea' | 'grass' | 'nature' | 'house';

export interface PlannerState {
  environment: EnvironmentPreset;
  subject: SubjectType;
  // Optional HDRI filename from /assets/hdri; when set it overrides environment preset background
  hdri?: string | null;
  // Environment controls
  envExposure?: number; // tone mapping exposure multiplier (default 1.0)
  envYawDeg?: number; // rotation around Y in degrees for Sky fallback
  items: PlannerItemBase[];
}
