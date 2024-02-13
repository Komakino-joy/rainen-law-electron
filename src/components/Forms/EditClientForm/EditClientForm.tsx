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
import {
  ClientStatusCodeMapType,
  CLIENT_STATUS_CODES_MAP,
  FORM_BUTTON_TEXT,
} from '~/constants';
import { useUser } from '~/context/AuthContext';
import { useSelectDropDownsContext } from '~/context/SelectDropDownsContext';
import { timestampToDate } from '~/utils';
import { abbreviatedStatesLabelValuePair } from '~/utils/UnitedStates';
import './EditClientForm.scss';
import { Client, ClientInfoSnippet, DateTime } from '~/contracts';
import { ipc } from '~/constants/ipcEvents';
import { dbRef } from '~/constants/dbRefs';

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
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: async () => {
      if (clientId) {
        setIsLoading(true);

        window.electron.ipcRenderer.sendMessage(
          ipc.postSelectedClient,
          clientId,
        );
        window.electron.ipcRenderer.once(
          ipc.postSelectedClient,
          (clientInfo) => {
            const {
              id = '',
              c_number = '',
              c_name = '',
              last_updated = null,
              c_status = '',
              c_address_1 = '',
              c_address_2 = '',
              c_city = '',
              c_state = '',
              c_zip = '',
              c_phone = '',
              c_fax = '',
              c_email = '',
              c_contact = '',
              c_statement_addressee = '',
              c_notes = '',
            } = clientInfo;

            setPrintLabelInfo((prevState) => ({
              ...prevState,
              c_name,
              c_address_1,
              c_address_2,
              c_city,
              c_state,
              c_zip,
            }));

            setClientInfoSnippet((prevState) => ({
              ...prevState,
              id: id,
              c_number: c_number.toString(),
              c_name: c_name,
              last_updated: last_updated
                ? timestampToDate(last_updated, 'mmDDyyyy')
                : null,
            }));

            setIsLoading(false);

            setDefaultSelectValues({
              c_status:
                CLIENT_STATUS_CODES_MAP[c_status as ClientStatusCodeMapType] ||
                '',
              c_state: c_state || '',
            });

            return {
              c_name: c_name,
              c_status: c_status,
              c_address_1: c_address_1,
              c_address_2: c_address_2,
              c_city: c_city,
              c_state: c_state,
              c_zip: c_zip,
              c_phone: c_phone,
              c_fax: c_fax,
              c_email: c_email,
              c_contact: c_contact,
              c_statement_addressee: c_statement_addressee,
              c_notes: c_notes,
            };
          },
        );
      }
    },
  });

  if (!user) return null;

  const onSubmit = async (data: Partial<Client>) => {
    if (queryType === 'insert') {
      window.electron.ipcRenderer.sendMessage(ipc.postInsertClient, {
        data,
        username: user.username,
      });
      window.electron.ipcRenderer.once(ipc.postInsertClient, (newClientId) => {
        reset();
        handleAfterSubmit(newClientId);
      });
    }

    if (queryType === 'update') {
      confirmAlert({
        message: 'Are you sure you want to edit this record?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              window.electron.ipcRenderer.sendMessage(ipc.postUpdateClient, {
                data,
                id: clientInfoSnippet.id, // Passing id to update correct record
                username: user.username,
              });
              window.electron.ipcRenderer.once(
                ipc.postUpdateClient,
                (updatedRecord) => {
                  handleAfterSubmit(clientInfoSnippet.id);
                  reset(updatedRecord);
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

  type ClientInfoKeys = keyof typeof clientInfoSnippet;

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
                    options={abbreviatedStatesLabelValuePair}
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
            {clientInfoSnippet[
              dbRef.clients.last_updated as ClientInfoKeys
            ] && (
              <>
                <span>
                  Last Updated:{' '}
                  {
                    (
                      clientInfoSnippet[
                        dbRef.clients.last_updated as ClientInfoKeys
                      ] as DateTime
                    ).date
                  }
                </span>
                <span className="italicized-text">
                  {
                    (
                      clientInfoSnippet[
                        dbRef.clients.last_updated as ClientInfoKeys
                      ] as DateTime
                    ).time
                  }
                </span>
              </>
            )}
          </footer>
        </form>
      )}

      {queryType === 'update' &&
      clientInfoSnippet[dbRef.clients.c_number as ClientInfoKeys] ? (
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
            <SubTableProperties
              cnmbr={(
                clientInfoSnippet[
                  dbRef.clients.c_number as ClientInfoKeys
                ] as string
              ).toString()}
            />
          </TabPanel>

          <TabPanel>
            <SubTableINS
              inmbr={(
                clientInfoSnippet[
                  dbRef.clients.c_number as ClientInfoKeys
                ] as string
              ).toString()}
              settitlescount={settitlescount}
            />
          </TabPanel>
        </Tabs>
      ) : null}
    </div>
  );
};

export default ClientForm;
