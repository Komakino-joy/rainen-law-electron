import PropertySearchForm from '@/components/Forms/SearchPropertyForm/PropertySearchForm';
import Spinner from '@/components/Spinner/Spinner';
import { useClientsContext } from '@/context/ClientsContext';
import { usePropertiesContext } from '@/context/PropertiesContext';

const SearchPropertiesPage = () => {
  const { isLoadingClientsContext } = useClientsContext();
  const { isLoadingPropertyContext } = usePropertiesContext();
  const isLoading = isLoadingClientsContext || isLoadingPropertyContext;

  return (
    <div className="search-page center-margin">
      {isLoading ? (
        <Spinner containerClassName="page-spinner" />
      ) : (
        <PropertySearchForm />
      )}
    </div>
  );
};

export default SearchPropertiesPage;
