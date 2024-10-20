import { JSX, VoidProps } from 'solid-js';

export default function IconX(props: VoidProps<JSX.SvgSVGAttributes<SVGSVGElement>>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z">
          <animate
            fill="freeze"
            attributeName="d"
            dur="0.4s"
            values="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5z"
          />
        </path>
        <path d="M3 2h5v0h-5zM16 22h5v0h-5z">
          <animate
            fill="freeze"
            attributeName="d"
            begin="0.4s"
            dur="0.4s"
            values="M3 2h5v0h-5zM16 22h5v0h-5z;M3 2h5v2h-5zM16 22h5v-2h-5z"
          />
        </path>
        <path d="M18.5 2h3.5L22 2h-3.5z">
          <animate
            fill="freeze"
            attributeName="d"
            begin="0.5s"
            dur="0.4s"
            values="M18.5 2h3.5L22 2h-3.5z;M18.5 2h3.5L5 22h-3.5z"
          />
        </path>
      </g>
    </svg>
  );
}
