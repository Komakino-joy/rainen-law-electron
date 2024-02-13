import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '@/components/Button/Button';
import Spinner from '@/components/Spinner/Spinner';
import { FORM_BUTTON_TEXT } from '~/constants';
import { dbRef } from '~/constants/dbRefs';
import { ipc } from '~/constants/ipcEvents';
import FormInput from '../FormInput/FormInput';
import styles from './EditExaminerForm.module.scss';

interface EditEditExaminerFormProps {
  tableData: any[];
  setTableData: any;
  selectedId: string | null;
  queryType: 'update' | 'insert';
}

const EditExaminerForm: React.FC<EditEditExaminerFormProps> = ({
  tableData,
  setTableData,
  selectedId,
  queryType,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examinerId, setExaminerId] = useState<string>('');
  const [defaultSelectValues, setDefaultSelectValues] = useState({
    type: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: async () => {
      if (selectedId) {
        setIsLoading(true);

        await window.electron.ipcRenderer.sendMessage(
          ipc.postSelectedExaminer,
          {
            id: selectedId,
          },
        );
        await window.electron.ipcRenderer.once(
          ipc.postSelectedExaminer,
          (examinerInfo) => {
            const { id, name, code, type, compensate, is_active } =
              examinerInfo;

            setExaminerId(id);
            setDefaultSelectValues((prevState) => ({
              ...prevState,
              type: type || '',
            }));

            setIsLoading(false);

            return {
              [dbRef.examiners.name]: name,
              [dbRef.examiners.code]: code,
              [dbRef.examiners.compensate]: compensate,
              [dbRef.examiners.is_active]: is_active,
            };
          },
        );
      }
    },
  });

  const onSubmit = async (data: any) => {
    if (!isDirty) return;
    if (queryType === 'insert') {
      await window.electron.ipcRenderer.sendMessage(ipc.postInsertExaminer, {
        data,
      });
      await window.electron.ipcRenderer.once(
        ipc.postInsertExaminer,
        (newRecord) => {
          reset();
          setTableData([...tableData, newRecord]);
        },
      );
    }

    if (queryType === 'update') {
      await window.electron.ipcRenderer.sendMessage(ipc.postUpdateExaminer, {
        id: examinerId,
        data,
      });
      await window.electron.ipcRenderer.once(
        ipc.postUpdateExaminer,
        (updatedRecord) => {
          reset(updatedRecord);
          const updatedData = tableData.map((record) => {
            if (record.id === updatedRecord.id) {
              record = updatedRecord;
            }
            return record;
          });

          setTableData(updatedData);
        },
      );
    }
  };

  const onSubmitError = (data: any) => {
    if (errors)
      toast.error('All required fields must be filled out.', {
        id: 'examiner-form-error',
      });
  };

  return (
    <div className="form-wrapper edit-form">
      {isLoading ? (
        <Spinner />
      ) : (
        <form
          className="flex-y"
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
        >
          <FormInput
            name={dbRef.examiners.name}
            labelKey={dbRef.examiners.name}
            labelText="Name"
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
          />

          <section className={`flex-x ${styles['code-type-section']}`}>
            <FormInput
              name={dbRef.examiners.code}
              labelKey={dbRef.examiners.code}
              labelText="Code"
              type="text"
              customClass={styles.code}
              isRequired={true}
              register={register}
              errors={errors}
            />

            <Controller
              name={dbRef.examiners.type}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    name={dbRef.examiners.type}
                    labelKey={dbRef.examiners.type}
                    labelText="Type"
                    type="select"
                    customClass={styles.type}
                    defaultValue={defaultSelectValues.type}
                    selectOnChange={onChange}
                    options={[
                      { label: '1', value: '1' },
                      { label: '2', value: '2' },
                    ]}
                    isRequired={true}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          </section>

          <section className={`flex-x ${styles['comp-active-section']}`}>
            <FormInput
              name={dbRef.examiners.compensate}
              labelKey={dbRef.examiners.compensate}
              labelText="Compensation"
              type="number"
              customClass={styles.comp}
              isRequired={false}
              register={register}
              errors={errors}
              defaultValue={0}
              min="0"
            />

            <FormInput
              name={dbRef.examiners.is_active}
              labelKey={dbRef.examiners.is_active}
              labelText="Is Active?"
              type="checkbox"
              customClass="checkbox"
              isRequired={false}
              register={register}
              errors={errors}
            />
          </section>

          <section className="submit-button-section">
            <Button type="submit" isDisabled={!isDirty}>
              {FORM_BUTTON_TEXT[queryType]}
            </Button>
          </section>
        </form>
      )}
    </div>
  );
};

export default EditExaminerForm;
