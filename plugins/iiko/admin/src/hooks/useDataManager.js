import { useContext } from 'react';
import { DataManagerContext } from '../contexts';

const useDataManager = () => useContext(DataManagerContext);

export default useDataManager;