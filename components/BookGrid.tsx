
import React from 'react';
import { Book } from '../types';

interface BookGridProps {
  books: Book[];
}

const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`;
  
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="flex flex-col group animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] bg-gray-50">
        {!imgError ? (
          <img 
            src={coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <span className="text-blue-200 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <h4 className="font-bold text-gray-800 text-[9px] leading-tight mb-1">{book.title}</h4>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 mb-1">
            <span className="flex items-center text-[#eab308]">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <span className="text-[9px] font-bold text-gray-400 tracking-tight">
              {book.rating}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 leading-tight serif line-clamp-1 group-hover:text-blue-600 transition-colors">{book.title}</h3>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{book.author}</p>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 font-light">
          {book.summary}
        </p>
        <div className="pt-1 border-l border-gray-100 pl-3">
          <p className="text-[9px] italic text-gray-400 line-clamp-2">
            {book.reason}
          </p>
        </div>
      </div>
    </div>
  );
};

const BookGrid: React.FC<BookGridProps> = ({ books }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
      {books.map((book, idx) => (
        <BookCard key={idx} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
