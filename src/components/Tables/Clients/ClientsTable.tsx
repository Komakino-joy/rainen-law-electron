import React, { useMemo, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';
import { useTable, useFilters, useSortBy } from 'react-table';
import InfoCard from '@/components/InfoCard/InfoCard';
import PrintClientLabelMultiple from '@/components/PrintClientLabelMultiple/PrintClientLabelMultiple';
import { useIsAdmin } from '~/context/AuthContext';
import { Client, ModalType } from '~/contracts';
import { ipc } from '~/constants/ipcEvents';
import {
  DownArrowIcon,
  PencilIcon,
  SortIcon,
  TrashIcon,
  UpArrowIcon,
} from '~/icons/Icons';

import './ClientsTable.scss';
import { dbRef } from '~/constants/dbRefs';

interface OwnProps {
  tableData: any;
  handleModalOpen: (
    e: React.SyntheticEvent,
    id: string,
    type: ModalType,
  ) => void;
  setTableData: (tableData: Client[]) => void;
  hiddenColumns?: string[];
  isHomePreviewTable?: boolean;
}

const ClientsTable: React.FC<OwnProps> = ({
  handleModalOpen,
  hiddenColumns = [''],
  isHomePreviewTable,
  setTableData,
  tableData,
}) => {
  const isAdmin = useIsAdmin();
  const [labelsToPrint, setLabelsToPrint] = useState<Client[]>([]);

  const handleDelete = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();

    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            window.electron.ipcRenderer.sendMessage(ipc.postDeleteClient);
            window.electron.ipcRenderer.once(
              ipc.postDeleteClient,
              (response) => {
                if (response.status === 'success') {
                  toast.success(response.message, { id: 'delete-client' });
                  const filteredArray = tableData.filter(
                    (row: Client) => row.id.toString() !== id,
                  );
                  setTableData(filteredArray);
                }
                if (response.status === 'error') {
                  toast.error(response.message, { id: 'delete-client' });
                }
              },
            );
          },
        },
        {
          label: 'No',
          onClick: () =>
            toast.error('Operation Cancelled.', {
              id: 'delete-client',
            }),
        },
      ],
    });
  };

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Client#',
        accessor: (d: Client) => d[dbRef.clients.c_number as keyof Client],
      },
      {
        Header: 'Client Name',
        accessor: (d: Client) => d[dbRef.clients.c_name as keyof Client],
      },
      {
        Header: 'Address',
        accessor: (d: Client) => `
          ${d[dbRef.clients.c_address_1 as keyof Client]} 
          ${
            d[dbRef.clients.c_address_2 as keyof Client]
              ? d[dbRef.clients.c_address_2 as keyof Client]
              : ''
          }
        `,
      },
      {
        Header: 'City',
        accessor: (d: Client) =>
          d[dbRef.clients.c_city as keyof Client] || 'N/A',
      },
      {
        Header: 'State',
        accessor: (d: Client) =>
          d[dbRef.clients.c_state as keyof Client] || 'N/A',
      },
      {
        Header: 'Zip',
        accessor: (d: Client) =>
          d[dbRef.clients.c_zip as keyof Client] || 'N/A',
      },
      {
        Header: 'Phone',
        accessor: (d: Client) =>
          d[dbRef.clients.c_phone as keyof Client] || 'N/A',
      },
      {
        Header: 'Fax',
        accessor: (d: Client) =>
          d[dbRef.clients.c_fax as keyof Client] || 'N/A',
      },
      {
        Header: 'Properties',
        accessor: (d: Client) => d.propcount || 'N/A',
      },
      {
        Header: 'Titles',
        accessor: (d: Client) => d.titlescount || 'N/A',
      },
      {
        Header: 'Print',
        accessor: (d: Client) => d,
        Cell: ({ value }: { value: Client }) => (
          <input
            name={`client-${value.id}`}
            type="checkbox"
            onClick={(e) => {
              const ischecked = (e.target as HTMLInputElement).checked;
              if (ischecked) {
                setLabelsToPrint((prevState) => {
                  const updatedArray = [...prevState, value];
                  return updatedArray;
                });
              } else {
                setLabelsToPrint((prevState) => {
                  const filteredArray = prevState.filter(
                    (client) => client.id !== value.id,
                  );
                  return filteredArray;
                });
              }
            }}
          />
        ),
      },
      {
        Header: 'View / Edit',
        accessor: (d: any) => d[dbRef.clients.id as keyof Client],
        Cell: ({ value }: { value: any }) => (
          <span
            title={`Edit Client: ${value}`}
            onClick={(e) => handleModalOpen(e, value, 'client')}
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
    [handleModalOpen, isAdmin],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          hiddenColumns,
        },
      },
      useFilters,
      useSortBy,
    );

  const buttonContainerClassName = isHomePreviewTable
    ? 'home-preview-button-container'
    : 'button-container';

  if (tableData.length === 0) {
    return (
      <InfoCard line1="No Records Found" customStyles={{ width: '80vw' }} />
    );
  }

  return (
    <div className="container">
      {labelsToPrint.length > 0 && (
        <div className={buttonContainerClassName}>
          <PrintClientLabelMultiple clients={labelsToPrint}>
            {`Print ${labelsToPrint.length} ${
              labelsToPrint.length === 1 ? 'Label' : 'Labels'
            }`}
          </PrintClientLabelMultiple>
        </div>
      )}
      <table className="is-all-clients-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, idx) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, idx) => (
                <th
                  {...column.getHeaderProps(
                    !isHomePreviewTable
                      ? column.getSortByToggleProps()
                      : undefined,
                  )}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? 'desc'
                        : 'asc'
                      : ''
                  }
                >
                  <span>
                    {column.render('Header')}
                    {column.Header === 'Print' ||
                    column.Header === 'View / Edit' ||
                    isHomePreviewTable ? null : column.isSorted ? (
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
    </div>
  );
};

export default ClientsTable;
