import Button from '@/components/Button/Button';
import FormInput from '@/components/Forms/FormInput/FormInput';
import InfoCard from '@/components/InfoCard/InfoCard';
import Spinner from '@/components/Spinner/Spinner';
import { ipc } from '@/constants/ipcEvents';
import { Property } from '@/contracts';
import { dateToString, timestampToDate } from '@/utils';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import styles from './PropertyLabelsReport.module.scss';
import ReportProperties from '@/components/Tables/PropertiesReport/PropertiesReport';
import PrintPropertyMultiple from '@/components/PrintPropertyMultiple/PrintPropertyMultiple';

const PropertyLabelsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, sethasSearched] = useState(false);
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [reportRunDate, setReportRunDate] = useState({
    start: '',
    end: '',
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: new Date(Date.now() - 86400000), // Previous day
      endDate: new Date(Date.now() - 86400000), // Previous day
    },
  });

  const onSubmit = async (data: any) => {
    setReportRunDate({
      start: data.startDate,
      end: data.endDate,
    });

    try {
      setIsLoading(true);
      data.startDate = dateToString(data.startDate);
      data.endDate = dateToString(data.endDate);

      await new Promise((resolve, reject) => {
        window.electron.ipcRenderer.sendMessage(ipc.postPropertiesPage, {
          page: 1,
          filters: JSON.stringify({
            inputStartDate: data.startDate,
            inputEndDate: data.endDate,
          }),
          pageSize: 9999,
        });

        window.electron.ipcRenderer.once(
          ipc.postPropertiesPage,
          ({ properties, message, status }) => {
            if (status === 'success') {
              setProperties(properties);
              window.scrollTo(0, 0);
              resolve(setIsLoading(false));
            } else {
              toast.error(message);
              reject(setIsLoading(false));
            }
          },
        );
      });
    } finally {
      setIsLoading(false);
      sethasSearched(true);
    }
  };

  return (
    <div className={`flex-y gap-md ${styles['property-page-content']}`}>
      <div className="form-wrapper is-date-selection card-shadow light-border center-margin">
        <form className="flex-y" onSubmit={handleSubmit(onSubmit)}>
          <section className="date-inputs">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => {
                return (
                  <FormInput
                    // @ts-ignore
                    field={field}
                    name="startDate"
                    labelKey="startDate"
                    labelText="Start Date"
                    type="date"
                    isRequired={false}
                    // @ts-ignore
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => {
                return (
                  <FormInput
                    // @ts-ignore
                    field={field}
                    name="endDate"
                    labelKey="endDate"
                    labelText="End Date"
                    type="date"
                    isRequired={false}
                    // @ts-ignore
                    register={register}
                    errors={errors}
                  />
                );
              }}
            />
            <div>
              <Button isDisabled={false} type={'submit'}>
                Submit
              </Button>
            </div>
          </section>
        </form>
      </div>
      {isLoading ? (
        <div className="page-spinner">
          <Spinner />
        </div>
      ) : properties && properties.length > 0 ? (
        <div className={styles['property-report-wrapper']}>
          <header>
            <p>Property labels for</p>
            <span>
              {timestampToDate(reportRunDate.start, 'mmDDyyyy').date} -{' '}
              {timestampToDate(reportRunDate.end, 'mmDDyyyy').date}
            </span>
          </header>

          {properties.length > 0 && (
            <div className={styles['print-report-button']}>
              <PrintPropertyMultiple properties={properties}>
                {`Print ${properties.length} ${
                  properties.length === 1 ? 'Label' : 'Labels'
                }`}
              </PrintPropertyMultiple>
            </div>
          )}

          <ReportProperties tableData={properties} />
        </div>
      ) : properties?.length === 0 && hasSearched ? (
        <InfoCard line1="No results found" />
      ) : (
        <div className={styles['info-section']}>
          <InfoCard line1="Select a date range" line2="to print labels" />
        </div>
      )}
    </div>
  );
};

export default PropertyLabelsPage;
