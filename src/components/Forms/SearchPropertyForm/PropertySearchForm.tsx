import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button/Button';
import { CITY_HUB } from '~/constants';
import { dbRef } from '~/constants/dbRefs';
import { useClientsContext } from '~/context/ClientsContext';
import { usePropertiesContext } from '~/context/PropertiesContext';
import FormInput from '../FormInput/FormInput';
import Spinner from '@/components/Spinner/Spinner';

const PropertySearchForm = () => {
  const navigate = useNavigate();

  const { propertiesSelectOptions, isLoadingPropertyContext } =
    usePropertiesContext();
  const { clientSelectOptions } = useClientsContext();

  const [clearSelectInputBoxes, setClearSelectInputBoxes] = useState(false);

  const {
    register,
    getValues,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm();

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false;

  const onSubmit = async (data: any) => {
    if (Object.values(data).every((v) => v === '' || !v)) {
      toast.error('No search parameters were provided.');
    } else {
      document.cookie = `last-properties-search-filters=${encodeURIComponent(
        JSON.stringify(data),
      )}; path=/`;

      navigate('/properties/1');
    }
  };

  if (isLoadingPropertyContext)
    return <Spinner containerClassName="page-spinner" />;

  return (
    <div className="form-wrapper search-form">
      <header>
        <span>Search For Properties</span>
      </header>
      <form className="flex-y">
        <section className="flex-x gap-sm">
          <FormInput
            name={dbRef.properties.p_comp_ref}
            labelKey={dbRef.properties.p_comp_ref}
            labelText="CompRef"
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
          />
          <FormInput
            name={dbRef.properties.p_file}
            labelKey={dbRef.properties.p_file}
            labelText="FileNumber"
            type="text"
            isRequired={true}
            register={register}
            errors={errors}
          />
          <FormInput
            name="inputStartDate"
            labelKey="inputStartDate"
            labelText="Input Start Date"
            type="date"
            isRequired={true}
            register={register}
            errors={errors}
          />

          <FormInput
            name="inputEndDate"
            labelKey="inputEndDate"
            labelText="Input End Date"
            type="date"
            isRequired={true}
            register={register}
            errors={errors}
          />

          <FormInput
            name="requestStartDate"
            labelKey="requestStartDate"
            labelText="Request Start Date"
            type="date"
            isRequired={true}
            register={register}
            errors={errors}
          />

          <FormInput
            name="requestEndDate"
            labelKey="requestEndDate"
            labelText="Request End Date"
            type="date"
            isRequired={true}
            register={register}
            errors={errors}
          />
        </section>
        <section className="flex-x gap-sm">
          {clientSelectOptions.c_name &&
            clientSelectOptions.c_name.length > 0 && (
              <Controller
                name={dbRef.clients.c_name}
                control={control}
                defaultValue={''}
                render={({ field: { onChange } }) => {
                  return (
                    <FormInput
                      key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                      name={dbRef.clients.c_name}
                      labelKey={dbRef.clients.c_name}
                      labelText="Client"
                      type="select"
                      customClass="f-100"
                      selectOnChange={onChange}
                      options={clientSelectOptions.c_name}
                      isRequired={false}
                      register={register}
                      errors={errors}
                      defaultValue={''}
                    />
                  );
                }}
              />
            )}

          {propertiesSelectOptions.p_type &&
            propertiesSelectOptions.p_type.length > 0 && (
              <Controller
                name={dbRef.properties.p_type}
                control={control}
                defaultValue={''}
                render={({ field: { onChange } }) => {
                  return (
                    <FormInput
                      key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                      name={dbRef.properties.p_type}
                      labelKey={dbRef.properties.p_type}
                      labelText="Type"
                      type="select"
                      customClass="f-25"
                      selectOnChange={onChange}
                      options={propertiesSelectOptions.p_type}
                      isRequired={false}
                      register={register}
                      errors={errors}
                      defaultValue={''}
                    />
                  );
                }}
              />
            )}

          {propertiesSelectOptions.p_status &&
            propertiesSelectOptions.p_status.length > 0 && (
              <Controller
                name={dbRef.properties.p_status}
                control={control}
                defaultValue={''}
                render={({ field: { onChange } }) => {
                  return (
                    <FormInput
                      key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                      name={dbRef.properties.p_status}
                      labelKey={dbRef.properties.p_status}
                      labelText="Status"
                      type="select"
                      customClass="f-25"
                      selectOnChange={onChange}
                      options={propertiesSelectOptions.p_status}
                      isRequired={false}
                      register={register}
                      errors={errors}
                      defaultValue={''}
                    />
                  );
                }}
              />
            )}
        </section>
        <section className="flex-x gap-sm">
          {propertiesSelectOptions.p_city &&
            propertiesSelectOptions.p_city.length > 0 && (
              <Controller
                name={dbRef.properties.p_city}
                control={control}
                defaultValue={''}
                render={({ field: { onChange } }) => {
                  return (
                    <FormInput
                      key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                      name={dbRef.properties.p_city}
                      labelKey={dbRef.properties.p_city}
                      labelText="City"
                      type="select"
                      customClass="f-100"
                      selectOnChange={onChange}
                      options={[
                        { label: CITY_HUB, value: CITY_HUB },
                        ...propertiesSelectOptions.p_city,
                      ]}
                      isRequired={false}
                      register={register}
                      errors={errors}
                      defaultValue={''}
                    />
                  );
                }}
              />
            )}

          <FormInput
            name={dbRef.properties.p_street}
            labelKey={dbRef.properties.p_street}
            labelText="Street"
            customClass="f-100"
            type="text"
            isRequired={false}
            register={register}
            errors={errors}
          />
        </section>

        <section className="flex-x gap-sm">
          <FormInput
            name={dbRef.properties.p_condo}
            labelKey={dbRef.properties.p_condo}
            labelText="Condo"
            customClass="f-50"
            type="text"
            isRequired={false}
            register={register}
            errors={errors}
          />

          <FormInput
            name={dbRef.properties.p_lot}
            labelKey={dbRef.properties.p_lot}
            labelText="Lot"
            customClass="f-50"
            type="text"
            isRequired={false}
            register={register}
            errors={errors}
          />

          <FormInput
            name={dbRef.properties.p_instructions}
            labelKey={dbRef.properties.p_instructions}
            labelText="Instructions"
            type="text"
            customClass="f-100"
            isRequired={false}
            register={register}
            errors={errors}
          />
        </section>

        <section className="flex-x submit-button-section">
          <Button
            isDisabled={isDirtyAlt}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const data = getValues();
              onSubmit(data);
            }}
          >
            Submit Search
          </Button>
          <Button
            isDisabled={isDirtyAlt}
            type="button"
            onClick={() => {
              reset();
              setClearSelectInputBoxes(!clearSelectInputBoxes);
            }}
            redVariant
          >
            Clear Form
          </Button>
        </section>
      </form>
    </div>
  );
};

export default PropertySearchForm;
