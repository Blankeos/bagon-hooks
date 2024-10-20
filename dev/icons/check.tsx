import { JSX, VoidProps } from 'solid-js';

export default function Check(props: VoidProps<JSX.SvgSVGAttributes<SVGSVGElement>>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
        <path stroke-linejoin="round" d="m8.5 12.5l2 2l5-5" />
        <path d="M7 3.338A9.95 9.95 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5" />
      </g>
    </svg>
  );
}
