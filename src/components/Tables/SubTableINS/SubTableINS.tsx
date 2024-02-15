import Spinner from '@/components/Spinner/Spinner';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTable, useFilters, useSortBy } from 'react-table';
import { dbRef } from '~/constants/dbRefs';
import { ipc } from '~/constants/ipcEvents';
import { INSTitle } from '~/contracts';
import { DownArrowIcon, SortIcon, UpArrowIcon } from '~/icons/Icons';

type OwnProps = {
  inmbr: string;
  settitlescount: any;
};

const SubTableINS: React.FC<OwnProps> = ({ inmbr, settitlescount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        await new Promise((resolve) => {
          setIsLoading(true);
          window.electron.ipcRenderer.sendMessage(ipc.postInsTitlesInfo, {
            inmbr,
          });
          window.electron.ipcRenderer.once(
            ipc.postInsTitlesInfo,
            ({ titles, count, status, message }) => {
              if (status === 'success') {
                setTableData(titles);
                settitlescount(count);
              } else {
                toast[status](message, { id: 'post-ins-info' });
              }
              resolve('');
            },
          );
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [inmbr, settitlescount]);

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: (d: INSTitle) =>
          d[dbRef.insurance_titles.id as keyof INSTitle],
      },
      {
        Header: 'Street',
        accessor: (d: INSTitle) =>
          d[dbRef.insurance_titles.i_street as keyof INSTitle] || 'N/A',
      },
      {
        Header: 'City',
        accessor: (d: INSTitle) =>
          d[dbRef.insurance_titles.i_city as keyof INSTitle] || 'N/A',
      },
      {
        Header: 'Lot',
        accessor: (d: INSTitle) =>
          d[dbRef.insurance_titles.i_lot as keyof INSTitle] || 'N/A',
      },
      {
        Header: 'Condo',
        accessor: (d: INSTitle) =>
          d[dbRef.insurance_titles.i_condo as keyof INSTitle] || 'N/A',
      },
      {
        Header: 'Unit',
        accessor: (d: INSTitle) =>
          d[dbRef.insurance_titles.i_unit as keyof INSTitle] || 'N/A',
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
      useSortBy,
    );

  if (isLoading) return <Spinner smallSpinner />;

  return (
    <table className="is-sub-table" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, idx) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any, idx) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={
                  column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : ''
                }
              >
                <span>
                  {column.render('Header')}
                  {column.Header === 'Print' ||
                  column.Header === 'View / Edit' ? null : column.isSorted ? (
                    column.isSortedDesc ? (
                      <DownArrowIcon />
                    ) : (
                      <UpArrowIcon />
                    )
                  ) : (
                    <SortIcon />
                  )}
                </span>
              </th>
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

export default SubTableINS;
