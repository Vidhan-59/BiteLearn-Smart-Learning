export function Avatar({ children, className }) {
    return (
      <div className={`rounded-full bg-gray-200 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function AvatarImage({ src, alt }) {
    return (
      <img className="rounded-full w-full h-full object-cover" src={src} alt={alt} />
    );
  }
  
  export function AvatarFallback({ children }) {
    return <span className="text-lg font-bold">{children}</span>;
  }
  