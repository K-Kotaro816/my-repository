import type Konva from 'konva';

export function exportToPng(stage: Konva.Stage, projectName: string) {
  const dataUrl = stage.toDataURL({ pixelRatio: 2 });
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `${projectName}_${timestamp}.png`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
