import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '@/components/Button/Button';
import Spinner from '@/components/Spinner/Spinner';
import { useFetchSelectDropDownList } from '~/context/SelectDropDownsContext';
import { TableRefs } from '~/contracts';
import { FORM_BUTTON_TEXT } from '~/constants';
import { ipc } from '~/constants/ipcEvents';
import FormInput from '../FormInput/FormInput';
import 'react-tabs/style/react-tabs.css';

interface EditStatusCodeFormProps {
  tableData: any[];
  setTableData: any;
  selectionType: TableRefs | '';
  selectedStatusCodeItemId: string | null;
  queryType: 'update' | 'insert';
}

const EditStatusCodeForm: React.FC<EditStatusCodeFormProps> = ({
  tableData,
  setTableData,
  selectionType,
  selectedStatusCodeItemId,
  queryType,
}) => {
  const fetchUpdatedDropDownList = useFetchSelectDropDownList();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusCodeId, setStatusCodeId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm({
    defaultValues: async () => {
      if (selectedStatusCodeItemId) {
        setIsLoading(true);

        return await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(
            ipc.postSelectedDropDownOption,
            {
              id: selectedStatusCodeItemId,
              selectionType,
            },
          );
          window.electron.ipcRenderer.once(
            ipc.postSelectedDropDownOption,
            (statusCodeInfo) => {
              const {
                id,
                status_code = null,
                status_desc = null,
                type_code = null,
                type_desc = null,
                code: county_code = null,
                county: county_name = null,
              } = statusCodeInfo;

              setStatusCodeId(id);

              setIsLoading(false);

              resolve({
                description: status_desc || type_desc || county_name,
                code: status_code || type_code || county_code,
              });
            },
          );
        });
      }
    },
  });

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false;

  const onSubmit = async (data: any) => {
    if (isDirtyAlt) return;

    if (queryType === 'insert') {
      // Adding selection type so we know which table to update in the endpoint.
      await window.electron.ipcRenderer.sendMessage(
        ipc.postInsertDropDownOption,
        {
          ...data,
          selectionType,
        },
      );
      await window.electron.ipcRenderer.once(
        ipc.postInsertDropDownOption,
        ({ newRecord, message, status }) => {
          toast[status](message, { id: 'insert-drop-down-option' });

          if (status === 'success') {
            setTableData([newRecord, ...tableData]);
            reset();
            fetchUpdatedDropDownList();
          }
        },
      );
    }

    if (queryType === 'update') {
      await window.electron.ipcRenderer.sendMessage(
        ipc.postUpdateDropDownOption,
        {
          ...data,
          id: statusCodeId,
          selectionType,
        },
      );
      await window.electron.ipcRenderer.once(
        ipc.postUpdateDropDownOption,
        ({ updatedRecord, message, status }) => {
          toast[status](message, { id: 'update-drop-down-option' });

          if (status === 'success') {
            const updatedData = tableData.map((record) => {
              if (record.id === updatedRecord.id) {
                record = updatedRecord;
              }
              return record;
            });

            setTableData(updatedData);
            reset(updatedRecord);
            fetchUpdatedDropDownList();
          }
        },
      );
    }
  };

  const onSubmitError = (data: any) => {
    if (errors)
      toast.error('All required fields must be filled out.', {
        id: 'status-code-form-error',
      });
  };

  return (
    <div className="form-wrapper edit-form">
      {isLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <section className={`flex-y`}>
            <FormInput
              name="description"
              labelKey="description"
              labelText="Name / Description"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <FormInput
              name="code"
              labelKey="code"
              labelText="Code"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />
          </section>

          <section className="submit-button-section">
            <Button type="submit" isDisabled={isDirtyAlt}>
              {FORM_BUTTON_TEXT[queryType]}
            </Button>
          </section>
        </form>
      )}
    </div>
  );
};

export default EditStatusCodeForm;
