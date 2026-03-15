import { useState } from 'react';
import { StudioPlanner } from '@/components/StudioPlanner';
import type { PlannerState } from '@/types/planner';

export default function PlannerPage() {
  const [state, setState] = useState<PlannerState>({
    environment: 'house',
    subject: 'portrait',
    hdri: null,
    envExposure: 1.0,
    envYawDeg: 0,
    items: [],
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Plan 3D — Sélection et placement des outils</h1>
      <StudioPlanner state={state} onChange={setState} />
    </div>
  );
}
