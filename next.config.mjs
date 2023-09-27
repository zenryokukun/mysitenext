import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism';
import createMDX from "@next/mdx";

// .mdxパース用。ここで書かないとエラーになる、、
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-powershell.js";
import "prismjs/components/prism-docker.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-markdown.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This line is needed for docker.
  output: "standalone",
}

const withMDX = createMDX({
  options: {
    extension: /\.mdx?$/,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig);
