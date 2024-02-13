import ClientSearchForm from '@/components/Forms/SearchClientForm/ClientSearchForm';
import { useClientsContext } from '@/context/ClientsContext';
import Spinner from '@/components/Spinner/Spinner';

const SearchClientsPage = () => {
  const { isLoadingClientsContext } = useClientsContext();
  const isLoading = isLoadingClientsContext;

  return (
    <div className="search-page center-margin">
      {/* {isLoading ? (
        <Spinner containerClassName="page-spinner" />
      ) : (
        <ClientSearchForm />
      )} */}
      <ClientSearchForm />
    </div>
  );
};

export default SearchClientsPage;
