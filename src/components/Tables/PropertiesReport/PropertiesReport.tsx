/* eslint react/jsx-key: 0 */

import { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';
import { dbRef } from '~/constants/dbRefs';
import { Property } from '~/contracts';
import { timestampToDate } from '~/utils';
import styles from './PropertiesReport.module.scss';

interface OwnProps {
  tableData: Property[];
}

const ReportProperties: React.FC<OwnProps> = ({ tableData }) => {
  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Request Date',
        accessor: (d: Property) =>
          timestampToDate(
            d[dbRef.properties.p_input_date as keyof Property],
            'mmDDyyyy',
          ).date,
      },
      {
        Header: 'Address ( lot, st., city )',
        accessor: (d: Property) => `
          ${d[dbRef.properties.p_lot as keyof Property] + ', ' || ''} 
          ${d[dbRef.properties.p_street as keyof Property] + ', ' || ''} 
          ${d[dbRef.properties.p_city as keyof Property] || ''}`,
      },
      {
        Header: 'Ref No.',
        accessor: (d: Property) =>
          d[dbRef.properties.p_comp_ref as keyof Property] || '',
      },
      {
        Header: 'Given to examiner',
        accessor: (d: Property) =>
          `${d[dbRef.properties.p_assign as keyof Property] ? 'Yes' : 'No'}`,
      },
      {
        Header: 'Client',
        accessor: (d: Property) =>
          `(${d[dbRef.properties.p_number as keyof Property]}) ${
            d[dbRef.clients.c_name as keyof Property] || ''
          }`,
      },
      {
        Header: 'Type',
        accessor: (d: Property) => d[dbRef.properties.p_type as keyof Property],
      },
      {
        Header: 'Status',
        accessor: (d: Property) =>
          d[dbRef.properties.p_status as keyof Property],
      },
    ],
    [],
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
    <table
      id={styles['property-report']}
      {...getTableProps()}
      className="is-report-table"
    >
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

export default ReportProperties;
