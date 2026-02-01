
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold text-gray-900 mt-10 mb-3 serif border-l-2 border-blue-600 pl-4 leading-tight">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b border-gray-100 pb-2 serif">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-extrabold text-gray-900 mt-12 mb-8 serif">{line.replace('# ', '')}</h1>;
      }
      
      // Horizontal Rule
      if (line.trim() === '---') {
        return <hr key={index} className="my-10 border-gray-100" />;
      }

      // Bold and Lists
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
        .replace(/^\- (.*)/, '<li class="ml-6 mb-3 text-gray-600">$1</li>');

      if (line.startsWith('- ')) {
        return <ul key={index} className="list-disc mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      }

      if (line.trim() === '') return <div key={index} className="h-2" />;

      return (
        <p 
          key={index} 
          className="text-gray-600 leading-relaxed mb-4 text-base font-light" 
          dangerouslySetInnerHTML={{ __html: formattedLine }} 
        />
      );
    });
  };

  return (
    <div className="prose prose-blue max-w-none">
      {parseMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;
