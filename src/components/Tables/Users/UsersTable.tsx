import { useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';
import { dbRef } from '@/constants/dbRefs';
import { ipc } from '~/constants/ipcEvents';
import { TableRefs, User } from '~/contracts';
import { PencilIcon, TrashIcon } from '~/icons/Icons';

interface OwnProps {
  tableData: any[];
  selectionType: TableRefs | '';
  tableClassName: string;

  setTableData: (tableData: User[]) => void;

  handleModalOpen: (
    e: React.SyntheticEvent,
    selectedRecordId: string,
    tableRef: TableRefs | '',
    formQueryType: 'insert' | 'update',
  ) => void;
}

const UsersTable: React.FC<OwnProps> = ({
  tableData,
  selectionType,
  tableClassName,
  setTableData,
  handleModalOpen,
}) => {
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
              window.electron.ipcRenderer.sendMessage(ipc.postDeleteUser, {
                id,
                selectionType,
              });
              window.electron.ipcRenderer.once(
                ipc.postDeleteUser,
                ({ message, status }) => {
                  if (status === 'success') {
                    const filteredArray = tableData.filter(
                      (row) => row.id !== id,
                    );
                    setTableData(filteredArray);
                    toast[status](message, { id: 'delete-user' });
                  } else {
                    toast[status](message, { id: 'delete-user' });
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
              id: 'delete-user',
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
        accessor: (d: User) => d[dbRef.users.id as keyof User],
      },
      {
        Header: 'Username',
        accessor: (d: User) => d[dbRef.users.username as keyof User],
      },
      {
        Header: 'First Name',
        accessor: (d: User) => d[dbRef.users.f_name as keyof User],
      },
      {
        Header: 'Last Name',
        accessor: (d: User) => d[dbRef.users.l_name as keyof User],
      },
      {
        Header: 'is Admin',
        accessor: (d: User) => d[dbRef.users.is_admin as keyof User].toString(),
      },
      {
        Header: 'View / Edit',
        accessor: (d: User) => d[dbRef.users.id as keyof User],
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
        accessor: (d: any) => d[dbRef.users.id as keyof User],
        Cell: ({ value }: { value: any }) => (
          <span
            title={`Delete  ${selectionType}: ${value}`}
            onClick={(e) => handleDelete(e, value)}
          >
            <TrashIcon />
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

export default UsersTable;
