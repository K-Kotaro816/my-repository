import type { FurnitureItem } from '../types/project';

export interface Vec2 {
  x: number;
  y: number;
}

export interface OBB {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
  angle: number;
}

export function furnitureToOBB(item: FurnitureItem): OBB {
  return {
    cx: item.x,
    cy: item.y,
    hw: item.widthMm / 2,
    hh: item.heightMm / 2,
    angle: (item.rotation * Math.PI) / 180,
  };
}

export function checkCollision(a: OBB, b: OBB): boolean {
  const cosA = Math.cos(a.angle);
  const sinA = Math.sin(a.angle);
  const cosB = Math.cos(b.angle);
  const sinB = Math.sin(b.angle);

  const axesX = [cosA, sinA, cosB, sinB];
  const axesY = [-sinA, cosA, -sinB, cosB];

  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;

  for (let i = 0; i < 4; i++) {
    const nx = axesX[i];
    const ny = axesY[i];

    const radiusA =
      a.hw * Math.abs(cosA * nx + sinA * ny) + a.hh * Math.abs(-sinA * nx + cosA * ny);

    const radiusB =
      b.hw * Math.abs(cosB * nx + sinB * ny) + b.hh * Math.abs(-sinB * nx + cosB * ny);

    const dist = Math.abs(dx * nx + dy * ny);

    if (dist > radiusA + radiusB) {
      return false;
    }
  }

  return true;
}

export function detectCollisionsForItem(item: FurnitureItem, others: FurnitureItem[]): Set<string> {
  const collidingIds = new Set<string>();
  const a = furnitureToOBB(item);

  for (const other of others) {
    if (other.id === item.id) continue;
    if (checkCollision(a, furnitureToOBB(other))) {
      collidingIds.add(item.id);
      collidingIds.add(other.id);
    }
  }

  return collidingIds;
}

export function detectAllCollisions(items: FurnitureItem[]): Set<string> {
  const collidingIds = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = furnitureToOBB(items[i]);
      const b = furnitureToOBB(items[j]);
      if (checkCollision(a, b)) {
        collidingIds.add(items[i].id);
        collidingIds.add(items[j].id);
      }
    }
  }

  return collidingIds;
}
