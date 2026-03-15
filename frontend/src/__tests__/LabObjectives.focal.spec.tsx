import { render } from '@testing-library/react';
import LabObjectives from '../components/LabObjectives';

function makeCanvasRef(w = 320, h = 180) {
  const canvas = document.createElement('canvas') as HTMLCanvasElement & { getContext: any };
  canvas.width = w; canvas.height = h;
  // In jsdom, 2D context isn't implemented by default; return null so component skips analysis
  canvas.getContext = () => null;
  return { current: canvas } as React.RefObject<HTMLCanvasElement>;
}

describe('LabObjectives focal rules', () => {
  test('passes when focal is within range', () => {
    const onScoreChange = jest.fn();
    render(
      <LabObjectives
        objectives={['Respecter la focale']}
        rules={{ focal: { min: 35, max: 85 } }}
        lights={[] as any}
        settings={{ iso: 100, aperture: 5.6, shutter: 125, wbK: 5600, focalLength: 50 }}
        canvasRef={makeCanvasRef()}
        onScoreChange={onScoreChange}
      />
    );
    // Only one rule provided (focal), expect score 100
    expect(onScoreChange).toHaveBeenCalled();
  const last = onScoreChange.mock.calls[onScoreChange.mock.calls.length - 1][0];
    expect(last.score).toBe(100);
    expect(last.items.some((i: any) => i.key === 'Focale' && i.ok)).toBe(true);
  });

  test('fails when focal is outside range', () => {
    const onScoreChange = jest.fn();
    render(
      <LabObjectives
        objectives={['Respecter la focale']}
        rules={{ focal: { min: 50, max: 85 } }}
        lights={[] as any}
        settings={{ iso: 100, aperture: 5.6, shutter: 125, wbK: 5600, focalLength: 24 }}
        canvasRef={makeCanvasRef()}
        onScoreChange={onScoreChange}
      />
    );
    expect(onScoreChange).toHaveBeenCalled();
  const last = onScoreChange.mock.calls[onScoreChange.mock.calls.length - 1][0];
    expect(last.score).toBe(0);
    expect(last.items.some((i: any) => i.key === 'Focale' && !i.ok)).toBe(true);
  });

  test('target ± tolerance passes/fails correctly', () => {
    const onScoreChange = jest.fn();
    const rules = { focal: { target: 85, tol: 5 } } as const;

    // Pass at 90 (within ±5)
    render(
      <LabObjectives
        rules={rules}
        lights={[] as any}
        settings={{ iso: 100, aperture: 5.6, shutter: 125, wbK: 5600, focalLength: 90 }}
        canvasRef={makeCanvasRef()}
        onScoreChange={onScoreChange}
      />
    );
  let last = onScoreChange.mock.calls[onScoreChange.mock.calls.length - 1][0];
    expect(last.score).toBe(100);

    // Fail at 70 (outside tol)
    onScoreChange.mockClear();
    render(
      <LabObjectives
        rules={rules}
        lights={[] as any}
        settings={{ iso: 100, aperture: 5.6, shutter: 125, wbK: 5600, focalLength: 70 }}
        canvasRef={makeCanvasRef()}
        onScoreChange={onScoreChange}
      />
    );
  last = onScoreChange.mock.calls[onScoreChange.mock.calls.length - 1][0];
    expect(last.score).toBe(0);
  });
});
