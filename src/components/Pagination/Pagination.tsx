import React from 'react';
import styles from './Pagination.module.scss';
import { useNavigate } from 'react-router-dom';

interface OwnProps {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  href: string;
}

const Pagination: React.FC<OwnProps> = ({
  totalRecords,
  pageSize,
  currentPage,
  href,
}) => {
  if (totalRecords < pageSize) return null;

  const navigate = useNavigate();
  const totalPages = Math.floor(totalRecords / pageSize) || 1;
  const siblingCount = 5;
  const leftHandSiblings = Array.from(
    { length: siblingCount },
    (_, i) => currentPage - siblingCount + i,
  );
  const rightHandSiblings = Array.from(
    { length: siblingCount },
    (_, i) => currentPage + i + 1,
  );

  return (
    <div className={styles['pagination-controls']}>
      {currentPage !== 1 && (
        <>
          <span
            onClick={() => navigate(`/${href}/1`)}
            className={styles['pagination-button']}
          >
            {'<<'}
          </span>
          <span
            onClick={() => navigate(`/${href}/${currentPage - 1}`)}
            className={styles['pagination-button']}
          >
            {'<'}
          </span>
        </>
      )}

      {[...leftHandSiblings, currentPage, ...rightHandSiblings].map(
        (pageNumber) => {
          if (pageNumber <= 0) return null;
          if (pageNumber > totalPages) return null;
          return (
            <span
              key={pageNumber}
              onClick={() => navigate(`/${href}/${pageNumber}`)}
              className={`${styles['pagination-button']} ${
                pageNumber === currentPage ? styles['active'] : ''
              }`}
            >
              {pageNumber}
            </span>
          );
        },
      )}

      {currentPage !== totalPages && (
        <>
          <span
            className={styles['pagination-button']}
            onClick={() => navigate(`/${href}/${currentPage + 1}`)}
          >
            {'>'}
          </span>
          <span
            className={styles['pagination-button']}
            onClick={() => navigate(`/${href}/${totalPages}`)}
          >
            {'>>'}
          </span>
        </>
      )}
    </div>
  );
};

export default Pagination;
