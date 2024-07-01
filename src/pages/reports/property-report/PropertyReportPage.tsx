import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import Button from '@/components/Button/Button';
import FormInput from '@/components/Forms/FormInput/FormInput';
import InfoCard from '@/components/InfoCard/InfoCard';
import ReportProperties from '@/components/Tables/PropertiesReport/PropertiesReport';
import RegistryOfDeedsBreakDown from '@/components/RegistryOfDeedsBreakDown/RegistryOfDeedsBreakDown';
import Spinner from '@/components/Spinner/Spinner';
import TitlesBreakDown from '@/components/TitleBreakDown/TitlesBreakDown';
import { ipc } from '~/constants/ipcEvents';
import { Property, ReportProperty } from '~/contracts';
import { dateToString, timestampToDate } from '~/utils';
import styles from './PropertyReport.module.scss';
import { usePropertiesContext } from '@/context/PropertiesContext';

export default function PropertyReport() {
  const { propertiesSelectOptions, isLoadingPropertyContext } =
    usePropertiesContext();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, sethasSearched] = useState(false);
  const [propertiesData, setPropertiesData] = useState<Property[] | null>(null);
  const [countyCountMap, setCountyCountMap] = useState({});
  const [titleTypeMap, setTitleTypeMap] = useState({});
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
      startDate: Date.now(),
      endDate: Date.now(),
      p_status: '',
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

      await new Promise((resolve) => {
        window.electron.ipcRenderer.sendMessage(ipc.postPropertyReport, data);
        window.electron.ipcRenderer.once(
          ipc.postPropertyReport,
          ({ data, status, message }) => {
            if (status === 'success') {
              setPropertiesData(data);

              setCountyCountMap(
                data.reduce((acc: any, propObj: ReportProperty) => {
                  if (!acc[propObj.county_name]) {
                    acc[propObj.county_name] = 1;
                  } else {
                    acc[propObj.county_name] = acc[propObj.county_name] + 1;
                  }
                  return acc;
                }, {}),
              );

              setTitleTypeMap(
                data.reduce((acc: any, propObj: ReportProperty) => {
                  if (!acc[propObj.p_type]) {
                    acc[propObj.p_type] = 1;
                  } else {
                    acc[propObj.p_type] = acc[propObj.p_type] + 1;
                  }
                  return acc;
                }, {}),
              );
            } else {
              toast[status](message, { id: 'post-property-report' });
            }
            resolve('');
          },
        );
      });
    } finally {
      setIsLoading(false);
      sethasSearched(true);
    }
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getPageMargins = () => {
    return `@page { margin: 10px 20px !important; }`;
  };

  if (isLoadingPropertyContext)
    return <Spinner containerClassName="page-spinner" />;

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

            {propertiesSelectOptions.p_status &&
              propertiesSelectOptions.p_status.length > 0 && (
                <Controller
                  name="p_status"
                  control={control}
                  render={({ field: { onChange } }) => {
                    return (
                      <FormInput
                        defaultValue="All"
                        name="p_status"
                        labelKey="p_status"
                        labelText="Status"
                        type="select"
                        customClass={styles['status-selection']}
                        selectOnChange={onChange}
                        options={[
                          { label: 'All', value: '' },
                          ...propertiesSelectOptions.p_status,
                        ]}
                        isRequired={false}
                        // @ts-ignore
                        register={register}
                        errors={errors}
                      />
                    );
                  }}
                />
              )}

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
      ) : propertiesData && propertiesData.length > 0 ? (
        <div className={styles['property-report-wrapper']}>
          <style>{getPageMargins()}</style>
          <Button
            onClick={handlePrint}
            isDisabled={false}
            type={'button'}
            customClass={styles['print-report-button']}
          >
            Print Report
          </Button>
          <div
            ref={componentRef}
            className={styles['property-report-printable-area']}
          >
            <header>
              <p>Property Report</p>
              <span>
                {timestampToDate(reportRunDate.start, 'mmDDyyyy').date} -{' '}
                {timestampToDate(reportRunDate.end, 'mmDDyyyy').date}
              </span>
            </header>

            <ReportProperties tableData={propertiesData} />
            <span className={styles.total}>
              Total Projects On Order: {propertiesData.length}
            </span>

            <TitlesBreakDown
              totalRecords={propertiesData.length}
              titleTypeMap={titleTypeMap}
            />

            <RegistryOfDeedsBreakDown
              totalRecords={propertiesData.length}
              countyCountMap={countyCountMap}
            />
          </div>
        </div>
      ) : propertiesData?.length === 0 && hasSearched ? (
        <InfoCard line1="No results found" />
      ) : (
        <div className={styles['info-section']}>
          <InfoCard line1="Select a date range" line2="to generate report" />
        </div>
      )}
    </div>
  );
}
