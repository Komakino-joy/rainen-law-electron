import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button/Button';
import { useClientsContext } from '~/context/ClientsContext';
import { dbRef } from '~/constants/dbRefs';
import FormInput from '../FormInput/FormInput';

const ClientSearchForm = () => {
  const navigate = useNavigate();

  const { clientSelectOptions } = useClientsContext();
  const [clearSelectInputBoxes, setClearSelectInputBoxes] = useState(false);

  const {
    c_name: clientNames,
    c_number: clientNumbers,
    c_status: clientStats,
    c_contact: clientContacts,
    c_statement_addressee: clientStattos,
    c_city: clientCities,
    c_state: clientStates,
    c_zip: clientZips,
    c_phone: clientPhones,
    c_fax: clientFaxes,
    c_email: clientEmails,
  } = clientSelectOptions;

  const {
    register,
    getValues,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm();

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false;

  const onSubmit = async (data: any) => {
    document.cookie = `last-clients-search-filters=${encodeURIComponent(
      JSON.stringify(data),
    )}; path=/`;

    navigate('/clients/1');
  };

  return (
    <div className="form-wrapper search-form">
      <header>
        <span>Search For Clients</span>
      </header>
      <form className="flex-y">
        <section className="flex-x gap-sm">
          {clientNames && clientNames.length > 0 && (
            <Controller
              name={dbRef.clients.c_name}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_name}
                    labelKey={dbRef.clients.c_name}
                    labelText="Name"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientNames}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}

          {clientNumbers && clientNumbers.length > 0 && (
            <Controller
              name={dbRef.clients.c_number}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_number}
                    labelKey={dbRef.clients.c_number}
                    labelText="Number"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientNumbers}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}

          {clientStats && clientStats.length > 0 && (
            <Controller
              name={dbRef.clients.c_status}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_status}
                    labelKey={dbRef.clients.c_status}
                    labelText="Status"
                    type="select"
                    customClass="f-50"
                    selectOnChange={onChange}
                    options={clientStats}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}
        </section>

        <section className="flex-x gap-sm">
          {clientPhones && clientPhones.length > 0 && (
            <Controller
              name={dbRef.clients.c_phone}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_phone}
                    labelKey={dbRef.clients.c_phone}
                    labelText="Phone Number"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientPhones}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}

          {clientFaxes && clientFaxes.length > 0 && (
            <Controller
              name={dbRef.clients.c_fax}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_fax}
                    labelKey={dbRef.clients.c_fax}
                    labelText="Fax Number"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientFaxes}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}

          {clientEmails && clientEmails.length > 0 && (
            <Controller
              name={dbRef.clients.c_email}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_email}
                    labelKey={dbRef.clients.c_email}
                    labelText="Email"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientEmails}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}
        </section>

        <section className="flex-x gap-sm">
          {clientContacts && clientContacts.length > 0 && (
            <Controller
              name={dbRef.clients.c_contact}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_contact}
                    labelKey={dbRef.clients.c_contact}
                    labelText="Contact"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientContacts}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}

          {clientStattos && clientStattos.length > 0 && (
            <Controller
              name={dbRef.clients.c_statement_addressee}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_statement_addressee}
                    labelKey={dbRef.clients.c_statement_addressee}
                    labelText="Statement Addressee"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientStattos}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}
        </section>

        <section className="flex-x gap-sm">
          {clientCities && clientCities.length > 0 && (
            <Controller
              name={dbRef.clients.c_city}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_city}
                    labelKey={dbRef.clients.c_city}
                    labelText="City"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientCities}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}

          {clientStates && clientStates.length > 0 && (
            <Controller
              name={dbRef.clients.c_state}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_state}
                    labelKey={dbRef.clients.c_state}
                    labelText="State"
                    type="select"
                    customClass="f-50"
                    selectOnChange={onChange}
                    options={clientStates}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}

          {clientZips && clientZips.length > 0 && (
            <Controller
              name={dbRef.clients.c_zip}
              control={control}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    key={`my_unique_select_key_to_force_render__${clearSelectInputBoxes}`}
                    name={dbRef.clients.c_zip}
                    labelKey={dbRef.clients.c_zip}
                    labelText="Zip Code"
                    type="select"
                    customClass="f-100"
                    selectOnChange={onChange}
                    options={clientZips}
                    isRequired={false}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          )}
        </section>

        <section className="flex-x submit-button-section">
          <Button
            isDisabled={false}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const data = getValues();
              onSubmit(data);
              setClearSelectInputBoxes(!clearSelectInputBoxes);
              reset();
            }}
          >
            Submit Search
          </Button>
          <Button
            isDisabled={isDirtyAlt}
            type="button"
            onClick={() => {
              setClearSelectInputBoxes(!clearSelectInputBoxes);
              reset();
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

export default ClientSearchForm;
