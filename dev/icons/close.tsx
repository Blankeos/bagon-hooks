import { JSX, VoidProps } from 'solid-js';

export default function Code(props: VoidProps<JSX.SvgSVGAttributes<SVGSVGElement>>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z"
      />
    </svg>
  );
}
