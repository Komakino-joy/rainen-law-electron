import Spinner from '@/components/Spinner/Spinner';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';
import { dbRef } from '~/constants/dbRefs';
import { ipc } from '~/constants/ipcEvents';
import { BuyerSeller } from '~/contracts';
import { DownArrowIcon, UpArrowIcon, SortIcon } from '~/icons/Icons';

interface OwnProps {
  compRef: string;
}

const SubTableSellerBuyer: React.FC<OwnProps> = ({ compRef }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(
            ipc.postBuyerSellerInfo,
            compRef,
          );
          window.electron.ipcRenderer.once(
            ipc.postBuyerSellerInfo,
            ({ buyerSellerInfo, status, message }) => {
              if (status === 'success') {
                setTableData(buyerSellerInfo);
                resolve('');
              } else {
                resolve(toast[status](message, { id: 'post-buyer-seller' }));
              }
            },
          );
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [compRef]);

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Seller 1',
        accessor: (d: BuyerSeller) =>
          d[dbRef.buyer_seller.seller_1 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Seller 2',
        accessor: (d: BuyerSeller) =>
          d[dbRef.buyer_seller.seller_2 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Seller 3',
        accessor: (d: BuyerSeller) =>
          d[dbRef.buyer_seller.seller_3 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Seller 4',
        accessor: (d: BuyerSeller) =>
          d[dbRef.buyer_seller.seller_4 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Buyer 1',
        accessor: (d: BuyerSeller) =>
          d[dbRef.buyer_seller.buyer_1 as keyof BuyerSeller] || 'N/A',
      },
      {
        Header: 'Buyer 2',
        accessor: (d: BuyerSeller) =>
          d[dbRef.buyer_seller.buyer_2 as keyof BuyerSeller] || 'N/A',
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

  if (isLoading) return <Spinner smallSpinner />;

  return (
    <table className="is-sub-table" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, idx) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any, idx) => (
              <th {...column.getHeaderProps()}>
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

export default SubTableSellerBuyer;
