import { useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import toast from 'react-hot-toast';
import { useTable, useFilters } from 'react-table';
import { ipc } from '~/constants/ipcEvents';
import { useIsAdmin } from '~/context/AuthContext';
import { useFetchExaminerList } from '~/context/ExaminersContext';
import { dbRef } from '~/constants/dbRefs';
import { Examiner, TableRefs } from '~/contracts';
import { PencilIcon, TrashIcon } from '~/icons/Icons';

interface OwnProps {
  tableData: any[];
  selectionType: TableRefs | '';
  tableClassName: string;
  setTableData: (tableData: Examiner[]) => void;
  handleModalOpen: (
    e: React.SyntheticEvent,
    selectedRecordId: string,
    tableRef: TableRefs | '',
    formQueryType: 'insert' | 'update',
  ) => void;
}

const ExaminersTable: React.FC<OwnProps> = ({
  tableData,
  selectionType,
  tableClassName,
  handleModalOpen,
  setTableData,
}) => {
  const isAdmin = useIsAdmin();
  const updateExaminersContext = useFetchExaminerList();

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
              window.electron.ipcRenderer.sendMessage(
                ipc.postDeleteExaminer,
                id,
              );
              window.electron.ipcRenderer.once(
                ipc.postDeleteExaminer,
                ({ message, status }) => {
                  if (status === 'success') {
                    const filteredArray = tableData.filter(
                      (row) => row.id.toString() !== id.toString(),
                    );
                    setTableData(filteredArray);
                    updateExaminersContext();
                    resolve(toast[status](message, { id: 'delete-examiner' }));
                  } else {
                    resolve(toast[status](message, { id: 'delete-examiner' }));
                  }
                },
              );
            });
          },
        },
        {
          label: 'No',
          onClick: () =>
            toast.error('Operation Cancelled.', {
              id: 'delete-examiner',
            }),
        },
      ],
    });
  };

  const data = useMemo(
    () => tableData.filter((entry) => entry.name != null),
    [tableData],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: (d: Examiner) => d[dbRef.examiners.id as keyof Examiner],
      },
      {
        Header: 'Name',
        accessor: (d: Examiner) =>
          d[dbRef.examiners.name as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Code',
        accessor: (d: Examiner) =>
          d[dbRef.examiners.code as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Type',
        accessor: (d: Examiner) =>
          d[dbRef.examiners.type as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Compensation',
        accessor: (d: Examiner) =>
          d[dbRef.examiners.compensate as keyof Examiner] || 'N/A',
      },
      {
        Header: 'Is Active ?',
        accessor: (d: Examiner) =>
          d[dbRef.examiners.is_active as keyof Examiner].toString() || 'N/A',
      },
      {
        Header: 'View / Edit',
        accessor: (d: Examiner) => d[dbRef.examiners.id as keyof Examiner],
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

export default ExaminersTable;
