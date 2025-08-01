import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
   compiler: {
    styledComponents: true,
  },
  // experimental:{
  //   ppr: 'incremental'
  // }
};

export default nextConfig;
