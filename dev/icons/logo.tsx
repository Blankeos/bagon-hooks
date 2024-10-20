import { FlowProps, JSX, mergeProps, ParentProps, VoidProps } from 'solid-js';

type LogoProps = {
  variant?: 'default' | 'inverted';
} & JSX.SvgSVGAttributes<SVGSVGElement>;

export default function Logo(props: VoidProps<LogoProps>) {
  const _props = mergeProps({ variant: 'default' }, props);

  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {..._props}
    >
      <g clip-path="url(#clip0_109_44)">
        <rect
          width="512"
          height="512"
          rx="256"
          fill={props.variant === 'default' ? '#60ACE6' : 'white'}
        />
        <path
          d="M208.175 168.26C208.175 141.607 229.811 120 256.5 120C283.189 120 304.825 141.607 304.825 168.26V306.854C304.825 333.507 283.189 355.114 256.5 355.114C229.811 355.114 208.175 333.507 208.175 306.854V168.26Z"
          fill={props.variant === 'default' ? 'white' : '#60ACE6'}
        />
        <path
          d="M80.9765 191.257L178.175 321.969C181.022 325.797 187.111 323.786 187.111 319.018V189.698C187.111 188.211 186.422 186.783 185.26 185.854C145.125 153.754 121.54 155.02 81.959 184.411C79.7881 186.023 79.3636 189.088 80.9765 191.257Z"
          fill={props.variant === 'default' ? 'white' : '#60ACE6'}
        />
        <path
          d="M432.023 190.73L334.825 321.442C331.978 325.271 325.889 323.26 325.889 318.491V189.172C325.889 187.685 326.578 186.257 327.74 185.328C367.875 153.228 391.46 154.493 431.041 183.884C433.212 185.496 433.636 188.561 432.023 190.73Z"
          fill={props.variant === 'default' ? 'white' : '#60ACE6'}
        />
        <path
          d="M138.786 386.05V327.941C138.786 323.853 143.467 321.527 146.732 323.994L223.657 382.103C227.448 384.966 225.42 391 220.667 391H143.742C141.005 391 138.786 388.784 138.786 386.05Z"
          fill={props.variant === 'default' ? 'white' : '#60ACE6'}
        />
        <path
          d="M379.171 386.05V327.941C379.171 323.853 374.489 321.527 371.224 323.994L294.299 382.103C290.509 384.966 292.537 391 297.289 391H374.214C376.951 391 379.171 388.784 379.171 386.05Z"
          fill={props.variant === 'default' ? 'white' : '#60ACE6'}
        />
      </g>
      <defs>
        <clipPath id="clip0_109_44">
          <rect width="512" height="512" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
