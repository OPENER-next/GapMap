import { quartOut } from "svelte/easing";
import type { EasingFunction, TransitionConfig } from "svelte/transition";

export function customScale(
  node: HTMLElement,
  { delay = 0, duration = 400, easing = quartOut, startX = 1, startY = 1, opacity = 1 }: {delay?:number, duration?:number, easing?:EasingFunction, startX?:number, startY?:number, opacity?:number}
): TransitionConfig {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === 'none' ? '' : style.transform;
  const sdx = 1 - startX;
  const sdy = 1 - startY;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (_, u) => `
      transform: ${transform} scaleX(${1 - sdx * u}) scaleY(${1 - sdy * u});
      opacity: ${target_opacity - od * u}
    `
  };
}
