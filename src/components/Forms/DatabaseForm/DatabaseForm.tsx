import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '@/components/Button/Button';
import { useDatabaseContext } from '~/context/DatabaseContext';
import { DBCredentials } from '~/model/dbconfig';
import FormInput from '../FormInput/FormInput';
import './DatabaseForm.scss';

const DatabaseForm = () => {
  const { connectToDB } = useDatabaseContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  const onSubmit = async (credentials: DBCredentials) => {
    if (!isDirty) {
      toast.error('All required fields must be filled out', {
        id: 'DB Form Required Fields',
      });
    }
    connectToDB(credentials);
  };

  return (
    <div className="form-wrapper edit-form">
      <form id="db-form" className="flex-y" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          name="user"
          labelKey="user"
          labelText="Username"
          type="text"
          isRequired={true}
          register={register}
          errors={errors}
          autoComplete="off"
          defaultValue="postgres"
        />

        <FormInput
          name="password"
          labelKey="password"
          labelText="Password"
          type="password"
          isRequired={true}
          register={register}
          errors={errors}
          autoComplete="off"
        />

        <FormInput
          name="database"
          labelKey="database"
          labelText="Database"
          type="text"
          isRequired={true}
          register={register}
          errors={errors}
          autoComplete="off"
          defaultValue="rainen_law"
        />

        <section className="db-info">
          <FormInput
            name="host"
            labelKey="host"
            labelText="Host (ex: 192.12.1.2)"
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
            autoComplete="off"
            defaultValue="localhost"
            customClass="host-name-field"
          />

          <FormInput
            name="port"
            labelKey="port"
            labelText="Port"
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
            autoComplete="off"
            defaultValue="5432"
            customClass="port-field"
          />
        </section>

        <section className="submit-button-section">
          <Button type="submit" isDisabled={false}>
            Sign In
          </Button>
        </section>
      </form>
    </div>
  );
};

export default DatabaseForm;
