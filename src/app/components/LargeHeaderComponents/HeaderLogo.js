import React from 'react';
import Link from 'next/link'

const HeaderLogo = () => {
  return (
    <Link href={'/'} className="flex items-center gap-1">
    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.71 98.46" className="w-10 h-10">
      <g id="Layer_1-2" data-name="Layer 1">
        <g>
          <path  d="M62.61,86.54c9.47-28.02,9.47-58.52,0-86.54v86.54Z" />
          <path  d="M7.1,98.43c-9.47-28.02-9.47-58.52,0-86.54v86.54Z" />
          <polygon  points="33.89 54.73 59.39 87.2 59.39 .6 33.89 33.08 42.39 43.9 33.89 54.73" />
          <polygon  points="10.92 98.46 36.42 65.99 27.92 55.16 36.42 44.34 10.92 11.86 10.92 98.46" />
        </g>
      </g>
    </svg>
    {/* <span className="font-bold text-2xl">kubi</span> */}
  </Link>
  );
};

export default HeaderLogo;
