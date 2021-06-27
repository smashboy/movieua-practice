const DiscoverGrid: React.FC = ({ children }) => {
  return (
    <div className="w-full mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
      {children}
    </div>
  );
};

export default DiscoverGrid;
