import { useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';
import { dbRef } from '~/constants/dbRefs';
import { ipc } from '~/constants/ipcEvents';
import { useIsAdmin } from '~/context/AuthContext';
import { useFetchCityList } from '~/context/CitiesContext';
import { City, TableRefs } from '~/contracts';
import { PencilIcon, TrashIcon } from '~/icons/Icons';

interface OwnProps {
  tableData: any[];
  selectionType: TableRefs | '';
  tableClassName: string;
  setTableData: (tableData: City[]) => void;
  handleModalOpen: (
    e: React.SyntheticEvent,
    selectedRecordId: string,
    tableRef: TableRefs | '',
    formQueryType: 'insert' | 'update',
  ) => void;
}

const CitiesTable: React.FC<OwnProps> = ({
  tableData,
  selectionType,
  tableClassName,
  handleModalOpen,
  setTableData,
}) => {
  const isAdmin = useIsAdmin();
  const updateCitiesContext = useFetchCityList();

  const handleDelete = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();

    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await new Promise((resolve) => {
              window.electron.ipcRenderer.sendMessage(ipc.postDeleteCity, id);
              window.electron.ipcRenderer.once(
                ipc.postDeleteCity,
                ({ message, status }) => {
                  if (status === 'success') {
                    const filteredArray = tableData.filter(
                      (row) => row.id.toString() !== id.toString(),
                    );
                    setTableData(filteredArray);
                    updateCitiesContext();
                    toast[status](message, { id: 'delete-city' });
                  } else {
                    toast[status](message, { id: 'delete-city' });
                  }
                  resolve('');
                },
              );
            });
          },
        },
        {
          label: 'No',
          onClick: () =>
            toast.error('Operation Cancelled.', {
              id: 'delete-city',
            }),
        },
      ],
    });
  };

  const data = useMemo(() => tableData, [tableData]);
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: (d: City) => d[dbRef.cities.id as keyof City],
      },
      {
        Header: 'City',
        accessor: (d: City) => d[dbRef.cities.city as keyof City] || 'N/A',
      },
      {
        Header: 'County',
        accessor: (d: City) => d[dbRef.cities.county as keyof City] || 'N/A',
      },
      {
        Header: 'State',
        accessor: (d: City) =>
          d[dbRef.cities.state_abbrv as keyof City] || 'N/A',
      },
      {
        Header: 'View / Edit',
        accessor: (d: City) => d[dbRef.cities.id as keyof City],
        Cell: ({ value }: { value: any }) => (
          <span
            title={`Edit ${selectionType}: ${value}`}
            onClick={(e) => handleModalOpen(e, value, selectionType, 'update')}
          >
            <PencilIcon />
          </span>
        ),
      },
      {
        Header: 'Delete',
        accessor: (d: any) => d.id,
        Cell: ({ value }: { value: any }) =>
          isAdmin ? (
            <span
              title={`Delete Client: ${value}`}
              onClick={(e) => handleDelete(e, value)}
            >
              <TrashIcon />
            </span>
          ) : null,
      },
    ],
    [handleModalOpen, selectionType],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {},
      },
      useFilters,
    );

  return (
    <table className={`is-sub-table ${tableClassName}`} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, idx) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, idx) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, idx) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, idx) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CitiesTable;
