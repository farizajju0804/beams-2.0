
import React from "react";

interface ArticleProps {
  articleUrl: string | undefined; // Adjust the type as per your data structure
}

const Article: React.FC<ArticleProps> = ({ articleUrl }) => (
  <div className="my-8 p-4 bg-gray-100 rounded-lg">
    <h2 className="text-2xl font-bold my-2">Article</h2>
    <p className="text-lg text-gray-800">{articleUrl}</p>
  </div>
);

export default Article;
