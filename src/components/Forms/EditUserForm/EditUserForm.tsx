import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '@/components/Button/Button';
import Spinner from '@/components/Spinner/Spinner';
import { FORM_BUTTON_TEXT } from '~/constants';
import { dbRef } from '~/constants/dbRefs';
import { ipc } from '~/constants/ipcEvents';
import FormInput from '../FormInput/FormInput';

interface OwnProps {
  tableData: any[];
  setTableData: any;
  selectedId: string | null;
  queryType: 'update' | 'insert';
}

const EditUserForm: React.FC<OwnProps> = ({
  tableData,
  setTableData,
  selectedId,
  queryType,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: async () => {
      if (selectedId) {
        setIsLoading(true);
        await window.electron.ipcRenderer.sendMessage(ipc.postSelectedUser, {
          id: selectedId,
        });
        await window.electron.ipcRenderer.once(
          ipc.postSelectedUser,
          (userInfo) => {
            setIsLoading(false);
            setUserId(userInfo.id);

            return {
              username: userInfo.username,
              l_name: userInfo.l_name,
              f_name: userInfo.f_name,
              is_admin: userInfo.is_admin,
            };
          },
        );
      }
    },
  });

  const onSubmit = async (data: any) => {
    if (!isDirty) return;

    if (queryType === 'insert') {
      await window.electron.ipcRenderer.sendMessage(ipc.postInsertUser, {
        data,
      });
      await window.electron.ipcRenderer.once(
        ipc.postInsertUser,
        (newRecord) => {
          reset();
          setTableData([...tableData, newRecord]);
        },
      );
    }

    if (queryType === 'update') {
      await window.electron.ipcRenderer.sendMessage(ipc.postUpdateUser, {
        id: userId,
        data,
      });
      await window.electron.ipcRenderer.once(
        ipc.postUpdateUser,
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
        id: 'user-form-error',
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
            name={dbRef.users.username}
            labelKey={dbRef.users.username}
            labelText="UserName"
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
            autoComplete="off"
          />

          <section className="flex-x gap-sm">
            <FormInput
              name={dbRef.users.f_name}
              labelKey={dbRef.users.f_name}
              labelText="First Name"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
              autoComplete="off"
            />

            <FormInput
              name={dbRef.users.l_name}
              labelKey={dbRef.users.l_name}
              labelText="Last Name"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
              autoComplete="off"
            />
            <FormInput
              name={dbRef.users.is_admin}
              labelKey={dbRef.users.is_admin}
              labelText="Is Admin"
              type="checkbox"
              customClass="checkbox"
              isRequired={false}
              register={register}
              errors={errors}
            />
          </section>

          <FormInput
            name={dbRef.users.password}
            labelKey={dbRef.users.password}
            labelText="Password"
            type="password"
            isRequired={false}
            register={register}
            errors={errors}
            defaultValue={null}
            autoComplete="new-password"
          />

          <FormInput
            name="confirmPassword"
            labelKey="confirmPassword"
            labelText="Confirm Password"
            type="password"
            defaultValue=""
            isRequired={watch('password')?.length > 0}
            register={register}
            errors={errors}
            autoComplete="new-password"
            validate={(val: string) => {
              if (watch('password') != val) {
                return toast.error('Your passwords do no match', {
                  id: 'passwords-do-not-match',
                });
              }
            }}
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

export default EditUserForm;
