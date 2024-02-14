import { p_type_MAP } from '~/constants';
import styles from './TitlesBreakDown.module.scss';

const TitlesBreakDown = ({
  titleTypeMap,
  totalRecords,
}: {
  titleTypeMap: {};
  totalRecords: number;
}) => {
  return (
    <div className={`light-border ${styles['titles-breakdown-container']}`}>
      {Object.keys(titleTypeMap).map((key) => (
        <div key={key} className={styles['title-detail']}>
          <span>
            {p_type_MAP[key as keyof typeof p_type_MAP] || key}:&nbsp;
          </span>
          <span>{titleTypeMap[key as keyof typeof titleTypeMap]}</span>
          <span>
            {(
              (titleTypeMap[key as keyof typeof titleTypeMap] / totalRecords) *
              100
            ).toFixed(2)}
            %
          </span>
        </div>
      ))}
      <div className={styles['column-footer']}>
        <span>Total:&nbsp;</span>
        <span>{totalRecords}</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default TitlesBreakDown;
