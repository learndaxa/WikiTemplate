import matter from "gray-matter";

export const getNavData = async (): Promise<
  Array<{ name: string; path: string }>
> => {
  const markdownFiles = import.meta.glob("/src/pages/**/*.md", { as: "raw" });

  const navData = await Promise.all(
    Object.entries(markdownFiles).map(async ([path, resolver]) => {
      const fileContent = await resolver();
      const { data } = matter(fileContent);

      let navPath = path.replace("/src/pages", "").replace(".md", "/");

      if (navPath.endsWith("index/")) navPath = navPath.slice(0, -6);

      return {
        name: data.title,
        path: navPath,
      };
    }),
  );

  return navData;
};
