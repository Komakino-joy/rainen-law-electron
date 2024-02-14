import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '@/components/Button/Button';
import Spinner from '@/components/Spinner/Spinner';
import { FORM_BUTTON_TEXT } from '~/constants';
import { dbRef } from '~/constants/dbRefs';
import { ipc } from '~/constants/ipcEvents';
import { stateAbbrvsDropDownOptions } from '~/constants/stateAbbrvs';
import FormInput from '../FormInput/FormInput';
import styles from './EditCityForm.module.scss';

interface EditCityFormProps {
  tableData: any[];
  setTableData: any;
  selectedId: string | null;
  queryType: 'update' | 'insert';
}

const EditCityForm: React.FC<EditCityFormProps> = ({
  tableData,
  setTableData,
  selectedId,
  queryType,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cityId, setCityId] = useState<string>('');
  const [defaultSelectValues, setDefaultSelectValues] = useState({
    type: '',
    state_abbrv: '',
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

        return await new Promise((resolve) => {
          window.electron.ipcRenderer.sendMessage(
            ipc.postSelectedCity,
            selectedId,
          );
          window.electron.ipcRenderer.once(ipc.postSelectedCity, (cities) => {
            const { id, state_abbrv } = cities;

            console.log(state_abbrv);
            setCityId(id);
            setDefaultSelectValues((prevState) => ({
              ...prevState,
              state_abbrv,
            }));

            setIsLoading(false);

            resolve({ ...cities });
          });
        });
      }
    },
  });

  const onSubmit = async (data: any) => {
    if (!isDirty) return;
    if (queryType === 'insert') {
      await window.electron.ipcRenderer.sendMessage(ipc.postInsertCity, {
        ...data,
      });
      await window.electron.ipcRenderer.once(
        ipc.postInsertCity,
        ({ newRecord, message, status }) => {
          toast[status](message, { id: 'update-city' });
          if (status === 'success') {
            setTableData([newRecord, ...tableData]);
            reset();
          }
        },
      );
    }

    if (queryType === 'update') {
      await window.electron.ipcRenderer.sendMessage(ipc.postUpdateCity, {
        ...data,
        id: cityId,
      });
      await window.electron.ipcRenderer.once(
        ipc.postUpdateCity,
        ({ updatedRecord, message, status }) => {
          toast[status](message, { id: 'update-city' });
          if (status === 'success') {
            const updatedData = tableData.map((record) => {
              if (record.id === updatedRecord.id) {
                record = updatedRecord;
              }
              return record;
            });
            reset(updatedRecord);
            setTableData(updatedData);
          }
        },
      );
    }
  };

  const onSubmitError = (data: any) => {
    if (errors)
      toast.error('All required fields must be filled out.', {
        id: 'city-form-error',
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
          <section className={`flex-x ${styles['city-state-section']}`}>
            <FormInput
              name={dbRef.cities.city}
              labelKey={dbRef.cities.city}
              labelText="City"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <Controller
              name={dbRef.cities.state_abbrv}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    name={dbRef.cities.state_abbrv}
                    labelKey={dbRef.cities.state_abbrv}
                    labelText="State"
                    type="select"
                    defaultValue={defaultSelectValues.state_abbrv}
                    selectOnChange={onChange}
                    options={stateAbbrvsDropDownOptions}
                    isRequired={true}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          </section>

          <FormInput
            name={dbRef.cities.county}
            labelKey={dbRef.cities.county}
            labelText="County"
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
          />

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

export default EditCityForm;
