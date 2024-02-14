import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Button from '@/components/Button/Button';
import FormInput from '@/components/Forms/FormInput/FormInput';
import PrintClientLabel from '@/components/PrintClientLabel/PrintClientLabel';
import Spinner from '@/components/Spinner/Spinner';
import SubTableINS from '@/components/Tables/SubTableINS/SubTableINS';
import SubTableProperties from '@/components/Tables/SubTableProperties/SubTableProperties';
import { FORM_BUTTON_TEXT } from '~/constants';
import { ipc } from '~/constants/ipcEvents';
import { useUser } from '~/context/AuthContext';
import { useFetchClientList } from '~/context/ClientsContext';
import { useSelectDropDownsContext } from '~/context/SelectDropDownsContext';
import { stateAbbrvsDropDownOptions } from '~/constants/stateAbbrvs';
import { Client, ClientInfoSnippet } from '~/contracts';
import { convertNullsToStrings, timestampToDate } from '~/utils';
import './EditClientForm.scss';

interface OwnProps {
  clientId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (id: string) => void;
}

const ClientForm: React.FC<OwnProps> = ({
  clientId,
  queryType,
  handleAfterSubmit = () => {},
}) => {
  const user = useUser();
  const updateClientList = useFetchClientList();
  const { clientStatusDropDownOptions } = useSelectDropDownsContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [titlescount, settitlescount] = useState(null);
  const [printLabelInfo, setPrintLabelInfo] = useState({});
  const [defaultSelectValues, setDefaultSelectValues] = useState({
    c_status: '',
    c_state: 'MA',
  });
  const [clientInfoSnippet, setClientInfoSnippet] = useState<ClientInfoSnippet>(
    {
      id: 'New',
      c_number: null,
      c_name: 'New Client',
      last_updated: null,
    },
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: async () => {
      if (clientId) {
        return await new Promise((resolve) => {
          setIsLoading(true);
          window.electron.ipcRenderer.sendMessage(
            ipc.postSelectedClient,
            clientId,
          );

          window.electron.ipcRenderer.once(
            ipc.postSelectedClient,
            (clientInfo) => {
              const { c_number = '', last_updated = null } = clientInfo;

              setPrintLabelInfo((prevState) => ({
                ...prevState,
                ...clientInfo,
              }));

              setClientInfoSnippet((prevState) => ({
                ...prevState,
                ...clientInfo,
                c_number: c_number.toString(),
                last_updated: last_updated
                  ? timestampToDate(last_updated, 'mmDDyyyy')
                  : null,
              }));

              setDefaultSelectValues({
                ...(convertNullsToStrings(clientInfo) as any),
              });

              setIsLoading(false);

              resolve({ ...convertNullsToStrings(clientInfo) });
            },
          );
        });
      }
    },
  });

  if (!user) return null;

  const onSubmit = async (data: Partial<Client>) => {
    if (queryType === 'insert') {
      await window.electron.ipcRenderer.sendMessage(ipc.postInsertClient, {
        ...data,
        username: user.username,
      });
      await window.electron.ipcRenderer.once(
        ipc.postInsertClient,
        ({ newClientId, status, message }) => {
          handleAfterSubmit(newClientId);
          if (status !== 'error') {
            toast[status](message, { id: 'client-insert' });
            reset();
            updateClientList();
          }
        },
      );
    }

    if (queryType === 'update') {
      confirmAlert({
        message: 'Are you sure you want to edit this record?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              await window.electron.ipcRenderer.sendMessage(
                ipc.postUpdateClient,
                {
                  ...data,
                  id: clientInfoSnippet.id, // Passing id to update correct record
                  username: user.username,
                },
              );
              await window.electron.ipcRenderer.once(
                ipc.postUpdateClient,
                ({ updatedRecord, message, status }) => {
                  toast[status](message, { id: 'updated-client' });
                  if (status !== 'error') {
                    handleAfterSubmit(clientInfoSnippet.id);
                    reset(updatedRecord);
                    updateClientList();
                  }
                },
              );
            },
          },
          {
            label: 'No',
            onClick: () => {
              toast.error('Operation Cancelled.', {
                id: 'edit-property',
              });
            },
          },
        ],
      });
    }
  };

  const onSubmitError = (data: any) => {
    if (errors)
      toast.error('All required fields must be filled out.', {
        id: 'client-form-error',
      });
  };

  return (
    <div className="form-wrapper edit-form">
      <header>
        <span>{clientInfoSnippet.c_name}</span>
        {clientInfoSnippet.c_number ? (
          <span> Client Number: {clientInfoSnippet.c_number} </span>
        ) : null}
      </header>
      {isLoading ? (
        <Spinner />
      ) : (
        <form
          id="client-edit-form"
          className="flex-y"
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
        >
          <section className="flex-x client-status-section">
            <FormInput
              name="c_name"
              customClass="client"
              labelKey="c_name"
              labelText="Client/Firm Name"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <Controller
              name="c_status"
              control={control}
              rules={{ required: true }}
              defaultValue={defaultSelectValues.c_status}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    name="c_status"
                    labelKey="c_status"
                    labelText="Status"
                    type="select"
                    defaultValue={defaultSelectValues.c_status}
                    customClass="status"
                    selectOnChange={onChange}
                    options={clientStatusDropDownOptions}
                    isRequired={true}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
          </section>
          <section className="address-section">
            <FormInput
              name="c_address_1"
              labelKey="c_address_1"
              labelText="Address Line 1"
              type="text"
              customClass="address"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <FormInput
              name="c_address_2"
              labelKey="c_address_2"
              labelText="Address Line 2"
              type="text"
              customClass="address"
              isRequired={false}
              register={register}
              errors={errors}
            />
          </section>

          <section className="flex-x city-state-zip-section">
            <FormInput
              name="c_city"
              labelKey="c_city"
              labelText="City"
              customClass="city"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <Controller
              name="c_state"
              control={control}
              rules={{ required: true }}
              defaultValue={defaultSelectValues.c_state}
              render={({ field: { onChange } }) => {
                return (
                  <FormInput
                    name="c_state"
                    labelKey="c_state"
                    labelText="State"
                    type="select"
                    defaultValue={defaultSelectValues.c_state}
                    customClass="state"
                    selectOnChange={onChange}
                    options={stateAbbrvsDropDownOptions}
                    isRequired={true}
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />

            <FormInput
              name="c_zip"
              labelKey="c_zip"
              labelText="Zip Code"
              customClass="zip"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />
          </section>

          <section className="flex-x phone-fax-email-section">
            <FormInput
              name="c_phone"
              labelKey="c_phone"
              labelText="Phone Number"
              customClass="phone"
              type="tel"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <FormInput
              name="c_fax"
              labelKey="c_fax"
              labelText="Fax Number"
              customClass="fax"
              type="tel"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <FormInput
              name="c_email"
              labelKey="c_email"
              labelText="Email Address"
              customClass="email"
              type="email"
              isRequired={true}
              register={register}
              errors={errors}
            />
          </section>

          <section className="flex-x contact-statement-section">
            <FormInput
              name="c_contact"
              labelKey="c_contact"
              labelText="Contact"
              customClass="contact"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />

            <FormInput
              name="c_statement_addressee"
              labelKey="c_statement_addressee"
              labelText="Statement Addressee"
              customClass="statement"
              type="text"
              isRequired={true}
              register={register}
              errors={errors}
            />
          </section>

          <section className="notes-section">
            <FormInput
              name="c_notes"
              labelKey="c_notes"
              labelText="Notes"
              type="textarea"
              isRequired={true}
              register={register}
              errors={errors}
            />
          </section>

          <section className="submit-button-section">
            {queryType === 'update' ? (
              <PrintClientLabel clientInfo={printLabelInfo as Client} />
            ) : null}
            <Button type="submit" isDisabled={!isValid}>
              {FORM_BUTTON_TEXT[queryType]}
            </Button>
          </section>

          <footer className="form-footer">
            {clientInfoSnippet.last_updated && (
              <>
                <span>Last Updated: {clientInfoSnippet.last_updated.date}</span>
                <span className="italicized-text">
                  {clientInfoSnippet.last_updated.time}
                </span>
              </>
            )}
          </footer>
        </form>
      )}

      {queryType === 'update' && clientInfoSnippet.c_number ? (
        <Tabs>
          <TabList>
            <Tab>Properties</Tab>
            <Tab>
              Titles
              {titlescount ? (
                <span className="italicized-record-count">({titlescount})</span>
              ) : (
                ''
              )}
            </Tab>
          </TabList>

          <TabPanel>
            <SubTableProperties cnmbr={clientInfoSnippet.c_number.toString()} />
          </TabPanel>

          <TabPanel>
            <SubTableINS
              inmbr={clientInfoSnippet.c_number.toString()}
              settitlescount={settitlescount}
            />
          </TabPanel>
        </Tabs>
      ) : null}
    </div>
  );
};

export default ClientForm;
