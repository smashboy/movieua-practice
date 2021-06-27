type DataLoaderPropsType = {
  isLoading: boolean;
  error?: Error;
};

const DataLoader: React.FC<DataLoaderPropsType> = ({
  children,
  isLoading,
  error,
}) => {
  return (
    <>
      {isLoading && <div>LOADING...</div>}
      {error && <div>FETCH ERROR</div>}
      {!isLoading && !error && children}
    </>
  );
};

export default DataLoader;
