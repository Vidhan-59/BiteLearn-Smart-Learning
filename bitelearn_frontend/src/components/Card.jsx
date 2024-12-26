export const Card = ({ children }) => (
    <div className="border border-gray-300 rounded-lg p-6 shadow-sm">
      {children}
    </div>
  );
  
  export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
  
  export const CardTitle = ({ children }) => <h3 className="text-xl font-bold">{children}</h3>;
  
  export const CardDescription = ({ children }) => <p className="text-gray-600">{children}</p>;
  
  export const CardContent = ({ children }) => <div>{children}</div>;
  
  export const CardFooter = ({ children }) => <div className="mt-4">{children}</div>;
  