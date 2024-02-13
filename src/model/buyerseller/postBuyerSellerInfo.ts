import { getConn } from '../dbconfig';

export async function postBuyerSellerInfo(p_comp_ref: string) {
  try {
    const conn = await getConn();

    const getBuyerSellerInfoQuery = `
            SELECT * 
            FROM public.buyer_seller bs 
            WHERE bs.p_comp_ref = $1;
          `;

    const result = await conn.query(getBuyerSellerInfoQuery, [p_comp_ref]);

    return result.rows;
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      message: 'Unable to fetch buyer/seller data.',
    };
  }
}
