import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';
import { useNavigate } from 'react-router-dom';
import {
  DownArrowIcon,
  PencilIcon,
  SortIcon,
  UpArrowIcon,
} from '~/icons/Icons';
import { timestampToDate } from '~/utils';
import EditPropertyModal from '@/components/Modals/EditPropertyModal';
import { Property } from '~/contracts';
import { ipc } from '~/constants/ipcEvents';
import { dbRef } from '~/constants/dbRefs';

interface OwnProps {
  cnmbr: string;
}

const SubTableProperties: React.FC<OwnProps> = ({ cnmbr }) => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    (async () => {
      window.electron.ipcRenderer.sendMessage(ipc.postPropertiesInfo, {
        cnmbr,
      });
      window.electron.ipcRenderer.once(
        ipc.postPropertiesInfo,
        (propertiesInfo) => {
          setTableData(propertiesInfo);
        },
      );
    })();
  }, [cnmbr]);

  const handleModalClose = () => {
    setSelectedId(null);
    setShowModal(false);

    if (shouldReload) {
      navigate(0);
    }
  };

  const handleAfterSubmit = (id: string) => {
    setShouldReload(true);
  };

  const handleModalOpen = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    setSelectedId(id);
    setShowModal(true);
  };

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: (d: Property) =>
          timestampToDate(
            d[dbRef.properties.p_input_date as keyof Property],
            'mmDDyyyy',
          ).date,
      },
      {
        Header: 'City',
        accessor: (d: Property) =>
          d[dbRef.properties.p_city as keyof Property] || 'N/A',
      },
      {
        Header: 'Street',
        accessor: (d: Property) =>
          d[dbRef.properties.p_street as keyof Property] || 'N/A',
      },
      {
        Header: 'Lot',
        accessor: (d: Property) =>
          d[dbRef.properties.p_lot as keyof Property] || 'N/A',
      },
      {
        Header: 'Condo',
        accessor: (d: Property) =>
          d[dbRef.properties.p_condo as keyof Property] !== 'null'
            ? d[dbRef.properties.p_condo as keyof Property]
            : 'N/A',
      },
      {
        Header: 'View / Edit',
        accessor: (d: Property) => d[dbRef.properties.id as keyof Property],
        Cell: ({ value }: { value: string }) => (
          <span
            title={`Edit Property: ${value}`}
            onClick={(e) => handleModalOpen(e, value)}
          >
            <PencilIcon />
          </span>
        ),
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

  return (
    <>
      <table className="is-sub-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, idx) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, idx) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
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
      {showModal ? (
        <EditPropertyModal
          handleModalClose={handleModalClose}
          showModal={showModal}
          title={''}
          selectedId={selectedId}
          handleAfterSubmit={handleAfterSubmit}
        />
      ) : null}
    </>
  );
};

export default SubTableProperties;
