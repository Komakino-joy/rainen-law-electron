import styles from './RegistryOfDeedsBreakDown.module.scss';

const ColumnHeader = () => (
  <div className={styles['column-header']}>
    <span></span>
    <span>Total</span>
    <span>(Assigned)</span>
  </div>
);

const RegistryOfDeedsBreakDown = ({
  countyCountMap,
  totalRecords,
}: {
  countyCountMap: {};
  totalRecords: number;
}) => {
  return (
    <div className={`light-border ${styles['registry-of-deeds-breakdown']}`}>
      <p>Breakdown by Registry of Deeds</p>
      <div className={styles['breakdown-by-county']}>
        <div>
          <ColumnHeader />
          {Object.keys(countyCountMap)
            .splice(0, Object.keys(countyCountMap).length / 2)
            .map((key) => (
              <div key={key} className={styles['county-detail']}>
                <span>{key}:</span>
                <span>
                  {countyCountMap[key as keyof typeof countyCountMap]}
                </span>
                <span>
                  {(
                    (countyCountMap[key as keyof typeof countyCountMap] /
                      totalRecords) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            ))}
        </div>
        <div>
          <ColumnHeader />
          {Object.keys(countyCountMap)
            .splice(Object.keys(countyCountMap).length / 2)
            .map((key) => (
              <div key={key} className={styles['county-detail']}>
                <span>{key}:</span>
                <span>
                  {countyCountMap[key as keyof typeof countyCountMap]}
                </span>
                <span>
                  {(
                    (countyCountMap[key as keyof typeof countyCountMap] /
                      totalRecords) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RegistryOfDeedsBreakDown;
