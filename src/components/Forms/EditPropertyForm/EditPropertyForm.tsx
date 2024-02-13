import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Button from '@/components/Button/Button';
import FormInput from '@/components/Forms/FormInput/FormInput';
import Spinner from '@/components/Spinner/Spinner';
import PrintPropertyLabel from '@/components/PrintPropertyLabel/PrintPropertyLabel';
import SubTableSellerBuyer from '@/components/Tables/SubTableSellerBuyer/SubTableSellerBuyer';
import { FORM_BUTTON_TEXT } from '~/constants';
import { ipc } from '~/constants/ipcEvents';
import { useUser } from '~/context/AuthContext';
import { Property } from '~/contracts';
import {
  timestampToDate,
  abbreviatedStatesLabelValuePair,
  updateAddressSuffix,
  dateToString,
} from '~/utils';

import { useClientsContext } from '~/context/ClientsContext';
import { useExaminersContext } from '~/context/ExaminersContext';
import { useSelectDropDownsContext } from '~/context/SelectDropDownsContext';

import 'react-tabs/style/react-tabs.css';
import './EditPropertyForm.scss';
import { dbRef } from '~/constants/dbRefs';

interface OwnProps {
  propertyId: string | null;
  queryType: 'update' | 'insert';
  handleAfterSubmit?: (id: string) => void;
}

const EditPropertyForm: React.FC<OwnProps> = ({
  propertyId,
  queryType,
  handleAfterSubmit = () => {},
}) => {
  const user = useUser();

  const { examinersDropDownOptions } = useExaminersContext();
  const { clientSelectOptions } = useClientsContext();
  const {
    propertyStatusDropDownOptions,
    propertyTypeDropDownOptions,
    cityDropDownOptions,
    countyDropDownOptions,
  } = useSelectDropDownsContext();

  const { c_name: clientNames } = clientSelectOptions;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [printLabelInfo, setPrintLabelInfo] = useState({});
  const [defaultSelectValues, setDefaultSelectValues] = useState({
    assigned: '',
    city: '',
    clientName: '',
    county: '',
    state: 'MA',
    status: '',
    type: '',
  });

  const [propertyInfoSnippet, setPropertyInfoSnippet] = useState<{
    id: string;
    address: string;
    p_number: string | null;
    compRef: string | null;
    lastUpdated: {
      date: string;
      time: string;
    } | null;
  }>({
    id: '',
    address: '',
    p_number: '',
    compRef: null,
    lastUpdated: null,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: async () => {
      if (propertyId) {
        setIsLoading(true);

        await window.electron.ipcRenderer.sendMessage(
          ipc.postSelectedProperty,
          propertyId,
        );
        await window.electron.ipcRenderer.once(
          ipc.postSelectedProperty,
          (response) => {
            const {
              id = '',
              p_city = '',
              p_street = '',
              p_state = '',
              p_zip = '',
              p_book_1 = '',
              p_book_2 = '',
              p_page_1 = '',
              p_page_2 = '',
              p_cert_1 = '',
              p_lot = '',
              p_condo = '',
              p_county = '',
              p_unit = '',
              p_status = '',
              p_type = '',
              p_assign = '',
              c_name = '',
              p_comp_ref = '',
              p_file = '',
              c_file = '',
              p_requester = '',
              p_request_date = '',
              p_closed_date = '',
              p_instructions = '',
              last_updated = '',
              p_number = '',
              p_input_date = '',
              seller_1 = '',
              seller_2 = '',
              seller_3 = '',
              seller_4 = '',
              buyer_1 = '',
              buyer_2 = '',
            } = response;

            setPrintLabelInfo((prevState) => ({
              ...prevState,
              p_request_date,
              p_type,
              p_input_date,
              p_comp_ref,
              p_unit,
              p_condo,
              p_book_1,
              p_book_2,
              p_page_1,
              c_file,
              p_page_2,
              p_cert_1,
              seller_1,
              seller_2,
              seller_3,
              seller_4,
              buyer_1,
              buyer_2,
              p_instructions,
              c_name,
              p_requester,
            }));

            setPropertyInfoSnippet((prevState) => ({
              ...prevState,
              id: id,
              p_number: p_number,
              address: `${p_city} / ${p_street}`,
              compRef: p_comp_ref,
              lastUpdated: last_updated
                ? timestampToDate(last_updated, 'mmDDyyyy')
                : null,
            }));

            setIsLoading(false);

            setDefaultSelectValues({
              assigned: p_assign || '',
              city: p_city || '',
              clientName: c_name || '',
              county: p_county || '',
              state: p_state || '',
              status: p_status || '',
              type: p_type || '',
            });

            return {
              p_state,
              p_status,
              p_type,
              p_assign,
              clientName: c_name,
              p_city,
              p_zip,
              p_book_1,
              p_book_2,
              p_page_1,
              p_page_2,
              p_cert_1,
              p_street,
              p_lot,
              p_condo,
              p_county,
              p_unit,
              p_comp_ref,
              p_file,
              c_file,
              p_requester,
              p_request_date: p_request_date
                ? dateToString(p_request_date)
                : null,
              p_closed_date: p_closed_date ? dateToString(p_closed_date) : null,
              p_instructions,
              buyer_1,
              buyer_2,
              seller_1,
              seller_2,
              seller_3,
              seller_4,
            };
          },
        );
      } else if (queryType === 'insert') {
        await window.electron.ipcRenderer.sendMessage(ipc.getNewCompRef);
        await window.electron.ipcRenderer.once(
          ipc.getNewCompRef,
          (response) => {
            return {
              p_comp_ref: response,
            };
          },
        );
      }
    },
  });

  const isDirtyAlt = !!Object.keys(dirtyFields).length === false;

  const handleStreetBlur = (inputValue: string) => {
    setValue(dbRef.properties.p_street, updateAddressSuffix(`${inputValue}`));
  };

  const onSubmit = async (data: any) => {
    if (isDirtyAlt) return;

    if (queryType === 'insert') {
      await window.electron.ipcRenderer.sendMessage(ipc.postInsertProperty, {
        data,
        username: user ? user.username : 'N/A',
      });
      await window.electron.ipcRenderer.once(
        ipc.postInsertProperty,
        (response) => {
          reset();
          handleAfterSubmit(response.newPropId);
          // @ts-ignore
          toast[response.status](response.message);
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
                ipc.postUpdateProperty,
                {
                  data,
                  id: propertyInfoSnippet.id, // Passing id to update correct record
                  username: user ? user.username : 'N/A',
                },
              );
              await window.electron.ipcRenderer.once(
                ipc.postUpdateProperty,
                (response) => {
                  handleAfterSubmit(propertyInfoSnippet.id);
                  reset(response.updatedRecord);
                  // @ts-ignore
                  toast[response.status](response.message);
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
        id: 'property-form-error',
      });
  };

  return (
    <div className="form-wrapper edit-form">
      <header>
        <span>{propertyInfoSnippet.address}</span>
        {propertyInfoSnippet.compRef ? (
          <span>Property Ref#: {propertyInfoSnippet.compRef}</span>
        ) : null}
      </header>
      {isLoading ? (
        <Spinner />
      ) : (
        <form
          id="edit-property-form"
          onSubmit={handleSubmit(onSubmit, onSubmitError)}
        >
          <section className="flex-x top-section">
            <div className="flex-y column-1">
              <div className="flex-x city-state-section">
                <Controller
                  name={dbRef.properties.p_state}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => {
                    return (
                      <FormInput
                        name={dbRef.properties.p_state}
                        labelKey={dbRef.properties.p_state}
                        labelText="State"
                        type="select"
                        defaultValue={defaultSelectValues.state}
                        customClass="state"
                        selectOnChange={onChange}
                        options={abbreviatedStatesLabelValuePair}
                        isRequired={true}
                        // @ts-ignore
                        register={register}
                        errors={errors}
                      />
                    );
                  }}
                />

                <Controller
                  name={dbRef.properties.p_city}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => {
                    return (
                      <FormInput
                        name={dbRef.properties.p_city}
                        labelKey={dbRef.properties.p_city}
                        labelText="City"
                        type="select"
                        defaultValue={defaultSelectValues.city}
                        customClass="city"
                        selectOnChange={onChange}
                        options={cityDropDownOptions}
                        isRequired={true}
                        // @ts-ignore
                        register={register}
                        errors={errors}
                      />
                    );
                  }}
                />

                <Controller
                  name={dbRef.properties.p_county}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => {
                    return (
                      <FormInput
                        name={dbRef.properties.p_county}
                        labelKey={dbRef.properties.p_county}
                        labelText="County"
                        type="select"
                        defaultValue={defaultSelectValues.county}
                        customClass="county"
                        selectOnChange={onChange}
                        options={countyDropDownOptions}
                        isRequired={true}
                        // @ts-ignore
                        register={register}
                        errors={errors}
                      />
                    );
                  }}
                />
              </div>

              <div className="flex-x zip-street-section">
                <FormInput
                  name={dbRef.properties.p_zip}
                  labelKey={dbRef.properties.p_zip}
                  labelText="Zip Code"
                  customClass="zip"
                  type="text"
                  isRequired={false}
                  // @ts-ignore
                  register={register}
                  errors={errors}
                />

                <FormInput
                  name={dbRef.properties.p_street}
                  labelKey={dbRef.properties.p_street}
                  labelText="Street"
                  customClass="street"
                  type="text"
                  isRequired={true}
                  // @ts-ignore
                  register={register}
                  errors={errors}
                  onBlur={() =>
                    handleStreetBlur(watch(dbRef.properties.p_street))
                  }
                />
              </div>

              <div className="flex-x lot-condo-unit-section">
                <FormInput
                  name={dbRef.properties.p_lot}
                  labelKey={dbRef.properties.p_lot}
                  labelText="Lot / Number"
                  customClass="lot"
                  type="text"
                  isRequired={true}
                  // @ts-ignore
                  register={register}
                  errors={errors}
                  tooltipText="When entering multiple lot numbers, please seperate them with a comma e.g.(45A, 48A, 99A). If you are entering a rangplease use hyphens e.g.(45-50)"
                />

                <FormInput
                  name={dbRef.properties.p_condo}
                  labelKey={dbRef.properties.p_condo}
                  labelText="Condo"
                  customClass="condo"
                  type="text"
                  isRequired={false}
                  // @ts-ignore
                  register={register}
                  errors={errors}
                />

                <FormInput
                  name={dbRef.properties.p_unit}
                  labelKey={dbRef.properties.p_unit}
                  labelText="Unit"
                  customClass="unit"
                  type="text"
                  isRequired={false}
                  // @ts-ignore
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <div className="flex-y jc-start column-2">
              <FormInput
                name={dbRef.properties.p_book_1}
                labelKey={dbRef.properties.p_book_1}
                labelText="Book 1"
                type="text"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />

              <FormInput
                name={dbRef.properties.p_book_2}
                labelKey={dbRef.properties.p_book_2}
                labelText="Book 2"
                customClass="book2"
                type="text"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
            </div>

            <div className="flex-y column-3">
              <FormInput
                name={dbRef.properties.p_page_1}
                labelKey={dbRef.properties.p_page_1}
                labelText="Page 1"
                type="text"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />

              <FormInput
                name={dbRef.properties.p_page_2}
                labelKey={dbRef.properties.p_page_2}
                labelText="Page 2"
                type="text"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />

              <FormInput
                name={dbRef.properties.p_cert_1}
                labelKey={dbRef.properties.p_cert_1}
                labelText="Cert 1"
                type="text"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
            </div>
          </section>

          <section className="flex-y mid-section">
            <div className="flex-x status-type-section">
              {propertyStatusDropDownOptions &&
                propertyStatusDropDownOptions.length > 0 && (
                  <Controller
                    name={dbRef.properties.p_status}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange } }) => {
                      return (
                        <FormInput
                          name={dbRef.properties.p_status}
                          labelKey={dbRef.properties.p_status}
                          labelText="Status"
                          defaultValue={defaultSelectValues.status}
                          type="select"
                          selectOnChange={onChange}
                          options={propertyStatusDropDownOptions}
                          isRequired={true}
                          // @ts-ignore
                          register={register}
                          errors={errors}
                        />
                      );
                    }}
                  />
                )}
              {propertyTypeDropDownOptions &&
                propertyTypeDropDownOptions.length > 0 && (
                  <Controller
                    name={dbRef.properties.p_type}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange } }) => {
                      return (
                        <FormInput
                          name={dbRef.properties.p_type}
                          labelKey={dbRef.properties.p_type}
                          labelText="Type"
                          defaultValue={defaultSelectValues.type}
                          type="select"
                          selectOnChange={onChange}
                          options={propertyTypeDropDownOptions}
                          isRequired={true}
                          // @ts-ignore
                          register={register}
                          errors={errors}
                        />
                      );
                    }}
                  />
                )}
            </div>

            <div className="flex-x gap-sm seller-section">
              <FormInput
                name={dbRef.buyer_seller.seller_1}
                labelKey={dbRef.buyer_seller.seller_1}
                labelText="Seller 1"
                type="text"
                customClass="f-100"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
              <FormInput
                name={dbRef.buyer_seller.seller_2}
                labelKey={dbRef.buyer_seller.seller_2}
                labelText="Seller 2"
                type="text"
                customClass="f-100"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
            </div>

            <div className="flex-x gap-sm seller-section">
              <FormInput
                name={dbRef.buyer_seller.seller_3}
                labelKey={dbRef.buyer_seller.seller_3}
                labelText="Seller 3"
                type="text"
                customClass="f-100"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
              <FormInput
                name={dbRef.buyer_seller.seller_4}
                labelKey={dbRef.buyer_seller.seller_4}
                labelText="Seller 4"
                type="text"
                customClass="f-100"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
            </div>

            <div className="flex-x gap-sm buyer-section">
              <FormInput
                name={dbRef.buyer_seller.buyer_1}
                labelKey={dbRef.buyer_seller.buyer_1}
                labelText="Buyer 1"
                type="text"
                customClass="f-100"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
              <FormInput
                name={dbRef.buyer_seller.buyer_2}
                labelKey={dbRef.buyer_seller.buyer_2}
                labelText="Buyer 2"
                type="text"
                customClass="f-100"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
            </div>

            <div className="flex-x comp-ref-file-num-section">
              {clientNames && clientNames.length > 0 && (
                <Controller
                  name={'clientName'}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => {
                    return (
                      <FormInput
                        name="clientName"
                        labelKey="clientName"
                        labelText="Client Name"
                        type="select"
                        defaultValue={defaultSelectValues.clientName}
                        customClass="clientName"
                        selectOnChange={onChange}
                        options={clientNames}
                        isRequired={true}
                        // @ts-ignore
                        register={register}
                        errors={errors}
                      />
                    );
                  }}
                />
              )}

              <FormInput
                name={dbRef.properties.p_comp_ref}
                labelKey={dbRef.properties.p_comp_ref}
                labelText="Comp Ref"
                customClass="compRef"
                type="number"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
                disabled
              />

              <FormInput
                name={dbRef.properties.p_file}
                labelKey={dbRef.properties.p_file}
                labelText="File #"
                customClass="fileNumber"
                type="text"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />

              <FormInput
                name={dbRef.properties.c_file}
                labelKey={dbRef.properties.c_file}
                labelText="Client's File #"
                customClass="clientFileNumber"
                type="text"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />
            </div>

            <div className="flex-x requester-req-date-close-date-section">
              {examinersDropDownOptions &&
                examinersDropDownOptions.length > 0 && (
                  <Controller
                    name={dbRef.properties.p_assign}
                    control={control}
                    render={({ field: { onChange } }) => {
                      return (
                        <FormInput
                          name={dbRef.properties.p_assign}
                          labelKey={dbRef.properties.p_assign}
                          labelText="Assigned"
                          type="select"
                          defaultValue={defaultSelectValues.assigned}
                          customClass="assigned"
                          selectOnChange={onChange}
                          options={examinersDropDownOptions}
                          isRequired={false}
                          // @ts-ignore
                          register={register}
                          errors={errors}
                        />
                      );
                    }}
                  />
                )}

              <FormInput
                name={dbRef.properties.p_requester}
                labelKey={dbRef.properties.p_requester}
                labelText="Requester"
                type="text"
                customClass="requester"
                isRequired={false}
                // @ts-ignore
                register={register}
                errors={errors}
              />

              <Controller
                name={dbRef.properties.p_request_date}
                control={control}
                render={({ field }) => {
                  return (
                    <FormInput
                      // @ts-ignore
                      field={field}
                      name={dbRef.properties.p_request_date}
                      labelKey={dbRef.properties.p_request_date}
                      labelText="Request Date"
                      type="date"
                      defaultValue={defaultSelectValues.assigned}
                      isRequired={false}
                      // @ts-ignore
                      register={register}
                      errors={errors}
                    />
                  );
                }}
              />

              <Controller
                name={dbRef.properties.p_closed_date}
                control={control}
                render={({ field }) => {
                  return (
                    <FormInput
                      // @ts-ignore
                      field={field}
                      name={dbRef.properties.p_closed_date}
                      labelKey={dbRef.properties.p_closed_date}
                      labelText="Closed Date"
                      type="date"
                      defaultValue={defaultSelectValues.assigned}
                      isRequired={false}
                      // @ts-ignore
                      register={register}
                      errors={errors}
                    />
                  );
                }}
              />
            </div>
          </section>

          <section className="instructions-section">
            <FormInput
              name={dbRef.properties.p_instructions}
              labelKey={dbRef.properties.p_instructions}
              labelText="Instructions"
              type="textarea"
              isRequired={false}
              // @ts-ignore
              register={register}
              errors={errors}
            />
          </section>

          <section className="submit-button-section">
            {queryType === 'update' ? (
              <PrintPropertyLabel propertyInfo={printLabelInfo as Property} />
            ) : null}
            <Button type="submit" isDisabled={isDirtyAlt}>
              {FORM_BUTTON_TEXT[queryType]}
            </Button>
          </section>

          <footer className="form-footer">
            {propertyInfoSnippet.lastUpdated && (
              <>
                <span>
                  Last Updated: {propertyInfoSnippet.lastUpdated.date}
                </span>
                <span className="italicized-text">
                  {propertyInfoSnippet.lastUpdated.time}
                </span>
              </>
            )}
          </footer>
        </form>
      )}
      {queryType === 'update' && propertyInfoSnippet.compRef ? (
        <Tabs>
          <TabList>
            <Tab>Seller / Buyer</Tab>
          </TabList>

          <TabPanel>
            <SubTableSellerBuyer compRef={propertyInfoSnippet.compRef} />
          </TabPanel>
        </Tabs>
      ) : null}
    </div>
  );
};

export default EditPropertyForm;
