import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';
import { dbRef } from '~/constants/dbRefs';
import { City, TableRefs } from '~/contracts';
import { PencilIcon } from '~/icons/Icons';

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
}) => {
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
