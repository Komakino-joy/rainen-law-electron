import React, { useState } from 'react';
import EditUserForm from '@/components/Forms/EditUserForm/EditUserForm';
import EditExaminerForm from '@/components/Forms/EditExaminerForm/EditExaminerForm';
import EditStatusCodeForm from '@/components/Forms/EditStatusCodeForm/EditStatusCodeForm';
import InfoCard from '@/components/InfoCard/InfoCard';
import Modal from '@/components/Modal/Modal';
import Spinner from '@/components/Spinner/Spinner';
import CitiesTable from '@/components/Tables/Cities/CitiesTable';
import DynamicTable from '@/components/Tables/Dynamic/DynamicTable';
import ExaminersTable from '@/components/Tables/Examiners/ExaminersTable';
import UsersTable from '@/components/Tables/Users/UsersTable';
import { useUsersContext } from '~/context/UsersContext';
import { useExaminersContext } from '~/context/ExaminersContext';
import { useSelectDropDownsContext } from '~/context/SelectDropDownsContext';
import {
  City,
  ClientStatus,
  Examiner,
  PropertyStatus,
  PropertyType,
  TableRefs,
  User,
} from '~/contracts';
import { PencilIcon, PlusCircleIcon } from '~/icons/Icons';
import styles from './ManagementCard.module.scss';

const ManageSelectionFieldsCard = () => {
  const { examinersList, isLoadingExaminerscontext } = useExaminersContext();
  const { usersList, isLoadingUserscontext } = useUsersContext();
  const {
    isLoadingSelectDropDownsContext,
    clientStatusList,
    propertyStatusList,
    propertyTypeList,
    allCitiesList,
  } = useSelectDropDownsContext();

  const isLoading =
    isLoadingExaminerscontext ||
    isLoadingUserscontext ||
    isLoadingSelectDropDownsContext;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectionType, setSelectionType] = useState<TableRefs | ''>('');
  const [queryType, setQueryType] = useState<'insert' | 'update'>('insert');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<
    | User[]
    | City[]
    | PropertyType[]
    | PropertyStatus[]
    | ClientStatus[]
    | Examiner[]
  >([]);

  const editableFields = [
    { label: 'Users', tableRef: 'users' },
    { label: 'Examiners', tableRef: 'examiners' },
    { label: 'Cities', tableRef: 'cities' },
    { label: 'Property Type', tableRef: 'pType' },
    { label: 'Property Status', tableRef: 'pStat' },
    { label: 'Client Status', tableRef: 'clientStat' },
  ];

  const handleEditButtonClick = (e: any, tableRef: TableRefs) => {
    e.preventDefault();
    switch (tableRef) {
      case 'users':
        setSelectionType('users');
        setTableData(usersList);
        break;
      case 'examiners':
        setSelectionType('examiners');
        setTableData(examinersList);
        break;
      case 'cities':
        setSelectionType('cities');
        setTableData(allCitiesList);
        break;
      case 'pType':
        setSelectionType('pType');
        setTableData(propertyTypeList);
        break;
      case 'pStat':
        setSelectionType('pStat');
        setTableData(propertyStatusList);
        break;
      case 'clientStat':
        setSelectionType('clientStat');
        setTableData(clientStatusList);
        break;
      default:
        break;
    }
  };

  const handleModalOpen = (
    e: React.SyntheticEvent,
    selectedRecordId: string,
    tableRef: TableRefs | '',
    formQueryType: 'insert' | 'update',
  ) => {
    e.preventDefault();

    setQueryType(formQueryType);
    setSelectedItemId(selectedRecordId);

    switch (tableRef) {
      case 'users':
        setSelectionType('users');
        break;
      case 'examiners':
        setSelectionType('examiners');
        break;
      case 'cities':
        setSelectionType('cities');
        break;
      case 'pType':
        setSelectionType('pType');
        break;
      case 'pStat':
        setSelectionType('pStat');
        break;
      case 'clientStat':
        setSelectionType('clientStat');
        break;
      default:
        break;
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedItemId(null);
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <div className="page-spinner">
        <Spinner />
      </div>
    );
  }

  const hasData = tableData.length > 0;

  const isExaminersTable = selectionType === 'examiners';
  const isUsersTable = selectionType === 'users';
  const isCitiesTable = selectionType === 'cities';
  const isDynamicTable =
    selectionType === 'pType' ||
    selectionType === 'pStat' ||
    selectionType === 'clientStat';

  return (
    <>
      <h3>Manage</h3>
      <div className={`light-border ${styles['card']}`}>
        <div className={styles['content']}>
          <section className={styles['edit-options-section']}>
            {editableFields.map((field) => (
              <div
                key={field.label}
                className={`
                  ${styles['edit-button']}
                  ${selectionType === field.tableRef ? styles.selected : ''}  
                `}
                onClick={(e) =>
                  handleEditButtonClick(e, field.tableRef as TableRefs)
                }
              >
                <span>{field.label}</span>
                <PencilIcon />
              </div>
            ))}
          </section>
          <section
            className={`
            ${styles['table-section']}
            ${hasData ? styles['has-data'] : ''}
          `}
          >
            <header>
              <span
                onClick={(e) => handleModalOpen(e, '', selectionType, 'insert')}
                className={styles['add-new-button']}
              >
                <PlusCircleIcon /> Add New
              </span>
              <span className={styles['table-title']}>
                {
                  editableFields.find(
                    (field) => field.tableRef === selectionType,
                  )?.label
                }
              </span>
            </header>
            {hasData && isDynamicTable ? (
              <div className={styles['table-container']}>
                <DynamicTable
                  tableData={tableData}
                  selectionType={selectionType}
                  tableClassName={styles[selectionType]}
                  setTableData={setTableData}
                  handleModalOpen={handleModalOpen}
                />
              </div>
            ) : hasData && isCitiesTable ? (
              <div className={styles['table-container']}>
                <CitiesTable
                  tableData={tableData}
                  selectionType={selectionType}
                  tableClassName={styles[selectionType]}
                  setTableData={setTableData}
                  handleModalOpen={handleModalOpen}
                />
              </div>
            ) : hasData && isExaminersTable ? (
              <div className={styles['table-container']}>
                <ExaminersTable
                  tableData={tableData}
                  selectionType={selectionType}
                  tableClassName={styles[selectionType]}
                  setTableData={setTableData}
                  handleModalOpen={handleModalOpen}
                />
              </div>
            ) : hasData && isUsersTable ? (
              <div className={styles['table-container']}>
                <UsersTable
                  tableData={tableData}
                  selectionType={selectionType}
                  tableClassName={styles[selectionType]}
                  setTableData={setTableData}
                  handleModalOpen={handleModalOpen}
                />
              </div>
            ) : (
              <InfoCard line1="Select a field to get started" />
            )}
          </section>
        </div>
      </div>
      <Modal onClose={handleModalClose} show={showModal} title={''}>
        {isDynamicTable && hasData ? (
          <EditStatusCodeForm
            tableData={tableData}
            setTableData={setTableData}
            selectionType={selectionType}
            selectedStatusCodeItemId={selectedItemId}
            queryType={queryType}
          />
        ) : null}
        {isExaminersTable && hasData ? (
          <EditExaminerForm
            tableData={tableData}
            setTableData={setTableData}
            selectedId={selectedItemId}
            queryType={queryType}
          />
        ) : null}
        {isUsersTable && hasData ? (
          <EditUserForm
            tableData={tableData}
            setTableData={setTableData}
            selectedId={selectedItemId}
            queryType={queryType}
          />
        ) : null}
      </Modal>
    </>
  );
};

export default ManageSelectionFieldsCard;
